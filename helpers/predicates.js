const R = require('ramda')

const isUseless = R.anyPass([R.isNil, R.isEmpty])
const isUseful = R.complement(isUseless)

module.exports = {
  isUseless,
  isUseful
}
