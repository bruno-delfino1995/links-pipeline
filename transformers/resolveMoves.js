const R = require('ramda')
const Rxo = require('rxjs/operators')
const axios = require('axios')
const Promise = require('bluebird')
const { TaskQueue } = require('cwait')

const hrefLens = R.lensProp('href')

const resolveProxy = async href => {
  const locationLens = R.lensPath(['headers', 'location'])
  const statusLens = R.lensProp('status')
  return await axios
    .get(href, { maxRedirects: 0, validateStatus: R.T })
    .then(
      R.ifElse(
        R.compose(R.equals(301), R.view(statusLens)),
        R.view(locationLens),
        R.always(href)
      )
    )
    .catch(R.always(href))
}

const resolve = async link => {
  const newHref = await R.compose(resolveProxy, R.view(hrefLens))(link)

  return R.set(hrefLens, newHref, link)
}

const queue = new TaskQueue(Promise, 5)
const main = queue.wrap(resolve)

module.exports = [Rxo.mergeMap(main)]
