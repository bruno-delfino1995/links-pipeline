const Rxo = require('rxjs/operators')

const main = (observable) => observable.pipe(Rxo.toArray()).toPromise()

module.exports = main
