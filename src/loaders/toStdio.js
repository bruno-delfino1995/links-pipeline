const Rx = require('rxjs')
const Rxo = require('rxjs/operators')
const chalk = require('chalk')

const main = (observable) => {
  const last = observable.pipe(Rxo.tap({
    next: evt => {
      if (typeof evt === 'string') {
        console.log(evt)
      } else {
        console.log(JSON.stringify(evt))
      }
    },
    error: err => console.error(`${chalk.red('Error:')} ${chalk.yellow(err)}`, err)
  }))

  return Rx.lastValueFrom(last, { defaultValue: null }).then((_) => Symbol('COMPLETED'))
}

module.exports = main
