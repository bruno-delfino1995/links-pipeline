const fromFile = require('./fromFile')

const fromStdin = () => fromFile(0)

module.exports = fromStdin
