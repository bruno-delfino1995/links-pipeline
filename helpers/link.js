const R = require('ramda')

// defaults :: Link
const defaults = { href: "", kind: "", tags: [], title: "", body: "" }

const lens = R.compose(
    R.fromPairs,
    R.map(([k, _]) => [k, R.lensProp(k)]),
    R.toPairs
)(defaults)

// merge :: String -> a -> a -> a
const merge = R.unapply(R.converge(R.defaultTo, [R.nth(1), R.nth(2)]))

// mergeTags :: String -> [a] -> [a] -> [a]
const mergeTags = R.unapply(R.compose(R.uniq, R.apply(R.concat), R.drop(1)))

// concat :: Link -> Link -> Link
const concat = R.mergeDeepWithKey(
    R.cond([
        [R.equals('tags'), mergeTags],
        [R.T, merge],
    ])
)

// clean :: Object -> Link
const clean = R.pick(R.keys(defaults))


module.exports = {
    defaults,
    clean,
    concat,
    lens,
}
