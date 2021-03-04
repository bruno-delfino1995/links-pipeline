const path = require('path')

const fromJsonl = require('../extractors/fromJsonl')

const removeByDomain = require('../transformers/removeByDomain')
const resolveAMPProject = require('../transformers/resolveAMPProject')
const removeTrackingParams = require('../transformers/removeTrackingParams')
const addKind = require('../transformers/addKind')
const customizeSearch = require('../transformers/customizeSearch')
const normalizeTags = require('../transformers/normalizeTags')
const resolveMoves = require('../transformers/resolveMoves')

module.exports = {
  command: 'normalize <file>',
  desc: 'Normalize log file where each line is an entry',
  builder: (y) => {
    y.positional('file', {
      desc: 'Path to source file',
      type: 'string'
    })
  },
  handler: (argv) => {
    const file = path.resolve(argv.file)

    return fromJsonl(file)
      .pipe(...removeByDomain)
      .pipe(...resolveAMPProject)
      .pipe(...removeTrackingParams)
      .pipe(...addKind)
      .pipe(...customizeSearch)
      .pipe(...normalizeTags)
      .pipe(...resolveMoves)
  }
}
