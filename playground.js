const R = require("ramda");
const { pipe } = require("./helpers/io");

const main = R.map(R.evolve({ title: t => (R.isEmpty(t) ? null : t) }));

pipe(main, { input: JSON.parse })();
