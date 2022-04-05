const R = require('ramda')
const Rx = require('rxjs')
const Rxo = require('rxjs/operators')

const [
  INIT, NEXT, ERROR, COMPLETE
] = ['INIT', 'NEXT', 'ERROR', 'COMPLETE'].map((desc) => Symbol(desc))

const bufferWhile = (criteria) => (source) => {
  return source.pipe(
    Rxo.materialize(),
    Rxo.scan(
      ({ previous, buffer }, notification) => {
        const { type, payload } = notification.do(
          (value) => ({ type: NEXT, payload: value }),
          (err) => ({ type: ERROR, payload: err }),
          () => ({ type: COMPLETE })
        )

        switch (type) {
          case ERROR:
            return {
              previous,
              buffer,
              report: [
                Rx.Notification.createError(payload)
              ]
            }
          case COMPLETE:
            return {
              previous,
              buffer: [],
              report: [
                Rx.Notification.createNext(buffer),
                Rx.Notification.createComplete()
              ]
            }
          case NEXT:
            if (previous === INIT) {
              return {
                previous: payload,
                buffer: [payload],
                report: []
              }
            }

            if (!criteria(previous, payload)) {
              return {
                previous: payload,
                buffer: [payload],
                report: [Rx.Notification.createNext(buffer)]
              }
            }

            return {
              previous: payload,
              buffer: R.append(payload, buffer),
              report: []
            }
        }
      },
      { previous: INIT, buffer: [], report: [] }
    ),
    Rxo.concatMap(R.prop('report')),
    Rxo.dematerialize()
  )
}

const byLine = (source) => {
  return source.pipe(
    Rxo.scan(
      ({ buffer }, b) => {
        const splitted = buffer.concat(b).split('\n')
        const rest = splitted.pop()
        return { buffer: rest, items: splitted }
      },
      { buffer: '', items: [] }
    ),
    Rxo.concatMap(({ items }) => items)
  )
}

module.exports = {
  bufferWhile,
  byLine
}
