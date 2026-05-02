const express = require('express');
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  createDiploma,
  getDiplomas,
  getDiplomaById,
  verifyDiplomaByHash,
  updateDiploma,
  deleteDiploma,
  revokeDiploma
} = require('../controllers/diplomaController');

const router = express.Router();

const createDiplomaValidation = [
  body('studentId')
    .isMongoId()
    .withMessage('ID d\'étudiant invalide'),
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Le titre doit contenir entre 5 et 200 caractères'),
  body('field')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le domaine doit contenir entre 2 et 100 caractères'),
  body('level')
    .optional()
    .isIn(['bachelor', 'master', 'phd', 'diploma', 'certificate'])
    .withMessage('Niveau invalide'),
  body('issueDate')
    .isISO8601()
    .withMessage('Date d\'émission invalide'),
  body('grade')
    .optional()
    .isIn(['distinction', 'merit', 'pass', 'fail'])
    .withMessage('Note invalide'),
  body('gpa')
    .optional()
    .isFloat({ min: 0, max: 4 })
    .withMessage('GPA doit être entre 0 et 4')
];

const updateDiplomaValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Le titre doit contenir entre 5 et 200 caractères'),
  body('field')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le domaine doit contenir entre 2 et 100 caractères'),
  body('level')
    .optional()
    .isIn(['bachelor', 'master', 'phd', 'diploma', 'certificate'])
    .withMessage('Niveau invalide'),
  body('issueDate')
    .optional()
    .isISO8601()
    .withMessage('Date d\'émission invalide'),
  body('grade')
    .optional()
    .isIn(['distinction', 'merit', 'pass', 'fail'])
    .withMessage('Note invalide'),
  body('gpa')
    .optional()
    .isFloat({ min: 0, max: 4 })
    .withMessage('GPA doit être entre 0 et 4')
];

// Routes publiques
router.get('/verify/:blockchainHash', verifyDiplomaByHash);

// Routes protégées
router.post('/', protect, authorize('institution'), upload.single('diplomaFile'), createDiplomaValidation, createDiploma);
router.get('/', protect, getDiplomas);
router.get('/:id', protect, getDiplomaById);
router.put('/:id', protect, authorize('institution'), updateDiplomaValidation, updateDiploma);
router.delete('/:id', protect, authorize('institution'), deleteDiploma);
router.put('/:id/revoke', protect, authorize('institution'), revokeDiploma);

module.exports = router;