const chalk = require('chalk')

const main = (stream) => ({
  next: evt => stream.write(`${JSON.stringify(evt)}\n`),
  error: err => console.error(`${chalk.red('Error:')} ${chalk.yellow(err)}`, err),
  complete: () => stream.end()
})

module.exports = main
