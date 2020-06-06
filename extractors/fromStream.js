const Rx = require('rxjs')

const fromStream = (createStream) => Rx.defer(() => {
  return (new Rx.Observable((observer) => {
    const data = (data) => observer.next(data)
    const error = (err) => observer.error(err)
    const end = () => observer.complete()

    const stream = createStream();
    stream.addListener('data', data);
    stream.addListener('error', error);
    stream.addListener('end', end);
    stream.resume();

    return () => {
      stream.removeListener('data', data);
      stream.removeListener('error', error);
      stream.removeListener('end', end);
    };
  }))
})

module.exports = fromStream
