const R = require('ramda')
const Rxo = require('rxjs/operators')
const { matchDomain, matchPath } = require('../helpers/href')
const { lens } = require('../helpers/link')

const isUselessSite = R.anyPass([
  matchDomain(/messenger\.com/),
  R.allPass([matchDomain(/google\.com/), matchPath(/search/)]),
  matchDomain(/localhost/),
  R.allPass([matchDomain(/ecosia\.org/), matchPath(/search/)]),
  matchDomain(/web\.whatsapp\.com/),
  matchDomain(/web\.telegram\.org/)
])

const main = R.complement(R.compose(isUselessSite, R.view(lens.href)))

module.exports = [Rxo.filter(main)]
