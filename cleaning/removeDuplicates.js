const R = require("ramda");
const { pipe } = require("../helpers/io");

const hrefLens = R.lensProp("href");
const tagsLens = R.lensProp("tags");

const mergeTags = R.reduceBy(
  (acc, el) =>
    R.set(
      hrefLens,
      el.href,
      R.set(
        tagsLens,
        R.uniq(R.concat(acc.tags || [], el.tags || [])),
        R.mergeLeft(acc, el)
      )
    ),
  {}
);

const main = R.compose(R.values, mergeTags(R.view(hrefLens)));

pipe(main, { input: JSON.parse })();
