const fs = require("fs");

module.exports.write = ({ path, contents }) =>
  new Promise((res, rej) => {
    fs.writeFile(path, contents, err => {
      if (err) {
        rej(err);
        return;
      }

      res();
    });
  });

module.exports.read = ({ path, encoding }) =>
  new Promise((res, rej) => {
    fs.readFile(path, encoding, (err, data) => {
      if (err) {
        rej(err);
        return;
      }

      res(data);
    });
  });
