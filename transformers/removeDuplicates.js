const R = require('ramda');
const Rxo = require('rxjs/operators')

const hrefLens = R.lensProp('href');
const tagsLens = R.lensProp('tags');

const main = R.reduce((acc, el) => {
  const key = R.view(hrefLens, el)
  const previous = acc[key] || {}

  return {
    ...acc,
    [key]: R.set(
      hrefLens,
      el.href,
      R.set(
        tagsLens,
        R.uniq(R.concat(previous.tags || [], el.tags || [])),
        R.mergeLeft(previous, el)
      )
    )
  }
}, {})

// Double pass to remove duplicates at the intersection borders
module.exports = [
  Rxo.bufferCount(1000, 500),
  Rxo.map(main),
  Rxo.mergeMap(R.values),
  Rxo.bufferCount(2000),
  Rxo.map(main),
  Rxo.mergeMap(R.values),
]
