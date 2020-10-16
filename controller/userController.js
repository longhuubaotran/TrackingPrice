const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/user');

exports.createUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if user's email existed
    const isExist = await User.findOne({ email: req.body.email });
    if (isExist) {
      return res
        .status(401)
        .json({ errors: [{ msg: 'Email is already existed' }] });
    }

    const password = await bcrypt.hash(req.body.password, 12);
    const user = new User({
      email: req.body.email,
      password,
      autoScan: false,
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id.toString() },
      config.get('jwtsecret'),
      { expiresIn: '2h' }
    );

    res.status(201).json({ msg: 'User created', token });
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
      return res.status(401).json({ errors: [{ msg: 'Email is not found' }] });
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passwordMatch) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Password is not correct' }] });
    }

    const payload = {
      userId: user._id.toString(),
    };

    const token = await jwt.sign(payload, config.get('jwtsecret'), {
      expiresIn: '2h',
    });

    res.status(200).json({ msg: 'Login success', token });
  } catch (error) {
    res.status(400).json(err);
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Can't get user with this user id" }] });
    }
    res.status(200).json({ user });
  } catch (err) {
    res.status(400).json(err);
  }
};
