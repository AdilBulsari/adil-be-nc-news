const { addCommentByArticleId } = require("../model/comments.model.js");

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const commentToPost = req.body;
  console.log(article_id);

  addCommentByArticleId(article_id, commentToPost)
    .then((postedComment) => {
      res.status(200).send({ postedComment });
    })
    .catch((err) => {
      next(err);
    });
};
