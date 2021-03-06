const R = require('ramda')
const qs = require('query-string')
const urlParse = require('url-parse')

const matchDomain = R.curry((regex, href) =>
  R.compose(
    R.not,
    R.isEmpty,
    R.match(regex),
    R.prop('hostname'),
    urlParse
  )(href)
)

const getQuery = R.curry((name, href) =>
  R.compose(R.prop(name), qs.parse, R.prop('query'), urlParse)(href)
)

module.exports = {
  matchDomain,
  getQuery
}
