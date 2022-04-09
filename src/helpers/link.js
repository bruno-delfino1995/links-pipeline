const R = require('ramda')

const { isUseless } = require('./predicates')

// defaults :: Link
const defaults = {
  href: '',
  title: '',
  tags: [],
  alive: false
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

const mergeBoolean = R.unapply(R.compose(
  R.defaultTo(false),
  R.apply(R.or),
  R.drop(1)
))

// concat :: Link -> Link -> Link
const concat = R.mergeDeepWithKey(
  R.cond([
    [R.equals('tags'), mergeArray],
    [R.equals('alive'), mergeBoolean],
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

module.exports = {
  fromString,
  fromObject,
  concat,
  lens
}
