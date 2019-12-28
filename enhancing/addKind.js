const R = require("ramda");
const { pipe } = require("../helpers/io");
const { matchDomain } = require("../helpers/href");

const hrefLens = R.lensProp("href");
const kindLens = R.lensProp("kind");

const getKind = R.cond([
  [matchDomain(/(www\.)?google\.com\..*/), R.always("#search")],
  [matchDomain(/youtube\.com/), R.always("#video")],
  [matchDomain(/reddit\.com/), R.always("com.reddit#post")],
  [matchDomain(/github\.com/), R.always("com.github#repository")],
  [(R.T, R.always("#site"))]
]);

const main = R.map(link =>
  R.over(
    kindLens,
    R.when(R.isNil, () => getKind(R.view(hrefLens, link))),
    link
  )
);

pipe(main, { input: JSON.parse })();
