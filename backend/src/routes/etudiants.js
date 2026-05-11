const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getStudents, importStudents, createStudent, downloadTemplate } = require('../controllers/studentController');

const router = express.Router();

// @route   GET /api/etudiants
router.get('/', protect, authorize('institution', 'admin'), getStudents);

// @route   POST /api/etudiants
router.post('/', protect, authorize('institution'), createStudent);

// @route   POST /api/etudiants/import
router.post('/import', protect, authorize('institution'), upload.single('file'), importStudents);

// @route   GET /api/etudiants/template
router.get('/template', protect, authorize('institution'), downloadTemplate);

module.exports = router;
