const express = require("express");
const { getTopic } = require("./controller/getTopic.controller");
const { getArticleByiD } = require("./controller/getArticle.controller");
const { patchArticle } = require("./controller/patchArticle.controller");

const app = express();

app.get("/api/topics", getTopic);
app.get("/api/articles/:article_id", getArticleByiD);
app.patch("/api/articles/:article_id", patchArticle);

module.exports = app;
