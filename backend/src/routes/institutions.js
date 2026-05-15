const express = require('express');
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getInstitutions,
  getInstitutionById,
  createInstitution,
  updateInstitution,
  getInstitutionDiplomas,
  getMyInstitution,
  updateMyInstitution,
  uploadLogoInstitution
} = require('../controllers/institutionController');

const router = express.Router();

const createValidation = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage('Le nom doit contenir entre 3 et 150 caractères'),
  body('type')
    .optional()
    .isIn(['university', 'college', 'institute', 'academy', 'training-center'])
    .withMessage('Type invalide'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  body('phone')
    .optional()
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Numéro de téléphone invalide'),
  body('website')
    .optional()
    .matches(/^https?:\/\/.*/)
    .withMessage('URL du site web invalide')
];

const updateValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage('Le nom doit contenir entre 3 et 150 caractères'),
  body('type')
    .optional()
    .isIn(['university', 'college', 'institute', 'academy', 'training-center'])
    .withMessage('Type invalide'),
  body('phone')
    .optional()
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Numéro de téléphone invalide'),
  body('website')
    .optional()
    .matches(/^https?:\/\/.*/)
    .withMessage('URL du site web invalide')
];

// Configure multer for logo (images only)
const logoUpload = upload;

router.get('/', getInstitutions);
router.get('/my-profile', protect, authorize('institution'), getMyInstitution);
router.put('/my-profile', protect, authorize('institution'), updateValidation, updateMyInstitution);
router.post('/my-profile/upload-logo', protect, authorize('institution'), logoUpload.single('logo'), uploadLogoInstitution);
router.post('/', protect, authorize('institution'), createValidation, createInstitution);
router.get('/:id', getInstitutionById);
router.put('/:id', protect, updateValidation, updateInstitution);
router.get('/:id/diplomas', protect, getInstitutionDiplomas);

module.exports = router;