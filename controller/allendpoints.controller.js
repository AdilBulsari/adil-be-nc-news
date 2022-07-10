const { getAllEndoints } = require("../model/allendpoints.model");

exports.getAllEndoints = (req, res) => {
  console.log("in all endpoint controller");
  fetchallEndpoints().then((data) => {
    res.status(200).send(data);
  });
};
