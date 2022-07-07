const db = require("../db/connection");

exports.fetchAllArticles = () => {
  return db
    .query(
      `SELECT articles.*,CAST(COUNT(comments.article_id) AS INTEGER) AS comment_count FROM comments
  FULL OUTER JOIN articles ON articles.article_id=comments.article_id
     GROUP BY articles.article_id ORDER BY articles.created_at DESC;`
    )
    .then((data) => {
      return data.rows;
    });
};
