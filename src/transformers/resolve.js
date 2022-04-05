const R = require('ramda')
const Rxo = require('rxjs/operators')
const Promise = require('bluebird')
const { TaskQueue } = require('cwait')
const axios = require('axios')
const cheerio = require('cheerio')

const { lens } = require('../helpers/link')
const { isUseful } = require('../helpers/predicates')

const augment = async link => {
  return axios
    .get(R.view(lens.href, link))
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
}

const queue = new TaskQueue(Promise, 16)
const main = queue.wrap(augment)

module.exports = [Rxo.mergeMap(main)]
