const db = require("../db/connection");

exports.addCommentByArticleId = (article_id, commentToPost) => {
  const { username, body } = commentToPost;

  if (isNaN(Number(article_id))) {
    return Promise.reject({
      message: "Invalid id",
      status: 422,
    });
  }
  //   return db
  //     .query(
  //       `
  //   SELECT * FROM articles WHERE article_id = $1;
  //   `,
  //       [article_id]
  //     )
  //     .then((data) => {
  //       if (data.rowCount === 0) {
  //         return Promise.reject({
  //           message: "not found",
  //           status: 404,
  //         });
  //       } else {
  return db
    .query(
      `
  INSERT INTO comments (body,article_id,author) VALUES ($1, $2, $3) RETURNING *;
  `,
      [body, article_id, username]
    )
    .then((data) => {
      return data.rows[0];
    });
};
