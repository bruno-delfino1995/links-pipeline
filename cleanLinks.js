const R = require('ramda')
const urlParse = require('url-parse')
const readAll = require('./readAll')

const hrefLens = R.lensProp('href')

const parseUrl = href => urlParse(href, true)

const removeUselessSites = (url) => {
	const hostname = url.hostname

	return (
		R.startsWith('messenger.com', hostname)
		|| R.startsWith('translate.google.com', hostname)
		|| R.startsWith('rally1.rallydev.com', hostname)
		|| R.startsWith('web.whatsapp.com', hostname)
		|| R.startsWith('web.telegram.org', hostname)
	)
}

const main = R.reject(R.compose(removeUselessSites, parseUrl, R.view(hrefLens)))

readAll()
	.then(data => JSON.parse(data))
	.then(main)
	.then(data => console.log(JSON.stringify(data)))
