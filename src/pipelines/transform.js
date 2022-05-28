const R = require('ramda')
const Rxo = require('rxjs/operators')

const fromJsonl = require('../extractors/fromJsonl')
const { fromObject } = require('../helpers/link')

const normalizeTransformers = [
  'normalize',
  'exclude',
  'resolve',
  'uniq'
]

module.exports = {
  command: 'transform',
  aliases: '$0',
  desc: 'Runs all transformers over JSONL from stdin',
  builder: (y) => {
    y.option('transformer', {
      alias: 't',
      array: true,
      desc: 'Module name for transformer',
      type: 'string',
      demandOption: true,
      default: normalizeTransformers,
      defaultDescription: 'normalization pipeline'
    })
  },
  handler: (argv) => {
    const pipes = R.compose(
      R.flatten,
      R.map(name => require(`../transformers/${name}`))
    )(argv.transformer)

    return fromJsonl(process.stdin)
      .pipe(Rxo.map(fromObject))
      .pipe(...pipes)
  }
}
