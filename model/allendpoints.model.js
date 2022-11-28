const fs = require("fs/promises");

exports.fetchJson = () => {
  return fs.readFile("./endpoints.json", "utf-8").then((data) => {
    return JSON.parse(data);
  });
};
