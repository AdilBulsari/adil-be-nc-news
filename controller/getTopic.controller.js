const { fetchTopic } = require("../model/fetchTopic.model");

exports.getTopic = (req, res) => {
  console.log("in get toppic controller");
  fetchTopic().then((data) => {
    res.status(200).send({ topic: data });
  });
};
