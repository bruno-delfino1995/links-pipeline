const R = require('ramda');
const Rxo = require('rxjs/operators')
const Promise = require('bluebird');
const { TaskQueue } = require('cwait');
const { parse } = require('@postlight/mercury-parser');

const hrefLens = R.lensProp('href');

const isSite = R.propSatisfies(R.equals('#site'), 'kind')
const hasTitle = R.propSatisfies(R.is(String), 'title')

const augment = async link =>
  parse(R.view(hrefLens, link), { contentType: 'markdown' })
    .then(data => ({
      ...link,
      title: R.defaultTo(link.title, data.title),
    }))
    .catch(R.always(link));

const queue = new TaskQueue(Promise, 5);
const main = queue.wrap(R.when(R.allPass([isSite, R.complement(hasTitle)]), augment));

module.exports = [Rxo.mergeMap(main)]
