const { validationResult } = require("express-validator");
const crawlData = require("../mainFunctions/crawlData");
const User = require("../models/user");

exports.crawlPlayerData = async (req, res) => {
  const errors = validationResult(req);
  // Check any errors from input validation
  if (!errors.isEmpty()) {
    return res.status(401).json({ errors: errors.array() });
  }

  const player = await crawlData(req.body.playerURL);
  if (player === undefined) {
    return res
      .status(404)
      .json("Can't find this player, Please check URL again");
  }

  const user = await User.findById(req.userId).select("-password");

  // Check if player is already existed
  const filteredPlayers = user.players.filter((item) => {
    if (item.name !== player.name || item.pos !== player.pos) {
      return item;
    }
  });

  user.players = [player, ...filteredPlayers];
  await user.save();

  res.status(200).json("Player Added to Database");
};

exports.getPlayers = async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  res.status(200).json({ players: user.players });
};

exports.deletePlayer = async (req, res) => {
  const playerId = req.params.playerId;
  const user = await User.findById(req.userId).select("-password");
  const filterdPlayers = user.players.filter(
    (item) => item._id.toString() !== playerId
  );
  user.players = [...filterdPlayers];
  await user.save();
  res.status(200).json("Player's been deleted");
};
