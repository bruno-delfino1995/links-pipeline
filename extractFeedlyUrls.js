const R = require('ramda')
const urlParse = require('url-parse')
const queryString = require('query-string')
const readAll = require('./readAll')

const getLog = R.prop('log')
const getEntries = R.prop('entries')
const filterContentUrls = R.filter(R.compose(
    i => i !== -1,
    R.indexOf('contents'),
    R.prop('url'),
    R.prop('request')
))

const getRequestContent = R.map(R.compose(
    R.prop('items'),
    JSON.parse,
    R.prop('text'),
    R.prop('content'),
    R.prop('response')
))

const getContentUrls = R.map(R.compose(
    R.map(R.prop('href')),
    R.prop('alternate')
))

const removeValueByKeyName = R.mapObjIndexed((v, k) => /utm_*/.test(k) ? null : v)
const removeUTMFromQuery = R.compose(
    queryString.stringify,
    removeValueByKeyName,
    queryString.parse
)

const removeTrackingParams = R.map(R.map(R.compose(
    ({url, query, hash}) => {
        const queryString = query ? `?${query}` : '';
        const hashString = hash ? `#${hash}` : ''
        return `${url.toString()}${hashString}${queryString}`
    },
    url => {
        url.query = ''
        url.hash = ''

        return {
            url,
            hash: removeUTMFromQuery(url.hash.slice(1)),
            query: removeUTMFromQuery(url.query)
        }
    },
    urlParse
)))

const main = data => R.compose(
    R.flatten(),
    removeTrackingParams,
    getContentUrls,
    R.flatten(),
    getRequestContent,
    filterContentUrls,
    getEntries,
    getLog
)(JSON.parse(data))

readAll()
	.then(main)
	.then(data => console.log(data))
