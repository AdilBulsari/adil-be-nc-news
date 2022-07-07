const { fetchAllArticles } = require("../model/articles.model");

exports.getAllArticles = (req, res) => {
  fetchAllArticles()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
    });
};
