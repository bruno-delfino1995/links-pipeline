const cheerio = require("cheerio");
const R = require("ramda");
const { pipe } = require("../helpers/io");

const getEntry = R.map(el => ({ href: el.attr("href"), title: el.text() }));
const getFolder = el => el.prev("dt > h3");

const toArray = ($, list) => {
  const arr = [];

  list.map((i, el) => {
    arr.push($(el));
    return el;
  });

  return arr;
};

const extractBookmarks = $ => dom => {
  const parents = toArray($, dom.parents());
  const folders = R.map(getFolder, parents);
  const folderTitles = R.reverse(
    R.map(el => el.text(), [...toArray($, getFolder(dom)), ...folders])
  );

  const path = R.reject(R.isEmpty, folderTitles);

  const elements = toArray($, dom.find("> dt > a"));
  const entries = getEntry(elements);

  return R.map(entry => ({ path, ...entry }), entries);
};

const main = data => {
  const $ = cheerio.load(data);

  const sessions = toArray($, $("dl"));
  const bookmarks = R.compose(R.flatten, R.map(extractBookmarks($)))(sessions);

  const links = R.map(({ path, ...rest }) => ({
    tags: R.join("⨝", path),
    ...rest
  }))(bookmarks);

  return links;
};

pipe(main);
