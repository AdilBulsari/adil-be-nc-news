const { fetchJson } = require("../model/allendpoints.model");

exports.getAllEndoints = (req, res) => {
  fetchJson().then((data) => {
    res.status(200).send(data);
  });
};
