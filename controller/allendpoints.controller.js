const { fetchJson } = require("../model/allendpoints.model");

exports.getAllEndoints = (req, res, next) => {
  fetchJson()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      next(err);
    });
};
