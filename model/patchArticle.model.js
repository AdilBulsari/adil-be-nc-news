const db = require("../db/connection");

exports.patchArtcileByiD = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id=$1;", [id])
    .then((result) => {
      return result.rows;
    });
};
