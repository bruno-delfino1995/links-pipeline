const R = require("ramda");
const urlParse = require("url-parse");
const { pipe } = require("../helpers/io");
const { matchDomain } = require("../helpers/href");

const hrefLens = R.lensProp("href");
const kindLens = R.lensProp("kind");

const getKind = href => {
  const url = urlParse(href, true);

  if (matchDomain(/(www\.)?google\.com\..*/, url)) return "#search";
  if (R.includes("youtube.com", url.hostname)) return "#video";
  if (R.includes("reddit.com", url.hostname)) return "com.reddit#post";

  return "#site";
};

const main = R.map(link =>
  R.over(
    kindLens,
    R.when(R.isNil, () => getKind(R.view(hrefLens, link))),
    link
  )
);

pipe(main, { input: JSON.parse })();
