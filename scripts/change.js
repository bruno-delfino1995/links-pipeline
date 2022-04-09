const R = require('ramda')
const Rxo = require('rxjs/operators')
const yargs = require('yargs')

const map = require('../src/files/map')
const normalize = require('../src/transformers/normalize')
const { lens } = require('../src/helpers/link')
const { wrap } = require('../src/helpers/array')

const tag = {
  remove: (regex) => R.over(lens.tags, R.chain(
    R.ifElse(
      R.test(regex),
      R.always([]),
      wrap
    )
  )),

  map: (regex, replace) => R.over(lens.tags, R.map(
    R.when(R.test(regex), R.replace(regex, replace))
  )),

  split: (separator) => R.over(lens.tags, R.chain(R.split(separator)))
}

yargs
  .command({
    command: '$0 [input] [output]',
    builder: (y) => {
      y.positional('input', {
        type: 'string',
        default: 'input.jsonl'
      }).positional('output', {
        type: 'string',
        default: 'output.jsonl'
      })
    },
    handler: (argv) => {
      const mapper = R.compose(
        tag.remove(/later/),
        tag.remove(/default/),
        tag.remove(/bookmarks/),
        tag.remove(/folder/),
        tag.map(/^groups?:(.*)/, '$1'),
        tag.split(/ \+ /)
      )

      const main = map(obs => obs
        .pipe(Rxo.map(mapper))
        .pipe(...normalize)
      )

      return main(argv.input, argv.output)
    }
  })
  .parse(process.argv.slice(2))
