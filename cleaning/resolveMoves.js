const R = require("ramda");
const axios = require("axios");
const Promise = require("bluebird");
const { TaskQueue } = require("cwait");
const urlParse = require("url-parse");
const { pipe } = require("../helpers/io");

const hrefLens = R.lensProp("href");

const parseUrl = href => urlParse(href, true);

const resolveProxy = async href => {
  const locationLens = R.lensPath(["headers", "location"]);
  const statusLens = R.lensProp("status");
  return await axios
    .get(href, { maxRedirects: 0, validateStatus: R.T })
    .then(
      R.ifElse(
        R.compose(R.equals(301), R.view(statusLens)),
        R.view(locationLens),
        R.always(href)
      )
    );
};

const resolve = async link => {
  const newHref = await R.compose(resolveProxy, R.view(hrefLens))(link);

  return R.set(hrefLens, newHref, link);
};

const queue = new TaskQueue(Promise, 5);
const main = d => Promise.map(d, queue.wrap(resolve));

pipe(main, { input: JSON.parse })();
