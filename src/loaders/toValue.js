const Rx = require('rxjs')

const main = (observable) => Rx.lastValueFrom(observable, { defaultValue: null })

module.exports = main
