const path = require('path')

const fromJsonl = require('../extractors/fromJsonl')

const playground = require('../transformers/playground')

module.exports = {
  command: 'playground',
  aliases: '$0',
  desc: 'Test the playground pipeline against a jsonl from stdin',
  handler: (argv) => {
    return fromJsonl(process.stdin)
      .pipe(...playground)
  }
}
