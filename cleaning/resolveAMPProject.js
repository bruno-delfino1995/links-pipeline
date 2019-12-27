const R = require("ramda");
const urlParse = require("url-parse");
const qs = require("query-string");
const { pipe } = require("../helpers/io");

const isAMP = R.compose(
  R.includes("ampproject.org"),
  R.prop("hostname"),
  urlParse,
  R.prop("href")
);

const resolve = R.evolve({
  href: R.either(
    R.compose(R.prop("ampshare"), qs.parse, R.prop("hash"), urlParse),
    R.identity
  )
});

const main = R.map(R.when(isAMP, resolve));

pipe(main, { input: JSON.parse })();
