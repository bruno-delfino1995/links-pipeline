const R = require('ramda')
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

const matchPath = R.curry((regex, href) =>
  R.compose(
    R.not,
    R.isEmpty,
    R.match(regex),
    R.prop('pathname'),
    urlParse
  )(href)
)

module.exports = {
  matchDomain,
  matchPath
}
