const R = require('ramda');
const Rx = require('rxjs')
const Rxo = require('rxjs/operators')

const hrefLens = R.lensProp('href');
const tagsLens = R.lensProp('tags');

const main = ([acc], el) => {
  const key = R.view(hrefLens, el)
  const previous = acc[key] || {}

  return [{
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
  }]
}

module.exports = [
  Rxo.reduce(main, [{}]),
  Rxo.mergeMap(Rx.from),
  Rxo.mergeMap(R.values)
]
