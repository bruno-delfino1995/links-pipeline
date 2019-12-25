const fs = require("fs");
const R = require("ramda");
const Promise = require("bluebird");
const { TaskQueue } = require("cwait");
const urlParse = require("url-parse");
const readAll = require("./readAll");
const resolveProxy = require("./resolveProxy");

const hrefLens = R.lensProp("href");
const typeLens = R.lensProp("type");
const queryLens = R.lensProp("query");
const searchLens = R.lensProp("term");

const parseUrl = href => urlParse(href, true);

const isProxy = url => R.startsWith("feedproxy.google.com", url.hostname);

const resolve = async link => {
  const newHref = await R.compose(resolveProxy, R.view(hrefLens))(link);

  return R.set(hrefLens, newHref, link);
};

const resolveIfNecessary = R.when(
  R.compose(isProxy, parseUrl, R.view(hrefLens)),
  resolve
);

const queue = new TaskQueue(Promise, 5);

readAll()
  .then(data => JSON.parse(data))
  .then(proxied => Promise.map(proxied, queue.wrap(resolveIfNecessary)))
  .then(data => console.log(JSON.stringify(data)));
