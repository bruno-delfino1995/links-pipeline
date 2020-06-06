const path = require('path')

const fromLog = require('../extractors/fromLog')

const removeByDomain = require('../transformers/removeByDomain')
const resolveAMPProject = require('../transformers/resolveAMPProject')
const removeTrackingParams = require('../transformers/removeTrackingParams')
const addKind = require('../transformers/addKind')
const customizeSearch = require('../transformers/customizeSearch')
const normalizeTags = require('../transformers/normalizeTags')
const resolveMoves = require('../transformers/resolveMoves')

module.exports = {
  command: 'normalize <file>',
  aliases: '$0',
  desc: 'Normalize log file where each line is an entry',
  builder: (y) => {
    y.positional('file', {
      desc: 'Path to source file',
      type: 'string'
    })
  },
  handler: (argv) => {
    const file = path.resolve(argv.file)

    return fromLog(file)
      .pipe(...removeByDomain)
      .pipe(...resolveAMPProject)
      .pipe(...removeTrackingParams)
      .pipe(...addKind)
      .pipe(...customizeSearch)
      .pipe(...normalizeTags)
      .pipe(...resolveMoves)
  }
}
