const R = require('ramda')
const Rxo = require('rxjs/operators')
const { matchDomain } = require('../helpers/href')

const hrefLens = R.lensProp('href')

const isUselessSite = R.anyPass([
  matchDomain(/messenger\.com/),
  matchDomain(/google\.com/),
  matchDomain(/web\.whatsapp\.com/),
  matchDomain(/web\.telegram\.org/)
])

const main = R.complement(R.compose(isUselessSite, R.view(hrefLens)))

module.exports = [Rxo.filter(main)]
