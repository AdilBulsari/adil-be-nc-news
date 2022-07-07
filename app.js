const express = require("express");
const { getTopic } = require("./controller/getTopic.controller");
const { patchArticle } = require("./controller/patchArticle.controller");
const { getUsers } = require("./controller/users.controller");

const { getArticleById } = require("./controller/getArticle.controller");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopic);

app.patch("/api/articles/:article_id", patchArticle);
app.get("/api/users", getUsers);

app.get("/api/articles/:article_id", getArticleById);

module.exports = app;
