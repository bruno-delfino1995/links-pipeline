const R = require('ramda');
const Rxo = require('rxjs/operators')

const main = R.evolve({ tags: R.concat(['favorites']) })

module.exports = [Rxo.map(main)]
