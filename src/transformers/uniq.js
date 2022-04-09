const R = require('ramda')
const Rxo = require('rxjs/operators')
const { bufferWhile, withIndex } = require('../helpers/operators')
const { defaults, concat, lens } = require('../helpers/link')

const index = R.lensIndex(1)
const value = R.lensIndex(0)
const href = R.compose(value, lens.href)

const unzip = R.reduce(
  ([values, indexes], [value, index]) => ([R.append(value, values), R.append(index, indexes)]),
  [[], []]
)

const merge = R.compose(
  R.over(value, R.reduce(concat, defaults)),
  R.over(index, R.head)
)

module.exports = [
  // Sort by href, but keep index, for bufferWhile
  withIndex,
  Rxo.toArray(),
  Rxo.mergeMap(R.sortBy(R.view(href))),

  // Group everything by href and merge back into [value, index]
  bufferWhile(R.compose(
    R.apply(R.equals),
    R.unapply(R.map(R.view(href)))
  )),
  Rxo.map(unzip),
  Rxo.map(merge),

  // Sort by index to restore original order
  Rxo.toArray(),
  Rxo.mergeMap(R.sortBy(R.view(index))),
  Rxo.map(R.view(value))
]
