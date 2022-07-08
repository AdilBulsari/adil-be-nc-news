const express = require("express");
const { getTopic } = require("./controller/getTopic.controller");
const { getArticleById } = require("./controller/getArticle.controller");
const {
  getAllArticles,
  getArticleComment,
} = require("./controller/articles.controller");
const { postCommentByArticleId } = require("./controller/comments.controller");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopic);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getArticleComment);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.use("*", (req, res) => {
  res.status(404).send({ message: "not found" });
});

app.use((err, req, res, next) => {
  if (err.code == "23503") {
    res.status(400).send({ message: "Bad Request" });
    // next(err);
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
