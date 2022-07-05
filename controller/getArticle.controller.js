const { fetchArtcileByiD } = require("../model/fetchArticle.model");

exports.getArticleByiD = (req, res) => {
  const { article_id } = req.params;
  console.log("id", article_id);
  fetchArtcileByiD(article_id).then((data) => {
    res.status(200).send({ topic: data });
  });
};
