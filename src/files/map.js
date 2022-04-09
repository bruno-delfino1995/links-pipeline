const fs = require('fs')
const R = require('ramda')
const fromJsonl = require('../extractors/fromJsonl')
const toStream = require('../loaders/toStream')

const main = R.curry((map, source, dest) => {
  const stream = fs.createWriteStream(dest)
  const observable = map(fromJsonl(source))

  return toStream(stream, observable)
})

module.exports = main
