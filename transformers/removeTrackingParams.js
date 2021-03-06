const R = require('ramda')
const Rxo = require('rxjs/operators')
const urlParse = require('url-parse')
const qs = require('query-string')
const { keyFilter } = require('../helpers/object')

const hrefLens = R.lensProp('href')

const isTrackingParam = name =>
  R.any(
    R.identity,
    R.map(r => r.test(name), [/^utm_*/, /^fbclid$/])
  )

const removeUTMFromQuery = R.compose(
  qs.stringify,
  keyFilter(R.complement(isTrackingParam)),
  qs.parse
)

const main = link => {
  const href = R.view(hrefLens, link)

  const url = urlParse(href)
  const query = removeUTMFromQuery(url.query || '')
  url.set('query', query)

  return R.set(hrefLens, url.toString(), link)
}

module.exports = [Rxo.map(main)]
