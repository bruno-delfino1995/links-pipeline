const R = require('ramda')

const wrap = R.when(R.complement(Array.isArray), Array.of)

module.exports = {
  wrap
}
