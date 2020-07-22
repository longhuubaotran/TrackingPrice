const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/user");

exports.createUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const isExist = await User.findOne({ email: req.body.email });
    if (isExist) {
      return res.status(401).json("Email is already existed");
    }

    const password = await bcrypt.hash(req.body.password, 12);
    const user = new User({
      email: req.body.email,
      password,
    });

    await user.save();

    res.status(201).json("User created");
  } catch (err) {
    res.status(401).json(err);
  }
};

exports.loginUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(401).json({ errors: errors.array() });
  }

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json("Email is not found");
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(400).json("Password is not correct");
    }

    const payload = {
      userId: user._id.toString(),
    };

    const token = await jwt.sign(payload, config.get("jwtsecret"), {
      expiresIn: "2h",
    });

    res.status(200).json({ msg: "Login success", token });
  } catch (error) {
    res.status(400).json(err);
  }
};
