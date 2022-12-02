const express = require("express");
const { getTopics } = require("./controller/getTopic.controller");
const { patchArticle } = require("./controller/patchArticle.controller");
const { getUsers } = require("./controller/users.controller");
const { getAllEndoints } = require("./controller/allendpoints.controller");
const { getArticleById } = require("./controller/getArticle.controller");
const {
  getAllArticles,
  getArticleComment,
} = require("./controller/articles.controller");
const {
  postCommentByArticleId,
  deleteCommentById,
} = require("./controller/comments.controller");
const app = express();
const cors = require("cors");
const serverless = require("serverless-http");

app.use(express.json());
app.use(cors());

app.get("/api", getAllEndoints);

app.get("/api/topics", getTopics);

app.patch("/api/articles/:article_id", patchArticle);
app.get("/api/users", getUsers);

app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getArticleComment);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.use("*", (req, res) => {
  res.status(404).send({ msg: "does not exist" });
});

app.use((err, req, res, next) => {
  if (err.code == "23503") {
    res.status(400).send({ message: "Bad Request" });
  }
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: "server error" });
});

module.exports = app;
module.exports.handler = serverless(app);
