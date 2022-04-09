const fs = require('fs')
const fromJsonl = require('../src/extractors/fromJsonl')
const toStream = require('../src/loaders/toStream')

const main = (source, dest) => {
  let stream = fs.createWriteStream(dest)
  let observable = fromJsonl(source)

  observable.subscribe(toStream(stream))

  return observable.toPromise()
}

module.exports = main
