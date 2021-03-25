const R = require('ramda')
const Rxo = require('rxjs/operators')
const fromJson = require('./fromJson')

const convert = R.compose(
  R.chain(({ title, tabs }) => {
    const tags = R.split(',', title)

    return R.map(
      ({ title, url }) => ({ href: url, title, tags }),
      tabs
    )
  }),
  R.prop('groups')
)

const main = path => fromJson(path)
  .pipe(Rxo.mergeMap(convert))

module.exports = main
