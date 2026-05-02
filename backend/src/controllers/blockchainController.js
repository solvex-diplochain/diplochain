const Diploma = require('../models/Diploma');
const blockchainService = require('../services/blockchainService');
const ipfsService = require('../services/ipfsService');
const emailService = require('../services/emailService');
const { validationResult } = require('express-validator');

// @desc    Obtenir le statut de la blockchain
// @route   GET /api/blockchain/status
// @access  Public
const getBlockchainStatus = async (req, res, next) => {
  try {
    const status = await blockchainService.checkConnection();
    const balance = await blockchainService.getBalance();

    res.status(200).json({
      success: true,
      data: {
        ...status,
        balance
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir les informations du réseau
// @route   GET /api/blockchain/network
// @access  Public
const getNetworkInfo = async (req, res, next) => {
  try {
    const chainId = await blockchainService.web3.eth.getChainId();
    const blockNumber = await blockchainService.web3.eth.getBlockNumber();
    const gasPrice = await blockchainService.web3.eth.getGasPrice();
    const networkType = process.env.BLOCKCHAIN_NETWORK || 'sepolia';

    res.status(200).json({
      success: true,
      data: {
        chainId,
        blockNumber,
        gasPrice: blockchainService.convertWeiToEth(gasPrice) + ' Gwei',
        network: networkType,
        rpcUrl: process.env.BLOCKCHAIN_RPC_URL?.substring(0, 50) + '...',
        deployerAddress: blockchainService.deployerAddress
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir le solde du compte
// @route   GET /api/blockchain/balance
// @access  Public
const getBalance = async (req, res, next) => {
  try {
    const balance = await blockchainService.getBalance();

    res.status(200).json({
      success: true,
      data: balance
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Émettre un diplôme sur la blockchain
// @route   POST /api/blockchain/issue-diploma/:diplomaId
// @access  Private (institution only)
const issueDiplomaOnBlockchain = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Erreurs de validation',
        errors: errors.array()
      });
    }

    // Récupérer le diplôme avec l'étudiant
    const diploma = await Diploma.findById(req.params.diplomaId).populate('student');
    if (!diploma) {
      return res.status(404).json({
        success: false,
        message: 'Diplôme non trouvé'
      });
    }

    // Vérifier que l'utilisateur est l'institution propriétaire
    // Note: req.user.id est l'ID de l'utilisateur admin de l'institution
    const institution = await Institution.findOne({ adminUser: req.user._id });
    if (!institution || (institution._id.toString() !== diploma.institution.toString() && req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé. Seule l\'institution émettrice peut effectuer cette action.'
      });
    }

    // Vérifier que le diplôme n'est pas déjà émis
    if (diploma.issuedOnBlockchain) {
      return res.status(400).json({
        success: false,
        message: 'Ce diplôme a déjà été émis sur la blockchain'
      });
    }

    // Déterminer l'adresse de l'étudiant
    let studentAddress = diploma.student.walletAddress;
    
    if (!studentAddress) {
      // Si l'étudiant n'a pas d'adresse, on en génère une déterministe pour le test
      // En production, l'étudiant devrait avoir configuré son wallet
      const studentHash = blockchainService.web3.utils.keccak256(
        blockchainService.web3.utils.utf8ToHex(diploma.student._id.toString())
      );
      studentAddress = '0x' + studentHash.substring(2, 42);
      console.warn(`⚠️  L'étudiant n'a pas de wallet, utilisation d'une adresse générée: ${studentAddress}`);
    }

    // Préparer les métadonnées pour la blockchain
    const metadata = {
      title: diploma.title,
      field: diploma.field,
      level: diploma.level,
      issueDate: diploma.issueDate,
      institution: institution.name,
      certificateNumber: diploma.certificateNumber,
      studentName: `${diploma.student.firstName} ${diploma.student.lastName}`
    };
    
    // 1. Uploader sur IPFS
    let metadataURI = '';
    try {
      const ipfsResult = await ipfsService.uploadJSON(metadata);
      metadataURI = ipfsResult.hash; // On stocke juste le hash (CID) sur la blockchain
      console.log(`✅ Métadonnées uploadées sur IPFS: ${ipfsResult.hash}`);
    } catch (ipfsError) {
      console.warn('⚠️  Échec de l\'upload IPFS, utilisation du JSON local');
      metadataURI = JSON.stringify(metadata).substring(0, 32); // Fallback limité (pas idéal mais évite le crash)
    }

    // 2. Émettre sur la blockchain
    const blockchainResult = await blockchainService.issueDiplomaHash(
      diploma.blockchainHash,
      studentAddress,
      metadataURI
    );

    // 3. Mettre à jour le diplôme en DB
    await diploma.markAsBlockchainIssued(
      blockchainResult.transactionHash,
      studentAddress
    );

    // Stocker le CID IPFS
    diploma.metadata = { ...diploma.metadata, ipfsHash: metadataURI };
    diploma.verificationUrl = blockchainService.generateVerificationUrl(diploma.blockchainHash);
    await diploma.save();

    // 4. Envoyer une notification par email à l'étudiant
    try {
      await emailService.sendDiplomaIssuedNotification(
        diploma.student.email,
        diploma.student.firstName,
        diploma.title,
        diploma.verificationUrl
      );
      console.log(`📧 Notification envoyée à ${diploma.student.email}`);
    } catch (emailError) {
      console.error('⚠️  Erreur lors de l\'envoi de l\'email:', emailError.message);
    }

    res.status(200).json({
      success: true,
      message: 'Diplôme émis sur la blockchain et notifié avec succès',
      data: {
        diploma,
        blockchain: blockchainResult,
        ipfs: { hash: metadataURI }
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Vérifier un diplôme sur la blockchain
// @route   GET /api/blockchain/verify/:diplomaHash
// @access  Public
const verifyDiplomaOnBlockchain = async (req, res, next) => {
  try {
    const { diplomaHash } = req.params;

    // Récupérer le diplôme
    const diploma = await Diploma.findByBlockchainHash(diplomaHash)
      .populate('student', 'firstName lastName email')
      .populate('institution', 'name email');

    if (!diploma) {
      return res.status(404).json({
        success: false,
        message: 'Diplôme non trouvé',
        verified: false
      });
    }

    // Vérifier sur la blockchain
    const blockchainVerification = await blockchainService.verifyDiploma(diplomaHash);

    res.status(200).json({
      success: true,
      verified: diploma.issuedOnBlockchain && blockchainVerification.verified,
      data: {
        diploma: {
          certificateNumber: diploma.certificateNumber,
          studentName: `${diploma.student.firstName} ${diploma.student.lastName}`,
          institutionName: diploma.institution.name,
          title: diploma.title,
          field: diploma.field,
          level: diploma.level,
          issueDate: diploma.issueDate,
          grade: diploma.grade,
          gpa: diploma.gpa,
          status: diploma.status
        },
        blockchain: {
          hash: diplomaHash,
          transactionHash: diploma.blockchainTxHash,
          timestamp: diploma.blockchainTimestamp,
          address: diploma.blockchainAddress
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Révoquer un diplôme sur la blockchain
// @route   PUT /api/blockchain/revoke/:diplomaId
// @access  Private (institution only)
const revokeDiplomaOnBlockchain = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Erreurs de validation',
        errors: errors.array()
      });
    }

    // Récupérer le diplôme
    const diploma = await Diploma.findById(req.params.diplomaId);
    if (!diploma) {
      return res.status(404).json({
        success: false,
        message: 'Diplôme non trouvé'
      });
    }

    // Vérifier les permissions
    if (diploma.institution.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé'
      });
    }

    // Vérifier que le diplôme est émis
    if (!diploma.issuedOnBlockchain) {
      return res.status(400).json({
        success: false,
        message: 'Ce diplôme n\'a pas été émis sur la blockchain'
      });
    }

    // Révoquer sur la blockchain
    const blockchainResult = await blockchainService.revokeDiploma(
      diploma.blockchainHash
    );

    // Mettre à jour le diplôme en DB
    await diploma.revoke(req.body.reason || 'Révocation par l\'institution');

    // Notifier l'étudiant
    try {
      // Re-peupler l'étudiant pour avoir l'email
      const populatedDiploma = await Diploma.findById(diploma._id).populate('student');
      await emailService.sendDiplomaRevokedNotification(
        populatedDiploma.student.email,
        populatedDiploma.student.firstName,
        populatedDiploma.title,
        req.body.reason || 'Révocation par l\'institution'
      );
    } catch (emailError) {
      console.error('⚠️  Erreur lors de l\'envoi de l\'email de révocation:', emailError.message);
    }

    res.status(200).json({
      success: true,
      message: 'Diplôme révoqué sur la blockchain et notifié avec succès',
      data: {
        diploma,
        blockchain: blockchainResult
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Autoriser une institution sur la blockchain
// @route   POST /api/blockchain/authorize-institution/:institutionId
// @access  Private (admin only)
const authorizeInstitutionOnBlockchain = async (req, res, next) => {
  try {
    // Vérifier que l'utilisateur est admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Action réservée aux administrateurs DiploChain'
      });
    }

    // Récupérer l'institution
    const institution = await Institution.findById(req.params.institutionId);
    if (!institution) {
      return res.status(404).json({
        success: false,
        message: 'Institution non trouvée'
      });
    }

    if (!institution.blockchainAddress) {
      return res.status(400).json({
        success: false,
        message: 'L\'institution n\'a pas d\'adresse blockchain configurée'
      });
    }

    // Ajouter sur la blockchain
    const blockchainResult = await blockchainService.addInstitution(institution.blockchainAddress);

    // Mettre à jour en DB
    institution.isVerified = true;
    institution.blockchainDeployed = true;
    await institution.save();

    res.status(200).json({
      success: true,
      message: 'Institution autorisée sur la blockchain avec succès',
      data: {
        institution,
        blockchain: blockchainResult
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBlockchainStatus,
  getNetworkInfo,
  getBalance,
  issueDiplomaOnBlockchain,
  verifyDiplomaOnBlockchain,
  revokeDiplomaOnBlockchain,
  authorizeInstitutionOnBlockchain
};
