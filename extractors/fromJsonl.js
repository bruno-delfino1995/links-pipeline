const fs = require('fs')
const Rxo = require('rxjs/operators')
const isStream = require('is-stream')

const fromStream = require('./fromStream')

const fromLog = (path) => fromStream(() => isStream.readable(path) ? path : fs.createReadStream(path))
  .pipe(Rxo.scan(({ buffer }, b) => {
    const splitted = buffer.concat(b).split("\n");
    const rest = splitted.pop();
    return { buffer: rest, items: splitted };
  }, { buffer: "", items: [] }))
  .pipe(Rxo.concatMap(({ items }) => items))
  .pipe(Rxo.map(JSON.parse))

module.exports = fromLog