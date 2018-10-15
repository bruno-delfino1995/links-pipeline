const cheerio = require('cheerio')
const R = require('ramda')
const readAll = require('./readAll')

const getHrefs = R.map(el => el.attr('href'))
const getFolder = el => el.prev('dt > h3')

const toArray = ($, list) => {
	const arr = []

	list.map((i, el) => {
		arr.push($(el))
		return el
	})

	return arr
}

const extractBookmarks = $ => dom => {
	const parents = toArray($, dom.parents())
	const folders = R.map(el => getFolder(el), parents)
	const folderTitles = R.reverse(R.map(el => el.text(), [...toArray($, getFolder(dom)), ...folders]))

	const titles = R.without(['Bookmarks bar'], R.reject(R.isEmpty, folderTitles))
	const path = R.reject(t => /window \d|new folder/i.test(t), titles)

	const elements = toArray($, dom.find('> dt > a'))
	const links = getHrefs(elements)

	return R.map(href => ({path, href}), links)
}

const main = (data) => {
	const $ = cheerio.load(data)

	const sessions = toArray($, $('dl'))
	const bookmarks = R.compose(
		R.flatten,
		R.map(extractBookmarks($))
	)(sessions)

	const links = R.compose(
		R.map(({path, href}) => ({href, tags: R.join('⨝', path)})),
		R.reject(R.compose(
			R.any(R.identity),
			R.ap(R.map(R.contains, ['Amdocs', 'PC', 'Jean'])),
			R.prop('path')
		))
	)(bookmarks)

	return links
}

readAll()
	.then(main)
	.then(data => console.log(JSON.stringify(data)))
