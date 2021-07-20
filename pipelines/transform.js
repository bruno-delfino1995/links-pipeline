const R = require('ramda')

const fromJsonl = require('../extractors/fromJsonl')

const normalizeTransformers = [
  'normalize',
  'removeByDomain',
  'resolveAMPProject',
  'removeTrackingParams',
  'addKind',
  'customizeSearch',
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
      default: normalizeTransformers
    })
  },
  handler: (argv) => {
    const pipes = R.flatten(R.map(
      (name) => require(`../transformers/${name}`),
      argv.transformer
    ))

    return fromJsonl(process.stdin)
      .pipe(...pipes)
  }
}
