const R = require('ramda');
const Rx = require('rxjs')
const Rxo = require('rxjs/operators')
const { defaults, concat, lens } = require('../helpers/link')

const groupWhile = (criteria) => (source) => {
  return (new Rx.Observable((observer) => {
    let acc = { last: undefined, buffer: [] }

    const subscription = source.subscribe({
      error: err => observer.error(err),
      complete: () => {
        observer.next(acc.buffer)
        observer.complete()
      },
      next: data => {
        const { last, buffer } = acc

        if (last !== undefined && !criteria(last, data)) {
          acc = {
            last: data,
            buffer: [data]
          }

          observer.next(buffer)

          return
        }

        acc = {
          last: data,
          buffer: buffer.concat([data])
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    };
  }))
}

module.exports = [
  groupWhile(R.compose(
    R.apply(R.equals),
    R.unapply(R.map(R.view(lens.href)))
  )),
  Rxo.map(R.reduce(concat, defaults)),
]
