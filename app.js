const express = require("express");
const { getTopic } = require("./controller/getTopic.controller");
const { getArticleById } = require("./controller/getArticle.controller");
const { getAllArticles } = require("./controller/articles.controller");

const app = express();

app.get("/api/topics", getTopic);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getAllArticles);

app.use("*", (req, res) => {
  res.status(404).send({ message: "not found" });
});

module.exports = app;
