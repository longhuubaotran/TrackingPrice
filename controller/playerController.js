const { validationResult } = require("express-validator");
const User = require("../models/user");

exports.getPlayerData = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({ errors: errors.array() });
  }
};
