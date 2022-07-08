const db = require("../db/connection");

exports.addCommentByArticleId = (article_id, commentToPost) => {
  const { username, body } = commentToPost;
  //   if (isNaN(Number(article_id))) {
  //     return Promise.reject({
  //       msg: "Invalid Id",
  //       status: 422,
  //     });
  //   }
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
