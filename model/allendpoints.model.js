const db = require("../db/connection");
exports.getAllEndoints = () => {
  return db.query();
};
