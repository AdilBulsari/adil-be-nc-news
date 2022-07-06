const { fetchArticleById } = require("../model/fetchArticle.model");

exports.getArticleById = (req, res) => {
  const { article_id } = req.params;

  fetchArticleById(article_id).then((data) => {
    res.status(200).send({ article: data });
  });
};
