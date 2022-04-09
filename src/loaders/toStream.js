const Rx = require('rxjs')
const chalk = require('chalk')

const main = (stream, observable) => {
  observable.subscribe({
    next: evt => stream.write(`${JSON.stringify(evt)}\n`),
    error: err => console.error(`${chalk.red('Error:')} ${chalk.yellow(err)}`, err),
    complete: () => stream.end()
  })

  return Rx.lastValueFrom(observable, { defaultValue: null }).then((_) => Symbol('COMPLETED'))
}

module.exports = main
