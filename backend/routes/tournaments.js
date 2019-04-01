const express = require('express');

const TournamentController = require('../controllers/tournament');

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const router = express.Router();

router.post('', checkAuth, extractFile, TournamentController.createTournament);

router.put(
  '/:id',
  checkAuth,
  extractFile,
  TournamentController.updateTournament
);

router.get('', TournamentController.getTournaments);

router.get('/:id', TournamentController.getTournament);

router.get('/');

router.delete('/:id', checkAuth, TournamentController.deleteTournament);

module.exports = router;
