const R = require('ramda')
const Rxo = require('rxjs/operators')
const { bufferWhile } = require('../helpers/operators')
const { defaults, concat, lens } = require('../helpers/link')

const indexLens = R.lensIndex(1)
const valueLens = R.lensIndex(0)
const hrefLens = R.compose(valueLens, lens.href)


const intoArray = R.converge(R.concat, [
  R.identity,
  R.compose(
    Array.of,
    R.nthArg(1)
  )
])

const withIndex = R.addIndex(R.map)(R.unapply(R.take(2)))

const unzip = R.reduce(
  ([values, indexes], [value, index]) => ([R.append(value, values), R.append(index, indexes)]),
  [[], []]
)

const merge = R.converge(Array.of, [
  R.compose(
    R.reduce(concat, defaults),
    R.nth(0)
  ),
  R.compose(
    R.nth(0),
    R.nth(1)
  )
])

module.exports = [
  // Sort by href, but keep index, for bufferWhile
  Rxo.reduce(intoArray, []),
  Rxo.map(withIndex),
  Rxo.mergeMap(R.sortBy(R.view(hrefLens))),

  // Group everything by href and merge back into [value, index]
  bufferWhile(R.compose(
    R.apply(R.equals),
    R.unapply(R.map(R.view(hrefLens)))
  )),
  Rxo.map(unzip),
  Rxo.map(merge),

  // Sort by index to restore original order
  Rxo.reduce(intoArray, []),
  Rxo.mergeMap(R.sortBy(R.view(indexLens))),
  Rxo.map(R.view(valueLens))
]
