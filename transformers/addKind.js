const R = require('ramda');
const Rxo = require('rxjs/operators')
const { matchDomain } = require('../helpers/href');

const hrefLens = R.lensProp('href');
const kindLens = R.lensProp('kind');

const getKind = R.cond([
  [matchDomain(/(www\.)?google\.com\..*/), R.always('#search')],
  [matchDomain(/youtube\.com/), R.always('#video')],
  [matchDomain(/reddit\.com/), R.always('com.reddit#post')],
  [matchDomain(/github\.com/), R.always('com.github#repository')],
  [R.T, R.always('#site')]
]);

const main = R.when(
  R.compose(R.isNil, R.view(kindLens)),
  R.converge(R.set(kindLens), [R.compose(getKind, R.view(hrefLens)), R.identity])
)

module.exports = [Rxo.map(main)]
