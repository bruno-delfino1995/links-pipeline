const R = require('ramda');
const Rxo = require('rxjs/operators')

const bufferWhile = (criteria) => (source) => {
  const init = Symbol()

  return source.pipe(
    // NOTE: We move 2 in steps of 1 to detect completion by checking the length
    Rxo.bufferCount(2, 1),
    Rxo.scan(
      ({ previous, buffer }, data) => {
        const [fst, snd] = data

        if (data.length === 1) {
          if (previous === init) {
            return { emit: [[fst]] }
          }

          return { emit: [buffer] }
        }

        if (previous === init) {
          if (!criteria(fst, snd)) {
            return {
              last: snd,
              buffer: [snd],
              emit: [[fst]],
            }
          }

          return {
            last: snd,
            buffer: data,
            emit: []
          }
        }

        if (!criteria(fst, snd)) {
          return {
            last: snd,
            buffer: [snd],
            emit: [buffer],
          }
        }

        return {
          last: snd,
          buffer: buffer.concat(snd),
          emit: []
        }
      },
      { previous: init, buffer: [], emit: [] }
    ),
    Rxo.flatMap(R.prop('emit'))
  )
}

module.exports = {
  bufferWhile,
}
