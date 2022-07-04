const express = require("express");
const { getTopic } = require("./controller/getTopic.controller");

const app = express();

app.get("/api/topics", getTopic);

module.exports = app;
