const fs = require('fs')
const Rxo = require('rxjs/operators')
const isStream = require('is-stream')

const fromStream = require('./fromStream')
const { byLine } = require('../helpers/operators')

const fromJsonl = (path) => fromStream(
  () => (isStream.readable(path)
    ? path
    : fs.createReadStream(path)
  )
)
  .pipe(byLine)
  .pipe(Rxo.map(JSON.parse))

module.exports = fromJsonl
