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

exports.fetchArticleComment = (id) => {
  if (isNaN(Number(id))) {
    return Promise.reject({
      message: "Invalid path",
      status: 422,
    });
  }
  return db
    .query(
      `SELECT c.comment_id,c.votes,c.created_at,c.author,c.body FROM comments c
   JOIN articles a ON c.article_id =a.article_id 
   WHERE a.article_id = $1;`,
      [id]
    )
    .then((commentsArray) => {
      if (commentsArray.rowCount === 0) {
        return Promise.reject({
          message: "not found",
          status: 404,
        });
      }
      return commentsArray.rows;
    });
};
