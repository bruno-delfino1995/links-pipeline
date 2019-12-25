const R = require("ramda");
const readAll = require("./readAll");
const fs = require("./fileHelpers");

const hrefLens = R.lensProp("href");
const tagsLens = R.lensProp("tags");

const normalizeTags = link => {
  const rawTags = R.view(tagsLens, link);
  const tags = R.compose(
    R.reject(R.isEmpty),
    R.split("⨝"),
    R.toLower,
    R.defaultTo("")
  )(rawTags);

  return R.set(tagsLens, tags, link);
};

const clearTags = link => {
  const dirtyTags = R.view(tagsLens, link);
  const tags = R.without(["new folder", "read it later", "ril"], dirtyTags);

  return R.set(tagsLens, tags, link);
};

// This has a "side-effect" of removing any duplicated link
const mergeTags = comparator =>
  R.compose(
    R.map(
      R.reduce(
        (acc, el) => ({
          href: el.href,
          tags: R.uniq(R.concat(acc.tags || [], el.tags))
        }),
        {}
      )
    ),
    R.groupWith(comparator)
  );

const main = R.compose(
  mergeTags((a, b) => R.view(hrefLens, a) == R.view(hrefLens, b)),
  R.map(clearTags)
);

readAll()
  .then(data => JSON.parse(data))
  .then(main)
  .then(data => console.log(JSON.stringify(data)));
