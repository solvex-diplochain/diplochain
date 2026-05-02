const express = require('express');
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const {
  getBlockchainStatus,
  getNetworkInfo,
  getBalance,
  issueDiplomaOnBlockchain,
  verifyDiplomaOnBlockchain,
  revokeDiplomaOnBlockchain,
  authorizeInstitutionOnBlockchain
} = require('../controllers/blockchainController');

const router = express.Router();

const issueValidation = [
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La raison ne peut pas dépasser 500 caractères')
];

// Routes publiques
router.get('/status', getBlockchainStatus);
router.get('/network', getNetworkInfo);
router.get('/balance', getBalance);
router.get('/verify/:diplomaHash', verifyDiplomaOnBlockchain);

// Routes protégées (institution)
router.post('/issue-diploma/:diplomaId', protect, authorize('institution'), issueValidation, issueDiplomaOnBlockchain);
router.put('/revoke/:diplomaId', protect, authorize('institution'), issueValidation, revokeDiplomaOnBlockchain);

// Routes protégées (admin)
router.post('/authorize-institution/:institutionId', protect, authorize('admin'), authorizeInstitutionOnBlockchain);

module.exports = router;