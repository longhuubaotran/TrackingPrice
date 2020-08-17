const crawlData = require("../mainFunctions/crawlData");
const User = require("../models/user");

exports.crawlPlayerData = async (req, res) => {
  const { playerURLList } = req.body;
  const errors = [];

  for (let i = 0; i < playerURLList.length; i++) {
    const tempPlayer = await crawlData(playerURLList[i].playerURL);

    if (tempPlayer === undefined) {
      // Push the invalid url into array
      errors.push(playerURLList[i].playerURL);
    } else {
      // Add url link to each user
      const player = { ...tempPlayer, link: playerURLList[i].playerURL };

      const user = await User.findById(req.userId).select("-password");

      // Check if player is already existed
      const filteredPlayers = user.players.filter((item) => {
        if (item.link !== player.link) {
          return item;
        }
      });

      user.players = [player, ...filteredPlayers];
      await user.save();
    }
  }

  res.status(200).json(errors);
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

exports.deleteAllPlayers = async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  user.players = [];
  await user.save();
  res.status(200).json("All Players have been deleted");
};
