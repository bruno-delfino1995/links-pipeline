const path = require('path')
const R = require('ramda')
const Rx = require('rxjs')

const fromJsonl = require('../extractors/fromJsonl')

const uniq = require('../transformers/uniq')
const normalize = require('../transformers/normalize')

module.exports = {
  command: 'merge <files..>',
  desc: 'Merges all JSONL files into one',
  builder: (y) => {
    y.positional('files', {
      desc: 'Paths to files with links',
      type: 'array'
    })
  },
  handler: (argv) => {
    const asObservable = R.compose(
      fromJsonl,
      path.resolve
    )

    const observable = R.compose(
      R.apply(Rx.merge),
      R.map(asObservable)
    )(argv.files)

    return observable
      .pipe(...normalize)
      .pipe(...uniq)
  }
}
