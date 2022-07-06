const { fetchCommentByArticleId } = require("../model/article.model");

exports.getCommentByArticleId = (req, res) => {
  const { article_id } = req.params;
  fetchCommentByArticleId(article_id).then((totalComments) => {
    console.log(totalComments);
    res.status(200).send(totalComments);
  });
};
