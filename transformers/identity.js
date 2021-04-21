const R = require('ramda')
const Rxo = require('rxjs/operators')

module.exports = [
  Rxo.map(R.identity)
]
