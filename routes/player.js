const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const playerController = require('../controller/playerController');

// @route   POST/crawldata
// @desc    Crawl data from url
// @access  Protected
router.post('/crawldata', auth, playerController.crawlPlayerData);

// @route   DELETE/delete/:playerId
// @desc    Delete a player
// @access  Protected
router.delete('/delete/:playerId', auth, playerController.deletePlayer);

// @route   DELETE/delete
// @desc    Delete all player
// @access  Protected
router.delete('/delete', auth, playerController.deleteAllPlayers);

// @route   GET/getplayers
// @desc    Get all players
// @access  Protected
router.get('/getplayers', auth, playerController.getPlayers);

// @route   POST/autoscan
// @desc    Auto scan data
// @access  Protected
router.post('/autoscan', auth, playerController.autoScan);

// @route   POST/stopauto
// @desc    Stop Auto scan data
// @access  Protected
router.post('/stopauto', auth, playerController.stopAuto);
module.exports = router;
