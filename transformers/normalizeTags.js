const R = require('ramda')
const Rxo = require('rxjs/operators')

const tagsLens = R.lensProp('tags')

const main = R.over(tagsLens, R.compose(
  R.reject(R.isEmpty),
  R.chain(R.split(',')),
  R.map(R.toLower),
  R.when(
    R.anyPass([R.isNil, R.isEmpty]),
    R.always([])
  )
))

module.exports = [Rxo.map(main)]
