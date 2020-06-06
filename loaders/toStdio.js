const main = observable => observable.subscribe({
  next: evt => console.log(JSON.stringify(evt)),
  error: err => console.error(err),
});

module.exports = main
