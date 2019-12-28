const R = require("ramda");
const Promise = require("bluebird");
const { TaskQueue } = require("cwait");
const { parse } = require("@postlight/mercury-parser");
const { pipe } = require("../helpers/io");

const hrefLens = R.lensProp("href");

const isSite = R.allPass([
  R.propSatisfies(R.equals("#site"), "kind"),
  R.propSatisfies(R.isNil, "augmented")
]);

const augment = async link =>
  parse(R.view(hrefLens, link), { contentType: "markdown" }).then(data =>
    R.evolve(
      {
        augmented: R.always(true),
        title: R.flip(R.defaultTo)(data.title),
        thumbnail: R.always(data.lead_image_url),
        excerpt: R.always(data.excerpt),
        body: R.always(data.content),
        publishedAt: R.always(data.date_published)
      },
      link
    )
  );

const queue = new TaskQueue(Promise, 5);
const main = link => Promise.map(link, queue.wrap(R.when(isSite, augment)));

pipe(main, { input: JSON.parse })();
