const { fetchTopics } = require("../model/fetchTopic.model");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((data) => {
      res.status(200).send({ topic: data });
    })
    .catch((err) => {
      next(err);
    });
};
