const path = require('path')
const Rxo = require('rxjs/operators')

const fromFile = require('../extractors/fromFile')
const { byLine } = require('../helpers/operators')
const { fromString } = require('../helpers/link')

module.exports = {
  command: 'text <file>',
  desc: 'Extract from simple text file',
  builder: (y) => {
    y.positional('file', {
      desc: 'Path to source file',
      type: 'string'
    })
  },
  handler: (argv) => {
    const file = path.resolve(argv.file)

    return fromFile(file)
      .pipe(byLine)
      .pipe(Rxo.map(fromString))
  }
}
