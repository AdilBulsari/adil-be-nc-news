const db = require("../db/connection");

exports.fetchArticleById = (id) => {
  if (isNaN(Number(id))) {
    return Promise.reject({
      status: 400,
      err: "id must be a number",
    });
  }

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
      if (data.rowCount === 0) {
        return Promise.reject({
          status: 404,
          err: "does not exist",
        });
      }
      const updated = { ...data.rows[0] };
      updated["total_comments"] = Number(updated.total_comments);
      return updated;
    });
};
