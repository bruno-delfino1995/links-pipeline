const Rx = require('rxjs')
const Rxo = require('rxjs/operators')
const chalk = require('chalk')

const main = (stream, observable) => {
  const last = observable.pipe(Rxo.tap({
    next: evt => {
      if (typeof evt === 'string') {
        stream.write(`${evt}\n`)
      } else {
        stream.write(`${JSON.stringify(evt)}\n`)
      }
    },
    error: err => console.error(`${chalk.red('Error:')} ${chalk.yellow(err)}`, err),
    complete: () => stream.end()
  }))

  return Rx.lastValueFrom(last, { defaultValue: null }).then((_) => Symbol('COMPLETED'))
}

module.exports = main
