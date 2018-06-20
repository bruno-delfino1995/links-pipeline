const R = require('ramda')
const readAll = require('./readAll')
const fs = require('./fileHelpers')

const tagsLens = R.lensProp('tags')

const normalizeTags = (link) => {
	const rawTags = R.view(tagsLens, link)
	const tags = R.compose(
		R.reject(R.isEmpty),
		R.split(','),
		R.toLower
	)(rawTags)
	return R.set(tagsLens, tags, link)
}

const main = (data) => R.map(normalizeTags)(JSON.parse(data))

readAll()
	.then(main)
	.then(data => console.log(data))
