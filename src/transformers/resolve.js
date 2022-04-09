const R = require('ramda')
const Rxo = require('rxjs/operators')
const Promise = require('bluebird')
const { TaskQueue } = require('cwait')
const axios = require('axios')
const cheerio = require('cheerio')
const { Agent } = require('https')

const { lens } = require('../helpers/link')
const { isUseful } = require('../helpers/predicates')

const httpsAgent = new Agent({
  rejectUnauthorized: false
})

const augment = async link => {
  const href = R.view(lens.href, link)
  const opts = {
    httpsAgent,
    timeout: 300000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:99.0) Gecko/20100101 Firefox/99.0'
    }
  }

  return axios
    .get(href, opts)
    .then(resp => {
      const $ = cheerio.load(resp.data)

      const title = R.find(isUseful, [
        $('head > title').text(),
        R.view(lens.title, link)
      ])

      const href = R.find(isUseful, [
        $("head > link[rel='canonical']").prop('href'),
        resp.headers.location,
        R.view(lens.href, link)
      ])

      return R.compose(
        R.set(lens.alive, true),
        R.set(lens.href, href),
        R.set(lens.title, title)
      )(link)
    })
    .catch(_ => R.set(lens.alive, false, link))
}

const queue = new TaskQueue(Promise, 16)
const enhance = queue.wrap(augment)

const main = R.ifElse(
  R.view(lens.alive),
  Promise.resolve,
  enhance
)

module.exports = [
  Rxo.mergeMap(main)
]
