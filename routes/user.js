const express = require("express");
const { body } = require("express-validator");
const userController = require("../controller/userController");
const auth = require("../middleware/auth");
const User = require("../models/user");
const router = express.Router();

// @route   POST /user/register
// @desc    Register a new user
// @access  Public
router.post(
  "/register",
  [
    body("email", "Please Enter a Valid Email").isEmail().normalizeEmail(),
    body("password", "Password must be at least 6 charaters")
      .isAlphanumeric()
      .isLength({ min: 6 })
      .trim(),
    body("passwordConfirmation").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
  ],
  userController.createUser
);

// @route   POST/user/login
// @desc    Login
// @access  public
router.post(
  "/login",
  [body("email", "Please Enter a Valid Email").isEmail().normalizeEmail()],
  userController.loginUser
);

module.exports = router;
