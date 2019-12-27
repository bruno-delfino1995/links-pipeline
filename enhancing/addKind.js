const R = require("ramda");
const urlParse = require("url-parse");
const { pipe } = require("../helpers/io");

const hrefLens = R.lensProp("href");
const kindLens = R.lensProp("kind");

const getKind = href => {
  const url = urlParse(href, true);

  if (url.hostname === "google.com") return "#search";
  if (url.hostname === "youtube.com") return "#video";

  return "#site";
};

const main = R.map(link =>
  R.mergeLeft(link, R.set(kindLens, getKind(R.view(hrefLens, link)), {}))
);

pipe(main, { input: JSON.parse });
