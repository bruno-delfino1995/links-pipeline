const R = require("ramda");
const { pipe } = require("../helpers/io");

const hrefLens = R.lensProp("href");
const tagsLens = R.lensProp("tags");

const mergeTags = comparator =>
  R.reduceBy(
    (acc, el) =>
      R.set(
        hrefLens,
        el.href,
        R.set(
          tagsLens,
          `${R.defaultTo(
            "",
            R.unless(R.isNil, t => `${t}⨝`, acc.tags)
          )}${el.tags}`,
          R.mergeLeft(acc, el)
        )
      ),
    {},
    comparator
  );

const main = R.compose(R.values, mergeTags(R.view(hrefLens)));

pipe(main, { input: JSON.parse })();
