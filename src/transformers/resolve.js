const R = require('ramda')
const Rxo = require('rxjs/operators')
const Promise = require('bluebird')
const { TaskQueue } = require('cwait')
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const { lens } = require('../helpers/link')
const { isUseful, isUseless } = require('../helpers/predicates')

const launch = async () => {
  const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.61 Safari/537.36 ArchiveBox/0.6.2'
  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    defaultViewport: {
      height: 1440,
      width: 2000
    },
    args: [
      `--user-agent=${userAgent}`,
      '--headless',
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-software-rasterizer',
      '--run-all-compositor-stages-before-draw',
      '--hide-scrollbars',
      '--single-process',
      '--no-zygote'
    ]
  })

  return browser
}

const dom = async (browser, url) => {
  const page = await browser.newPage()
  await page.goto(url)
  const contents = await page.content()

  return cheerio.load(contents)
}

const canonical = (orig, can) => {
  if (!can) return orig
  if (can === '/') return orig

  const merged = new URL(can, orig)

  return merged.toString()
}

const concurrency = 8
const queue = new TaskQueue(Promise, concurrency)
const augment = queue.wrap(async (link) => {
  const url = R.view(lens.href, link)

  const browser = await launch()

  try {
    const $ = await dom(browser, url)

    const title = R.find(isUseful, [
      $('head > title').text(),
      R.view(lens.title, link)
    ])

    const href = canonical(
      R.view(lens.href, link),
      $("link[rel='canonical']").prop('href')
    )

    return R.compose(
      R.set(lens.href, href),
      R.set(lens.title, title),
      R.set(lens.error, null),
      R.set(lens.attempts, 0)
    )(link)
  } catch (e) {
    return R.compose(
      R.set(lens.error, e.toString()),
      R.over(lens.attempts, R.inc)
    )(link)
  } finally {
    await browser.close()
  }
})

const needs = R.converge(R.unapply(R.any(R.identity)), [
  R.compose(isUseless, R.view(lens.title)),
  R.compose(isUseful, R.view(lens.error))
])
const bypass = Promise.resolve

const main = R.ifElse(
  needs,
  augment,
  bypass
)

module.exports = [
  Rxo.mergeMap(main)
]
