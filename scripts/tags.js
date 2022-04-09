const R = require('ramda')
const Rxo = require('rxjs/operators')
const yargs = require('yargs')

const map = require('../src/files/map')
const { lens } = require('../src/helpers/link')

yargs
  .command({
    command: '$0 [input] [output]',
    builder: (y) => {
      y.positional('input', {
        type: 'string',
        default: 'input.jsonl'
      }).positional('output', {
        type: 'string',
        default: 'tags.txt'
      })
    },
    handler: (argv) => {
      const main = map(obs => obs
        .pipe(
          Rxo.map(R.view(lens.tags)),
          Rxo.reduce(R.concat, []),
          Rxo.map(R.uniq),
          Rxo.mergeMap(R.identity)
        )
      )

      return main(argv.input, argv.output)
    }
  })
  .parse(process.argv.slice(2))
