const { fetchTopic } = require("../model/fetchTopic.model");

exports.getTopic = (req, res) => {
  fetchTopic().then((data) => {
    res.status(200).send({ topic: data });
  });
};
