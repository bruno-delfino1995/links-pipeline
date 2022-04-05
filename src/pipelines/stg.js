const path = require('path')

const fromSimpleTabGroups = require('../extractors/fromSimpleTabGroups')

module.exports = {
  command: 'stg <file>',
  desc: 'Extract from simple tab groups exported file',
  builder: (y) => {
    y.positional('file', {
      desc: 'Path to source file',
      type: 'string'
    })
  },
  handler: (argv) => {
    const file = path.resolve(argv.file)

    return fromSimpleTabGroups(file)
  }
}
