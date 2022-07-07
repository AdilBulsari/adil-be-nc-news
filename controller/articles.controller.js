const {
  fetchAllArticles,
  fetchArticleComment,
} = require("../model/articles.model");

exports.getAllArticles = (req, res, next) => {
  fetchAllArticles()
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
