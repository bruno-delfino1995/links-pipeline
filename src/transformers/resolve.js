const R = require('ramda')
const Rxo = require('rxjs/operators')
const Promise = require('bluebird')
const { TaskQueue } = require('cwait')
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const { lens } = require('../helpers/link')
const { isUseful } = require('../helpers/predicates')

const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.61 Safari/537.36 ArchiveBox/0.6.2'
const concurrency = 8

const queue = new TaskQueue(Promise, concurrency)
const augment = queue.wrap(async (link) => {
  const url = R.view(lens.href, link)

  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    args: [`--user-agent=${userAgent}`]
  })

  try {
    const page = await browser.newPage()
    await page.goto(url)
    const contents = await page.content()

    const $ = cheerio.load(contents)

    const title = R.find(isUseful, [
      $('head > title').text(),
      R.view(lens.title, link)
    ])

    const href = R.find(isUseful, [
      $("head > link[rel='canonical']").prop('href'),
      R.view(lens.href, link)
    ])

    return R.compose(
      R.set(lens.alive, true),
      R.set(lens.href, href),
      R.set(lens.title, title)
    )(link)
  } catch (e) {
    console.error(e)
    return R.set(lens.alive, false, link)
  } finally {
    await browser.close()
  }
})

const main = R.ifElse(
  R.view(lens.alive),
  Promise.resolve,
  augment
)

module.exports = [
  Rxo.mergeMap(main)
]
