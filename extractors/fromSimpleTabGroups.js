const R = require('ramda')
const Rxo = require('rxjs/operators')
const fromJson = require('./fromJson')
const { fromObject } = require('../helpers/link')

const convert = R.compose(
  R.chain(({ title, tabs }) => {
    const tags = R.compose(
      R.map(R.toLower),
      R.reject(R.isEmpty),
      R.map(R.trim),
      R.split(',')
    )(title)

    const links = R.compose(
      R.map(fromObject),
      R.map(({ title, url }) => ({ href: url, title, tags }))
    )(tabs)

    return links
  }),
  R.prop('groups')
)

const main = path => fromJson(path)
  .pipe(Rxo.mergeMap(convert))

module.exports = main
