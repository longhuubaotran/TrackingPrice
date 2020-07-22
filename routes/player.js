const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { body } = require("express-validator");
const playerController = require("../controller/playerController");

// @route   POST/getdata
// @desc    Crawl data from url
// @access  private
router.post(
  "/getdata",
  auth,
  [body("playerURL", "Please Enter a valid URL").isURL()],
  playerController.getPlayerData
);

module.exports = router;
