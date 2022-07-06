const express = require("express");
const { getTopic } = require("./controller/getTopic.controller");

const { getArticleById } = require("./controller/getArticle.controller");

const app = express();

app.get("/api/topics", getTopic);
app.get("/api/articles/:article_id", getArticleById);

module.exports = app;
