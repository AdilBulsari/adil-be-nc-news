const { fetchAllArticles } = require("../model/articles.model");

exports.getAllArticles = (req, res) => {
  console.log("Controller : get all articles");
  fetchAllArticles()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
    });
};
