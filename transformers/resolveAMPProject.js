const R = require('ramda');
const Rxo = require('rxjs/operators')
const { matchDomain, getQuery } = require('../helpers/href');

const isAMP = R.propSatisfies(matchDomain(/ampproject\.org/), 'href');

const resolve = R.evolve({
  href: R.either(getQuery('ampshare'), R.identity)
});

const main = R.when(isAMP, resolve);

module.exports = [Rxo.map(main)]
