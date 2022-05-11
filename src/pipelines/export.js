const path = require('path')

const fromJsonl = require('../extractors/fromJsonl')
const bookmarked = require('../transformers/bookmarked')

module.exports = {
  command: 'export <file>',
  desc: 'Exports from JSONL to Netscape HTML',
  builder: (y) => {
    y.positional('file', {
      desc: 'Path to source file in jsonl format',
      type: 'string'
    })
  },
  handler: (argv) => {
    const file = path.resolve(argv.file)

    return fromJsonl(file)
      .pipe(...bookmarked)
  }
}
