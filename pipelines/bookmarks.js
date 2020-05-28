const path = require('path')

const fromBookmarks = require('../extractors/fromBookmarks')

const removeTrackingParams = require('../transformers/removeTrackingParams')
const removeByDomain = require('../transformers/removeByDomain')
const resolveAMPProject = require('../transformers/resolveAMPProject')
const removeDuplicates = require('../transformers/removeDuplicates')
const addKind = require('../transformers/addKind')

module.exports = {
  command: 'bookmarks <file>',
  aliases: '$0',
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
      .pipe(...removeTrackingParams)
      .pipe(...removeByDomain)
      .pipe(...resolveAMPProject)
      .pipe(...removeDuplicates)
      .pipe(...addKind)
  }
}
