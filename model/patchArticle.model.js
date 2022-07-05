const db = require("../db/connection");

exports.updateArticleById = (updatedArticle, article_id) => {
  console.log("in model");
  const { inc_votes } = updatedArticle;
  return db
    .query(
      "UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *;",
      [inc_votes, article_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};
