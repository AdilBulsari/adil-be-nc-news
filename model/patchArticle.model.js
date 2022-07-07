const db = require("../db/connection");

exports.updateArticleById = (updatedArticle, article_id) => {
  if (Object.keys(updatedArticle).length === 0) {
    return Promise.reject({
      status: 415,
      err: "empty body",
    });
  }
  if (isNaN(Number(article_id))) {
    return Promise.reject({
      status: 400,
      err: "enter valid id..",
    });
  }

  const { inc_votes } = updatedArticle;
  if (isNaN(Number(inc_votes))) {
    return Promise.reject({
      status: 422,
      err: "enter valid vote number",
    });
  }
  return db
    .query(
      "UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *;",
      [inc_votes, article_id]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          err: "does not exist",
        });
      }
      return result.rows[0];
    });
};
