const path = require('path')
const R = require('ramda')
const Rxo = require('rxjs/operators')

const fromJson = require('../extractors/fromJson')
const normalize = require('../transformers/normalize')

module.exports = {
  command: 'json <file>',
  desc: 'Extract from json file following links schema',
  builder: (y) => {
    y.positional('file', {
      desc: 'Path to source file',
      type: 'string'
    })
  },
  handler: (argv) => {
    const file = path.resolve(argv.file)

    return fromJson(file)
      .pipe(Rxo.mergeMap(R.identity))
      .pipe(...normalize)
  }
}
