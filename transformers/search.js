const R = require('ramda')
const Rxo = require('rxjs/operators')
const { getQuery } = require('../helpers/href')

const kindLens = R.lensProp('kind')
const hrefLens = R.lensProp('href')

const isSearch = R.compose(R.equals('#search'), R.view(kindLens))

const googleSearch = /^(https?:\/\/)?(www\.)?google\.com(\.[^.]*?)?\/search/
const googlePredicate = R.propSatisfies(
  (l) => googleSearch.test(l),
  'href'
)

const googleTransformer = link => {
  const term = getQuery('q', R.view(hrefLens, link))

  return {
    ...link,
    title: term,
    href: `https://google.com/search?q=${encodeURIComponent(term)}`
  }
}

const customize = R.cond([
  [googlePredicate, googleTransformer],
  [R.T, R.identity]
])

const main = R.when(isSearch, customize)

module.exports = [Rxo.map(main)]
