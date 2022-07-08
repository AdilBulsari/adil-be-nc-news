const { addCommentByArticleId } = require("../model/comments.model.js");

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const commentToPost = req.body;
  console.log(article_id);
  console.log(commentToPost);

  addCommentByArticleId(article_id, commentToPost)
    .then((postedComment) => {
      console.log(postedComment);
      res.status(200).send({ postedComment });
      //   res.status(200).send({
      //     body: data["body"],
      //     author: data["author"],
      //   });
    })
    .catch((err) => {
      next(err);
    });
};
