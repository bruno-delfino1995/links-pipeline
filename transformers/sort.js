const R = require('ramda')
const Rxo = require('rxjs/operators')

module.exports = [
  Rxo.reduce(R.converge(R.concat, [
    R.identity,
    R.compose(
      Array.of,
      R.unapply(R.nth(1))
    )
  ]), []),
  Rxo.mergeMap(R.sortBy(R.prop('href')))
]
