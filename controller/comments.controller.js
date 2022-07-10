const {
  addCommentByArticleId,
  removeCommentById,
} = require("../model/comments.model.js");

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

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then((emptyData) => {
      res.status(200).send(emptyData);
    })
    .catch((err) => {
      next(err);
    });
};
