const Rxo = require('rxjs/operators')

const fromFile = require('./fromFile')

const main = (path) => fromFile(path)
  .pipe(Rxo.map(data => JSON.parse(data)))

module.exports = main
