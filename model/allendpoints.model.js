const fs = require("fs/promises");

exports.fetchJson = () => {
  console.log('in model')
  return fs.readFile("./endpoints.json", "utf-8").then((data) => {
    console.log(data)
    return JSON.parse(data);
  });
};
