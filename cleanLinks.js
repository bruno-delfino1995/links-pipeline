const fs = require('fs')
const R = require('ramda')
const urlParse = require('url-parse')
const links = require('./links.json')

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

const urls = R.compose(
	R.reject(R.compose(removeUselessSites, parseUrl, R.view(hrefLens)))
)(links)

fs.writeFile("./contents.json", JSON.stringify(urls, null, 2), (err) => {
    if (err) {
        console.error(err);
        return;
    };
    console.log("File has been created");
});
