const fs = require('fs')
const R = require('ramda')
const urlParse = require('url-parse')
const links = require('./links.json')
const resolveProxy = require('./resolveProxy')

const hrefLens = R.lensProp('href')
const typeLens = R.lensProp('type')
const queryLens = R.lensProp('query')
const searchLens = R.lensProp('term')

const parseUrl = href => urlParse(href, true)

const isProxy = url => R.startsWith('feedproxy.google.com', url.hostname)

const handleProxy = (url) => {
	console.log('Resolving URL')
	
	return resolveProxy(url)
		.catch(err => url)
		.then(newUrl => { console.log('Resolved URL'); return newUrl })
}

// TODO: Create an until logic, and somehow limit the amount of created promises
const urlsToBeResolved = R.compose(
	R.map(R.when(
		R.compose(isProxy, parseUrl, R.view(hrefLens)),
		async (link) => {
			const newHref = await R.compose(handleProxy, R.view(hrefLens))(link)

			return R.set(hrefLens, newHref, link)
		}
	))
)(links)

Promise.all(urlsToBeResolved)
	.then((urls) => {
		return new Promise((res, rej) => {
			fs.writeFile("./contents.json", JSON.stringify(urls, null, 2), (err) => {
			    if (err) {
				console.error(err);
				rej(err)
				return;
			    };
			    console.log("File has been created");
			    res(urls)
			});
		});
	});

