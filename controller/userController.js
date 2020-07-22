const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.createUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const password = await bcrypt.hash(req.body.password, 12);
    const user = new User({
      email: req.body.email,
      password,
    });

    await user.save();

    res.status(200).json("User created");
  } catch (err) {
    res.status(401).json(err);
  }
};
