const R = require("ramda");
const urlParse = require("url-parse");
const qs = require("query-string");
const { pipe } = require("../helpers/io");

const hrefLens = R.prop("href");

const removeUTMFromQuery = R.compose(
  qs.stringify,
  R.mapObjIndexed((v, k) => (/utm_*/.test(k) ? null : v)),
  qs.parse
);

const removeTrackingParams = link => {
  const href = R.view(hrefLens, link);

  const url = urlParse(href);
  url.query = removeUTMFromQuery(url.query || "");

  return R.set(hrefLens, url.toString(), link);
};

const main = R.map(removeTrackingParams);

pipe(main, { input: JSON.parse });
