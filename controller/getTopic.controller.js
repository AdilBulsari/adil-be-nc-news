const { fetchTopic } = require("../model/fetchTopic.model");

exports.getTopic = (req, res, next) => {
  console.log("in get toppic controller");
  fetchTopic()
    .then((data) => {
      res.status(200).send({ topic: data });
    })
    .catch((err) => {
      next(err);
    });
};

