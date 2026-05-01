const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  createDiploma,
  getDiplomas,
  getDiplomaById,
  verifyDiplomaByHash,
  revokeDiploma
} = require('../controllers/diplomaController');

const router = express.Router();

// @route   POST /api/diplomes
router.post('/', protect, authorize('institution'), upload.single('diplomaFile'), createDiploma);

// @route   GET /api/diplomes
router.get('/', protect, getDiplomas);

// @route   GET /api/diplomes/verify/:code
// Note: Le code dans le prompt correspond au blockchainHash
router.get('/verify/:code', verifyDiplomaByHash);

// @route   GET /api/diplomes/:id
router.get('/:id', protect, getDiplomaById);

module.exports = router;
