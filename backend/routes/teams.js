const express = require('express');

const TeamController = require('../controllers/team');

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const router = express.Router();

router.post('', checkAuth, extractFile, TeamController.createTeam);

router.put('/:id', checkAuth, extractFile, TeamController.updateTeam);

router.get('', TeamController.getTeams);

router.get('/:id', TeamController.getTeam);

router.delete('/:id', checkAuth, TeamController.deleteTeam);

module.exports = router;
