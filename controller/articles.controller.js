const {
  fetchAllArticles,
  fetchArticleComment,
} = require("../model/articles.model");

exports.getAllArticles = (req, res, next) => {
  const { sort_by } = req.query;
  const { order_by } = req.query;
  const { filter_by } = req.query;
  fetchAllArticles(sort_by, order_by,filter_by)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleComment = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleComment(article_id)
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch((err) => {
      next(err);
    });
};
