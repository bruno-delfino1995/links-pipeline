const chalk = require('chalk')

const main = () => ({
  next: evt => console.log(JSON.stringify(evt)),
  error: err => console.error(`${chalk.red('Error:')} ${chalk.yellow(err)}`, err)
})

module.exports = main
