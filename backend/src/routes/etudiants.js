const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getStudents, importStudents, createStudent } = require('../controllers/studentController');

const router = express.Router();

// @route   GET /api/etudiants
router.get('/', protect, authorize('institution', 'admin'), getStudents);

// @route   POST /api/etudiants
router.post('/', protect, authorize('institution'), createStudent);

// @route   POST /api/etudiants/import
router.post('/import', protect, authorize('institution'), upload.single('file'), importStudents);

module.exports = router;
