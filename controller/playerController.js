const crawlData = require('../mainFunctions/crawlData');
const User = require('../models/user');
const nodemailer = require('nodemailer');

exports.crawlPlayerData = async (req, res) => {
  const { playerURLList } = req.body;
  const errors = [];

  for (let i = 0; i < playerURLList.length; i++) {
    if (playerURLList[i].playerURL === '') {
      continue;
    }

    const tempPlayer = await crawlData(playerURLList[i].playerURL);

    if (tempPlayer === undefined) {
      // Push the invalid url into array
      errors.push(playerURLList[i].playerURL);
    } else {
      // Add url link to each user
      const player = { ...tempPlayer, link: playerURLList[i].playerURL };

      const user = await User.findById(req.userId).select('-password');

      // Check if player is already existed
      const filteredPlayers = user.players.filter((item) => {
        if (item.link !== player.link) {
          return item;
        }
      });

      // delete the last player to insert new one, array always has 5 items
      if (filteredPlayers.length >= 4) {
        filteredPlayers.splice(4, filteredPlayers.length - 1);
      }

      user.players = [player, ...filteredPlayers];
      await user.save();
    }
  }
  if (errors.length > 0) {
    return res.status(400).json(errors);
  }
  res.status(200).end();
};

exports.getPlayers = async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  res.status(200).json({ players: user.players });
};

exports.deletePlayer = async (req, res) => {
  const playerId = req.params.playerId;
  const user = await User.findById(req.userId).select('-password');
  const filterdPlayers = user.players.filter(
    (item) => item._id.toString() !== playerId
  );
  user.players = [...filterdPlayers];
  await user.save();
  res.status(200).json("Player's been deleted");
};

exports.deleteAllPlayers = async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  user.players = [];
  await user.save();
  res.status(200).json('All Players have been deleted');
};

exports.autoScan = async (req, res) => {
  const { email, timer } = req.body;
  let playersList = [];

  // Set autoScan of user to true
  await User.updateOne({ _id: req.userId }, { $set: { autoScan: true } });

  let user = await User.findById(req.userId).select('-password');

  let { autoScan, players } = user;

  while (autoScan) {
    playersList = [];
    for (let i = 0; i < players.length; i++) {
      const tempPlayer = await crawlData(players[i].link);
      playersList.push(tempPlayer);
    }

    sendEmail(playersList, email);
    await sleep(timer * 60000);

    // Check condition to loop
    user = await User.findById(req.userId).select('-password');
    autoScan = user.autoScan;
  }

  res.status(200).end();
};

exports.stopAuto = async (req, res) => {
  // Set autoScan of user to false
  await User.updateOne({ _id: req.userId }, { $set: { autoScan: false } });
  res.status(200).json({ msg: 'Stop auto' });
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sendEmail(playersList, email) {
  let text = '';
  playersList.forEach((player) => {
    let tempText = `${player.name} | ${player.rating} | ${player.pos} | ps:${player.psPrice} | xb:${player.xbPrice} | pc:${player.pcPrice} \n \n`;
    text += tempText;
  });

  text += `Chúc mọi người chơi game vui vẻ`;

  // Set up Nodemailer
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'baolongfut@gmail.com', // generated ethereal user
      pass: 'futtool4680', // generated ethereal password
    },
  });

  const mailOptions = {
    from: 'baolongtranfifa@gmail.com',
    to: email,
    subject: 'Fut Price',
    text,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
