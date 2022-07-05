const { patchArtcileByiD } = require("../model/patchArticle.model");

exports.patchArticle = (req, res) => {
  const { article_id } = req.params;
  console.log(article_id);
};
