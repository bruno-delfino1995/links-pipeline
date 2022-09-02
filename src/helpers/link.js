const R = require('ramda')

const { isUseless, isUseful } = require('./predicates')

// defaults :: Link
const defaults = {
  href: '',
  title: '',
  tags: [],
  error: null,
  attempts: 0
}

const lens = R.compose(
  R.fromPairs,
  R.map(([k, _]) => [k, R.lensProp(k)]),
  R.toPairs
)(defaults)

const mergeString = R.unapply(R.compose(
  R.defaultTo(''),
  R.head(),
  R.reject(isUseless),
  R.reverse,
  R.drop(1)
))

const mergeArray = R.unapply(R.compose(
  R.uniq,
  R.apply(R.concat),
  R.drop(1)
))

const mergeInteger = R.unapply(R.compose(
  R.sum,
  R.drop(1)
))

// concat :: Link -> Link -> Link
const concat = R.mergeDeepWithKey(
  R.cond([
    [R.equals('tags'), mergeArray],
    [R.equals('attempts'), mergeInteger],
    [R.T, mergeString]
  ])
)

// fromObject :: Object -> Link
const fromObject = R.compose(
  concat(defaults),
  R.pick(R.keys(defaults))
)

// fromString :: String -> Link
const fromString = R.compose(
  fromObject,
  link => ({ href: link })
)

// toString :: Link -> String
const toString = R.compose(
  JSON.stringify,
  R.when(
    R.compose(R.equals(0), R.view(lens.attempts)),
    R.omit(['attempts'])
  ),
  R.filter(isUseful)
)

module.exports = {
  fromString,
  toString,
  fromObject,
  concat,
  lens
}
