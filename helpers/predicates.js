const R = require('ramda')

const isUseless = R.anyPass([R.isNil, R.isEmpty])

module.exports = {
  isUseless
}
