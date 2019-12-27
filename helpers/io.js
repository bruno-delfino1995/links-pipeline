const readAll = () => {
  let content = "";
  process.stdin.resume();
  process.stdin.setEncoding("utf-8");
  process.stdin.on("data", buf => {
    content += buf.toString();
  });

  return new Promise((res, rej) => {
    process.stdin.on("end", () => res(content));
  });
};

const outputAll = data => console.log(data);

/**
 * Reads from stdin, pass through func after refining using the input filter,
 * and finally puts to stdout as string
 *
 * @param {I -> O} func
 * @param {Object} filters
 * @param {A -> I} filters.input - Function applied to raw stdin before passing to `func`
 * @param {O -> B} filters.output - Function applied to data sent by `func` before outputting on stdout
 * @param {Object} options
 * @param {Boolean} options.noInput - Don't read from stdin, instead return a closure
 * @param {Boolean} options.noOutput - Don't send to stdout, instead return the data
 *
 * @returns {() -> () | A -> () | A -> B}
 */
const pipe = (func, filters, options) => {
  const {
    input = R.identity,
    output = o => JSON.stringify(o, null, 2)
  } = filters ? filters : {};
  const { noInput = false, noOutput = false } = options ? options : {};

  const reader = noInput ? Promise.resolve : readAll;
  const writer = noOutput ? R.identity : outputAll;

  const pipeline = promise =>
    promise
      .then(input)
      .then(func)
      .then(output)
      .then(writer);

  return (data = null) => pipeline(reader(data));
};

module.exports = {
  pipe
};
