const fs = require("fs");

const write = ({ path, contents }) =>
  new Promise((res, rej) => {
    fs.writeFile(path, contents, err => {
      if (err) {
        rej(err);
        return;
      }

      res();
    });
  });

const read = ({ path, encoding }) =>
  new Promise((res, rej) => {
    fs.readFile(path, encoding, (err, data) => {
      if (err) {
        rej(err);
        return;
      }

      res(data);
    });
  });

module.exports = {
  write,
  read
};
