const R = require('ramda')
const Rxo = require('rxjs/operators')
const { defaults, concat, clean } = require('../helpers/link')

const main = R.compose(concat(defaults), clean)

module.exports = [Rxo.map(main)]
