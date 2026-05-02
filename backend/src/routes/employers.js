const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
  getEmployers,
  getEmployerById,
  updateEmployerProfile
} = require('../controllers/employerController');

const router = express.Router();

const updateValidation = [
  body('employerProfile.companyName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom de l\'entreprise doit contenir entre 2 et 100 caractères'),
  body('employerProfile.companySize')
    .optional()
    .isIn(['startup', 'small', 'medium', 'large', 'enterprise'])
    .withMessage('Taille d\'entreprise invalide'),
  body('employerProfile.website')
    .optional()
    .matches(/^https?:\/\/.*/)
    .withMessage('URL du site web invalide'),
  body('employerProfile.jobTitle')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le titre du poste doit contenir entre 2 et 100 caractères')
];

router.get('/', getEmployers);
router.get('/:id', getEmployerById);
router.put('/:id', protect, updateValidation, updateEmployerProfile);

module.exports = router;