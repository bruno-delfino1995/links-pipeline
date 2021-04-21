const R = require('ramda')

const { isUseless } = require('./predicates')

// defaults :: Link
const defaults = {
  href: '',
  kind: '',
  title: '',
  body: '',
  tags: [],
  sources: [],
  hits: 0
}

const lens = R.compose(
  R.fromPairs,
  R.map(([k, _]) => [k, R.lensProp(k)]),
  R.toPairs
)(defaults)

const mergeNumber = R.unapply(R.compose(
  R.reduce(R.add, 0),
  R.drop(1)
))

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

// concat :: Link -> Link -> Link
const concat = R.mergeDeepWithKey(
  R.cond([
    [R.equals('hits'), mergeNumber],
    [R.equals('tags'), mergeArray],
    [R.equals('sources'), mergeArray],
    [R.T, mergeString]
  ])
)

// fromObject :: Object -> Link
const fromObject = R.compose(
  R.over(lens.hits, R.when(R.equals(0), R.always(1))),
  concat(defaults),
  R.pick(R.keys(defaults))
)

module.exports = {
  fromObject,
  concat,
  lens
}
