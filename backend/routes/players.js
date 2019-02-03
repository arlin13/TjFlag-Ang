const express = require('express');

const PlayerController = require('../controllers/player');

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const router = express.Router();

router.post('', checkAuth, extractFile, PlayerController.createPlayer);

router.put('/:id', checkAuth, extractFile, PlayerController.updatePlayer);

router.get('', PlayerController.getPlayers);

router.get('/:id', PlayerController.getPlayer);

router.delete('/:id', checkAuth, PlayerController.deletePlayer);

module.exports = router;
