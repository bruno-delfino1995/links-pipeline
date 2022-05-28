const R = require('ramda')
const Rxo = require('rxjs/operators')

const { fromObject, toString } = require('../helpers/link')
const { isUseless } = require('../helpers/predicates')

const main = R.evolve({
  title: R.trim,
  tags: R.compose(
    R.map(R.trim),
    R.reject(isUseless),
    R.chain(R.split(',')),
    R.map(R.toLower)
  )
})

module.exports = [
  Rxo.map(fromObject),
  Rxo.map(main),
  Rxo.map(toString)
]
