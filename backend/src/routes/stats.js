const express = require('express');
const { getStats } = require('../controllers/statsController');

const router = express.Router();

// @route   GET /api/stats
router.get('/', getStats);

module.exports = router;
