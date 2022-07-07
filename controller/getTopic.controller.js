const { fetchTopic } = require("../model/fetchTopic.model");

exports.getTopic = (req, res) => {
  fetchTopic().then((topics) => {
    res.status(200).send({ topics });
  });
};
