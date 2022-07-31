const db = require("../db/connection");

exports.fetchAllArticles = (
  sort_by = "created_at",
  order_by = "desc",
  filter_by
) => {
  const validSorts = [
    "article_id",
    "comment_count",
    "title",
    "author",
    "created_at",
    "votes",
  ];
  const validOrder = ["ASC", "DESC"];
  let queryString = `SELECT articles.*,CAST(COUNT(comments.article_id) AS INTEGER) AS comment_count FROM comments
  LEFT JOIN articles ON articles.article_id=comments.article_id
     GROUP BY articles.article_id ORDER BY ${sort_by} ${order_by.toUpperCase()};`;

  let queryValue = [];

  if (!validSorts.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      message: "invalid sort request",
    });
  } else if (!validOrder.includes(order_by.toUpperCase())) {
    return Promise.reject({
      status: 400,
      message: "invalid order request",
    });
  }

  if (filter_by) {
    queryValue.push(filter_by);
    queryString = `SELECT articles.article_id,articles.title,articles.author,articles.votes,articles.topic,articles.created_at,COUNT(comments.article_id)::INT AS comment_count FROM articles left JOIN comments ON comments.article_id=articles.article_id WHERE topic=$1 GROUP BY articles.article_id  ORDER BY ${sort_by} ${order_by}`;
    return db.query(queryString, queryValue).then(({ rows }) => {
      return rows;
    });
  } else {
    return db.query(queryString).then(({ rows }) => {
      return rows;
    });
  }
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
