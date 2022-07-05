const {fetchUsers} = require("../model/users.model");

exports.getUsers = (req, res) => {
  fetchUsers().then((data) => {
    res.status(200).send({ users: data });
  });
};
