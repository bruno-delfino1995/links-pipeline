const fs = require('fs')
const Rx = require('rxjs')

const readFileAsObservable = Rx.bindNodeCallback(fs.readFile)

const fromFile = (path) => Rx.defer(() => readFileAsObservable(path, 'utf8'))

module.exports = fromFile
