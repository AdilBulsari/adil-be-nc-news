const db = require("../db/connection");

exports.addCommentByArticleId = (article_id, commentToPost) => {
  const commentReqBody = Object.keys(commentToPost);
  const { username, body } = commentToPost;

  if (
    commentReqBody.length < 2 ||
    commentReqBody[0] !== "username" ||
    typeof commentReqBody[0] !== "string"
  ) {
    return Promise.reject({
      message: "Unsupported Data/Body sent",
      status: 415,
    });
  }

  if (isNaN(Number(article_id))) {
    return Promise.reject({
      message: "Invalid id",
      status: 422,
    });
  }
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

exports.removeCommentById = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id=${comment_id};`)
    .then((deleteData) => {
      if (deleteData.rowCount === 0) {
        return Promise.reject({
          message: "does not exist",
          status: 404,
        });
      }
      return deleteData.rows;
    });
};
