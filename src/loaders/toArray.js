const Rx = require('rxjs')
const Rxo = require('rxjs/operators')

const main = (observable) => Rx.lastValueFrom(observable.pipe(Rxo.toArray()), { defaultValue: [] })

module.exports = main
