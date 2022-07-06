const db = require("../db/connection");

exports.fetchArticleById = (id) => {
  return db
    .query(
      `SELECT articles.*,COUNT(comments.article_id) AS TOTAL_COMMENTS
       FROM articles LEFT JOIN comments
       ON articles.article_id = comments.article_id 
       WHERE articles.article_id=$1
       GROUP BY articles.article_id ;`,
      [id]
    )
    .then((data) => {
      const updated = { ...data.rows[0] };
      updated["total_comments"] = Number(updated.total_comments);
      return updated;
    });
};
