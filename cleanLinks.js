const fs = require('fs')
const R = require('ramda')
const urlParse = require('url-parse')
const links = require('./links.json')

const hrefLens = R.lensProp('href')
const typeLens = R.lensProp('type')
const queryLens = R.lensProp('query')
const searchLens = R.lensProp('term')

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

const isGoogle = (href) => R.startsWith('www.google.com', urlParse(href).hostname)

const getSearch = (url) => {
	const query = R.view(queryLens, url) || {}

	return decodeURIComponent(query.q || '')
}

const urls = R.compose(
//	R.map(R.when(
//		R.compose(isGoogle, R.view(hrefLens)),
//		link => R.set(
//			searchLens, 
//			R.compose(getSearch, parseUrl, R.view(hrefLens))(link),
//			R.set(typeLens, 'search', link)
//		)
//	)),
//	R.map(R.set(typeLens, 'url')),
	R.reject(R.compose(removeUselessSites, parseUrl, R.view(hrefLens)))
)(links)

fs.writeFile("./contents.json", JSON.stringify(urls, null, 2), (err) => {
    if (err) {
        console.error(err);
        return;
    };
    console.log("File has been created");
});
