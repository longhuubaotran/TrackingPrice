const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { body } = require("express-validator");
const playerController = require("../controller/playerController");

// @route   POST/getdata
// @desc    Crawl data from url
// @access  Protected
router.post(
  "/crawldata",
  auth,
  [
    body("playerURL", "Please Enter a valid URL")
      .isURL()
      .custom((value) => {
        // only futbin.com is valid
        if (value.indexOf("futbin.com") === -1) {
          throw new Error("Only futbin.com");
        }
        return true;
      }),
  ],
  playerController.crawlPlayerData
);

// @route   DELETE/deletedata
// @desc    Delete a player
// @access  Protected
router.delete("/delete/:playerId", auth, playerController.deletePlayer);

// @route   GET/getplayers
// @desc    Get all players
// @access  Protected
router.get("/getplayers", auth, playerController.getPlayers);

module.exports = router;
