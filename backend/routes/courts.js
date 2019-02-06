const express = require('express');

const CourtController = require('../controllers/court');

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const router = express.Router();

router.post('', checkAuth, extractFile, CourtController.createCourt);

router.put('/:id', checkAuth, extractFile, CourtController.updateCourt);

router.get('', CourtController.getCourts);

router.get('/:id', CourtController.getCourt);

router.delete('/:id', checkAuth, CourtController.deleteCourt);

module.exports = router;
