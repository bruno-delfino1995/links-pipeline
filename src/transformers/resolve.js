const R = require('ramda')
const Rxo = require('rxjs/operators')
const Promise = require('bluebird')
const { TaskQueue } = require('cwait')
const axios = require('axios')
const cheerio = require('cheerio')

const { lens } = require('../helpers/link')
const { isUseful } = require('../helpers/predicates')

const augment = async link => {
  const href = R.view(lens.href, link)

  return axios
    .get(href, { timeout: 5000 })
    .then(resp => {
      const $ = cheerio.load(resp.data)

      const title = R.find(isUseful, [
        $('head > title').text(),
        R.view(lens.title, link)
      ])

      const href = R.find(isUseful, [
        $("head > link[rel='canonical']").prop('href'),
        resp.headers['location'],
        R.view(lens.href, link)
      ])

      return R.compose(
        R.set(lens.alive, true),
        R.set(lens.href, href),
        R.set(lens.title, title)
      )(link)
    })
    .catch(_ => R.set(lens.alive, false, link))
    .then(R.set(lens.resolved, true))
}

const queue = new TaskQueue(Promise, 16)
const enhance = queue.wrap(augment)

const main = R.ifElse(
  R.view(lens.resolved),
  Promise.resolve,
  enhance
)

module.exports = [
  Rxo.mergeMap(main),
]
