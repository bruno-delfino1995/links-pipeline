const main = observable => observable.subscribe({
  next: evt => console.log(evt),
  error: err => console.error(err),
});

module.exports = main
