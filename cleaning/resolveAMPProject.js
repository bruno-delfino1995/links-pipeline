const R = require("ramda");
const { pipe } = require("../helpers/io");
const { matchDomain, getQuery } = require("../helpers/href");

const isAMP = R.propSatisfies(matchDomain(/ampproject\.org/), "href");

const resolve = R.evolve({
  href: R.either(getQuery("ampshare"), R.identity)
});

const main = R.map(R.when(isAMP, resolve));

pipe(main, { input: JSON.parse })();
