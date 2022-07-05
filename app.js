const express = require("express");
const { getTopic } = require("./controller/getTopic.controller");
const { getArticleByiD } = require("./controller/getArticle.controller");
const { patchArticle } = require("./controller/patchArticle.controller");
const { getUsers } = require("./controller/users.controller");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopic);
app.get("/api/articles/:article_id", getArticleByiD);
app.patch("/api/articles/:article_id", patchArticle);
app.get("/api/users", getUsers);

// app.get("/api/articles/:article_id", getCommentByArticleId);

module.exports = app;
