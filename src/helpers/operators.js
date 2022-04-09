const R = require('ramda')
const Rx = require('rxjs')
const Rxo = require('rxjs/operators')

const kind = R.map(Symbol, { init: 'INIT', next: 'NEXT', error: 'ERROR', complete: 'COMPLETE' })

const annotated = (...operator) => (source) => {
  return source
    .pipe(
      Rxo.materialize(),
      Rxo.scan(
        ({ start }, notification) => {
          const report = notification.do(
            (value) => ({ type: (start ? kind.init : kind.next), payload: value }),
            (err) => ({ type: kind.error, payload: err }),
            () => ({ type: kind.complete, payload: null })
          )

          return {
            start: false,
            report
          }
        },
        { start: true, report: null }
      ),
      Rxo.map(R.prop('report'))
    )
    .pipe(...operator)
    .pipe(Rxo.dematerialize())
}

const bufferWhile = (criteria) => (source) => {
  return source.pipe(annotated(
    Rxo.scan(
      ({ previous, buffer }, { type, payload }) => {
        switch (type) {
          case kind.init:
            return {
              previous: payload,
              buffer: [payload],
              report: []
            }

          case kind.next:
            if (criteria(previous, payload)) {
              return {
                previous: payload,
                buffer: R.append(payload, buffer),
                report: []
              }
            }

            return {
              previous: payload,
              buffer: [payload],
              report: [Rx.Notification.createNext(buffer)]
            }

          case kind.complete:
            return {
              previous,
              buffer: [],
              report: [
                Rx.Notification.createNext(buffer),
                Rx.Notification.createComplete()
              ]
            }

          case kind.error:
            return {
              previous,
              buffer,
              report: [
                Rx.Notification.createError(payload)
              ]
            }
        }
      },
      { previous: null, buffer: [], report: [] }
    ),
    Rxo.concatMap(R.prop('report'))
  ))
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

const withIndex = (source) => {
  let index = 0

  // TODO: Is there a way to use Rx.generate as the counter and merge both with
  // Rxo.zipWith without overflowing the stack?
  return source.pipe(Rxo.map(el => [el, index++]))
}

module.exports = {
  kind,
  annotated,
  bufferWhile,
  byLine,
  withIndex
}
