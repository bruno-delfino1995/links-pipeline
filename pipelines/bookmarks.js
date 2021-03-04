const path = require('path')

const fromBookmarks = require('../extractors/fromBookmarks')

module.exports = {
  command: 'bookmarks <file>',
  desc: 'Extract from bookmarks file',
  builder: (y) => {
    y.positional('file', {
      desc: 'Path to source file',
      type: 'string'
    })
  },
  handler: (argv) => {
    const file = path.resolve(argv.file)

    return fromBookmarks(file)
  }
}
