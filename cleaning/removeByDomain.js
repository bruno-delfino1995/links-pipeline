const R = require("ramda");
const { pipe } = require("../helpers/io");
const { matchDomain } = require("../helpers/href");

const hrefLens = R.lensProp("href");

const removeUselessSites = R.anyPass([
  matchDomain(/messenger\.com/),
  matchDomain(/translate\.google\.com/),
  matchDomain(/rally1\.rallydev\.com/),
  matchDomain(/web\.whatsapp\.com/),
  matchDomain(/web\.telegram\.org/)
]);

const main = R.reject(R.compose(removeUselessSites, R.view(hrefLens)));

pipe(main, { input: JSON.parse })();
