const { fetchAllArticles } = require("../model/articles.model");

exports.getAllArticles = (req, res) => {
  const { sort_by, order } = req.query;
  console.log(sort_by, order);
  fetchAllArticles()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
    });
};
