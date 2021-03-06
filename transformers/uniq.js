const R = require('ramda');
const Rxo = require('rxjs/operators')
const { bufferWhile } = require('../helpers/operators')
const { defaults, concat, lens } = require('../helpers/link')

// NOTE: Group by will emit GroupedObservables while keeping an index in memory
// module.exports = [
//   Rxo.groupBy(R.view(lens.href)),
//   Rxo.map(group => group.pipe(Rxo.reduce(concat, defaults))),
//   Rxo.mergeMap(R.identity),
// ]

module.exports = [
  bufferWhile(R.compose(
    R.apply(R.equals),
    R.unapply(R.map(R.view(lens.href)))
  )),
  Rxo.map(R.reduce(concat, defaults)),
]
