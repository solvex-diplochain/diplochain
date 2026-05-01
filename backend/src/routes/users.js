const express = require('express');
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const {
  getUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const router = express.Router();

const updateValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le prénom doit contenir entre 2 et 50 caractères'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères'),
  body('phoneNumber')
    .optional()
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Numéro de téléphone invalide'),
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Date de naissance invalide'),
  body('role')
    .optional()
    .isIn(['student', 'employer', 'institution', 'admin'])
    .withMessage('Rôle invalide'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive doit être un booléen'),
  body('isEmailVerified')
    .optional()
    .isBoolean()
    .withMessage('isEmailVerified doit être un booléen')
];

router.get('/', protect, authorize('admin'), getUsers);
router.get('/me', protect, getCurrentUser);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateValidation, updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;