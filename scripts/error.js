const R = require('ramda')
const Rxo = require('rxjs/operators')
const yargs = require('yargs')

const map = require('../src/files/map')
const normalize = require('../src/transformers/normalize')
const { lens } = require('../src/helpers/link')
const { matchDomain } = require('../src/helpers/href')

const mapper = R.when(R.compose(matchDomain(/www\.amazon\.com/), R.view(lens.href)), R.set(lens.error, "Error: Manual Retry"))

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
      const main = map(obs => obs
        .pipe(Rxo.map(mapper))
        .pipe(...normalize)
      )

      return main(argv.input, argv.output)
    }
  })
  .parse(process.argv.slice(2))
