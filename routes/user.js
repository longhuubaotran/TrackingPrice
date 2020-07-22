const express = require("express");
const { body } = require("express-validator");
const userController = require("../controller/userController");
const router = express.Router();

// @route   POST /user
// @desc    Register a new user
// @access  Public
router.post(
  "/",
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

module.exports = router;
