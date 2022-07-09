const db = require("../db/connection");

exports.fetchArticleById = (id) => {
  if (isNaN(Number(id))) {
    return Promise.reject({
      status: 400,
      message: "id must be a number",
    });
  }

  return db
    .query(
      `SELECT articles.*,CAST(COUNT(comments.article_id) AS INTEGER) AS TOTAL_COMMENTS
       FROM articles LEFT JOIN comments
       ON articles.article_id = comments.article_id 
       WHERE articles.article_id=$1
       GROUP BY articles.article_id ;`,
      [id]
    )
    .then((article) => {
      if (article.rowCount === 0) {
        return Promise.reject({
          status: 404,
          message: "does not exist",
        });
      }
      return article.rows[0];
    });
};
