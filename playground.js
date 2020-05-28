const R = require('ramda');
const { pipe } = require('./helpers/io');
const { matchDomain } = require('./helpers/href');

const main = R.map(
  R.when(
    R.allPass([
      R.propSatisfies(matchDomain(/reddit.com/), 'href'),
      R.propSatisfies(R.isNil, 'kind')
    ]),
    R.evolve({ kind: R.always('com.reddit#post') })
  )
);

pipe(main, { input: JSON.parse })();
