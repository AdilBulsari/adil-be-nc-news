const db = require("../db/connection");

exports.fetchArtcileByiD = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id=$1;", [id])
    .then((result) => {
      return result.rows;
    });
};
