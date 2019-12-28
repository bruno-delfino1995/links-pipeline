const R = require("ramda");

const keyFilter = R.curry((f, obj) =>
  R.compose(
    R.fromPairs,
    R.chain(([k, v]) => (f(k) ? [[k, v]] : [])),
    R.toPairs
  )
);

module.exports = {
  keyFilter
};
