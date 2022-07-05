const express = require("express");
const { getTopic } = require("./controller/getTopic.controller");
const { getArticleByiD } = require("./controller/getArticle.controller");

const app = express();

app.get("/api/topics", getTopic);
app.get("/api/articles/:article_id", getArticleByiD);

module.exports = app;
