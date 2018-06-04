const fs = require('fs')
const cheerio = require('cheerio')
const R = require('ramda')

const content = fs.readFileSync('bookmarks.html', 'utf8')
const $ = cheerio.load(content)

const toArray = ($, list) => {
	const arr = []

	list.map((i, el) => {
		arr.push($(el))
		return el
	})

	return arr
}

const getHrefs = R.map(el => el.attr('href'))
const getFolder = el => el.prev('dt > h3')

const sessions = $('dl')
const bookmarks = R.flatten(R.map((dom) => {
	const parents = toArray($, dom.parents())
	const folders = R.map(el => getFolder(el), parents)
	const folderTitles = R.reverse(R.map(el => el.text(), [...toArray($, getFolder(dom)), ...folders]))

	const titles = R.without(['Bookmarks bar'], R.reject(R.isEmpty, folderTitles))
	const path = R.reject(t => /window \d/i.test(t), titles)

	const elements = toArray($, dom.find('> dt > a'))
	const links = getHrefs(elements)

	return R.map(href => ({path, href}), links)
}, toArray($, sessions)))

const links = R.compose(
	R.map(({path, href}) => ({href, tags: R.join(',', path)})),
	R.reject(R.compose(
		R.any(R.identity),
		R.ap(R.map(R.contains, ['Amdocs', 'PC', 'Jean'])),
		R.prop('path')
	))
)(bookmarks)

fs.writeFile("./contents.json", JSON.stringify(links, null, 2), (err) => {
    if (err) {
        console.error(err);
        return;
    };
    console.log("File has been created");
});

