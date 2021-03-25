const R = require('ramda')
const Rx = require('rxjs')
const Rxo = require('rxjs/operators')
const cheerio = require('cheerio')

const fromFile = require('./fromFile')

const getData = el => ({ href: el.attr('href'), title: el.text(), tags: el.attr('tags') })
const getFolder = el => el.prev('dt > h3')

const toArray = ($, list) => {
  const arr = []

  list.map((i, el) => {
    arr.push($(el))
    return el
  })

  return arr
}

const extractLinks = $ => dom => {
  const path = R.compose(
    R.map(el => el.text()),
    R.concat(toArray($, getFolder(dom))),
    R.map(getFolder)
  )(toArray($, dom.parents()))

  const entries = R.map(
    getData,
    toArray($, dom.find('> dt > a'))
  )

  return R.map(
    R.evolve({
      tags: R.compose(
        R.concat(path),
        R.split(','),
        R.defaultTo('')
      )
    }),
    entries
  )
}

const convert = data => {
  const $ = cheerio.load(data)

  const sessions = toArray($, $('dl'))
  const links = R.chain(extractLinks($), sessions)

  return Rx.from(links)
}

const main = path => fromFile(path)
  .pipe(Rxo.mergeMap(convert))

module.exports = main
