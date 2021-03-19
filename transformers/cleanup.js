const Rxo = require('rxjs/operators')
const { fromObject } = require('../helpers/link')

module.exports = [Rxo.map(fromObject)]
