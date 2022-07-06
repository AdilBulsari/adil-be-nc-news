const db = require("../db/connection");

exports.fetchCommentByArticleId = (id) => {
  return db
    .query(
      "SELECT COUNT(comments.article_id) AS TOTAL_COMMENTS FROM comments LEFT JOIN articles ON articles.article_id = comments.article_id WHERE articles.article_id=$1;",
      [id]
    )
    .then((data) => {
      return data.rows[0];
    });
};
