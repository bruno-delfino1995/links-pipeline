const R = require("ramda");
const urlParse = require("url-parse");
const { pipe } = require("../helpers/io");

const hrefLens = R.lensProp("href");

const parseUrl = href => urlParse(href, true);

const removeUselessSites = url => {
  const hostname = url.hostname;

  return (
    R.includes("messenger.com", hostname) ||
    R.includes("translate.google.com", hostname) ||
    R.includes("rally1.rallydev.com", hostname) ||
    R.includes("web.whatsapp.com", hostname) ||
    R.includes("web.telegram.org", hostname)
  );
};

const main = R.reject(
  R.compose(removeUselessSites, parseUrl, R.view(hrefLens))
);

pipe(main, { input: JSON.parse })();
