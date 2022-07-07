const express = require("express");
const { getTopic } = require("./controller/getTopic.controller");
const { getArticleById } = require("./controller/getArticle.controller");

const { getArticleById } = require("./controller/getArticle.controller");

const app = express();

app.get("/api/topics", getTopic);
app.get("/api/articles/:article_id", getArticleById);

app.use("*", (req, res) => {
  res.status(404).send({ msg: "does not exist" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({
      msg: err.err,
    });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});


module.exports = app;
