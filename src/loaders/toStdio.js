const Rx = require('rxjs')
const chalk = require('chalk')

const main = (observable) => {
  observable.subscribe({
    next: evt => {
      if (typeof evt === 'string') {
        console.log(evt)
      } else {
        console.log(JSON.stringify(evt))
      }
    },
    error: err => console.error(`${chalk.red('Error:')} ${chalk.yellow(err)}`, err)
  })

  return Rx.lastValueFrom(observable, { defaultValue: null }).then((_) => Symbol('COMPLETED'))
}

module.exports = main
