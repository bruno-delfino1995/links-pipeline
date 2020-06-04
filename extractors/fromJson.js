const R = require('ramda');
const Rx = require('rxjs')
const Rxo = require('rxjs/operators')

const fromFile = require('./fromFile')

const main = (path) => fromFile(path)
  .pipe(Rxo.mergeMap(data => Rx.from(JSON.parse(data))))

module.exports = main
