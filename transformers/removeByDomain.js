const R = require('ramda');
const Rxo = require('rxjs/operators')
const { matchDomain } = require('../helpers/href');

const hrefLens = R.lensProp('href');

const removeUselessSites = R.anyPass([
  matchDomain(/messenger\.com/),
  matchDomain(/translate\.google\.com/),
  matchDomain(/rally1\.rallydev\.com/),
  matchDomain(/web\.whatsapp\.com/),
  matchDomain(/web\.telegram\.org/)
]);

const main = R.complement(R.compose(removeUselessSites, R.view(hrefLens)));

module.exports = [Rxo.filter(main)]
