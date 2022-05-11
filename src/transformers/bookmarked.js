const R = require('ramda')
const Rxo = require('rxjs/operators')
const { bookmarked } = require('bookmarked')
const { lens } = require('../helpers/link')

const format = (link) => ({
  href: R.view(lens.href, link),
  name: R.view(lens.title, link),
  properties: {
    TAGS: R.compose(
      R.join(','),
      R.view(lens.tags)
    )(link)
  }
})

module.exports = [
  Rxo.map(format),
  Rxo.toArray(),
  Rxo.map(bookmarked)
]
