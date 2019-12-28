const R = require("ramda");
const { pipe } = require("../helpers/io");
const { matchDomain, getQuery } = require("../helpers/href");

const kindLens = R.lensProp("kind");
const hrefLens = R.lensProp("href");

const isSearch = R.compose(R.equals("#search"), R.view(kindLens));

const googlePredicate = R.propSatisfies(
  matchDomain(/(www\.)?google\.com\..*/),
  "href"
);

const googleTransformer = link => {
  const term = getQuery("q", R.view(hrefLens, link));

  return {
    ...link,
    title: term,
    href: `https://google.com/search?q=${encodeURIComponent(term)}`
  };
};

const customize = R.cond([
  [googlePredicate, googleTransformer],
  [R.T, R.identity]
]);

const main = R.map(R.when(isSearch, customize));

pipe(main, { input: JSON.parse })();
