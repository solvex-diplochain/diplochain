const Diploma = require('../models/Diploma');
const User = require('../models/User');
const Institution = require('../models/Institution');
const ipfsService = require('../services/ipfsService');
const blockchainService = require('../services/blockchainService');
const { validationResult } = require('express-validator');

// @desc    Créer un nouveau diplôme
// @route   POST /api/diplomas
// @access  Private (institution only)
const createDiploma = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Erreurs de validation',
        errors: errors.array()
      });
    }

    // Vérifier que l'utilisateur est une institution
    if (req.user.role !== 'institution') {
      return res.status(403).json({
        success: false,
        message: 'Seules les institutions peuvent créer des diplômes'
      });
    }

    // Vérifier que l'institution existe
    const institution = await Institution.findOne({
      adminUser: req.user._id
    });

    if (!institution) {
      return res.status(404).json({
        success: false,
        message: 'Institution non trouvée'
      });
    }

    // Vérifier que l'étudiant existe
    const student = await User.findById(req.body.studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Étudiant non trouvé'
      });
    }

    // Créer le diplôme
    const diplomaData = {
      student: student._id,
      institution: institution._id,
      title: req.body.title,
      description: req.body.description,
      field: req.body.field,
      level: req.body.level,
      issueDate: req.body.issueDate,
      expiryDate: req.body.expiryDate,
      grade: req.body.grade,
      gpa: req.body.gpa,
      creditsEarned: req.body.creditsEarned
    };

    // Gérer l'upload de fichier si présent
    if (req.file) {
      try {
        const ipfsFile = await ipfsService.uploadFile(req.file.path, req.file.originalname);
        diplomaData.attachments = [{
          name: req.file.originalname,
          type: req.file.mimetype,
          url: ipfsFile.url,
          ipfsHash: ipfsFile.hash
        }];
        console.log(`✅ Fichier uploadé sur IPFS: ${ipfsFile.hash}`);
      } catch (fileError) {
        console.error('⚠️  Erreur upload fichier IPFS:', fileError.message);
        // On continue sans le fichier ou avec le chemin local
        diplomaData.attachments = [{
          name: req.file.originalname,
          url: `/uploads/diplomas/${req.file.filename}`
        }];
      }
    }

    const diploma = await Diploma.create(diplomaData);

    // Générer le hash blockchain
    diploma.blockchainHash = diploma.generateBlockchainHash();
    await diploma.save();

    // Peupler les références
    await diploma.populate('student', 'firstName lastName email');
    await diploma.populate('institution', 'name email');

    res.status(201).json({
      success: true,
      message: 'Diplôme créé avec succès',
      data: diploma
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir tous les diplômes
// @route   GET /api/diplomas
// @access  Private
const getDiplomas = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 25, 100);
    const { status, level, field, studentId, institutionId } = req.query;

    const query = {};

    // Si l'utilisateur est un étudiant, voir uniquement ses diplômes
    if (req.user.role === 'student') {
      query.student = req.user._id;
    }

    // Si l'utilisateur est une institution, voir uniquement les diplômes de son institution
    if (req.user.role === 'institution') {
      const institution = await Institution.findOne({ adminUser: req.user._id });
      if (institution) {
        query.institution = institution._id;
      }
    }

    // Filtres optionnels
    if (status) query.status = status;
    if (level) query.level = level;
    if (field) query.field = { $regex: field, $options: 'i' };
    if (studentId) query.student = studentId;
    if (institutionId && req.user.role === 'admin') {
      query.institution = institutionId;
    }

    const total = await Diploma.countDocuments(query);
    const diplomas = await Diploma.find(query)
      .populate('student', 'firstName lastName email')
      .populate('institution', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        pagination: { total, page, limit, pages: Math.ceil(total / limit) },
        diplomas
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir un diplôme par ID
// @route   GET /api/diplomas/:id
// @access  Private
const getDiplomaById = async (req, res, next) => {
  try {
    const diploma = await Diploma.findById(req.params.id)
      .populate('student', 'firstName lastName email')
      .populate('institution', 'name email')
      .populate('verifications.verifier', 'firstName lastName email');

    if (!diploma) {
      return res.status(404).json({ success: false, message: 'Diplôme non trouvé' });
    }

    // Vérifier les permissions
    if (req.user.role === 'student' && diploma.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Accès refusé' });
    }

    res.status(200).json({ success: true, data: diploma });
  } catch (error) {
    next(error);
  }
};

// @desc    Vérifier un diplôme par hash blockchain (public)
// @route   GET /api/diplomas/verify/:blockchainHash
// @access  Public
const verifyDiplomaByHash = async (req, res, next) => {
  try {
    const diploma = await Diploma.findByBlockchainHash(req.params.blockchainHash)
      .populate('student', 'firstName lastName')
      .populate('institution', 'name');

    if (!diploma) {
      return res.status(404).json({
        success: false,
        message: 'Diplôme non trouvé',
        verified: false
      });
    }

    if (diploma.status === 'revoked') {
      return res.status(410).json({
        success: false,
        message: 'Ce diplôme a été révoqué',
        verified: false,
        revocationReason: diploma.revocationReason
      });
    }

    // 2. Vérifier sur la blockchain
    let onChainVerified = false;
    try {
      const bcVerification = await blockchainService.verifyDiploma(diploma.blockchainHash);
      onChainVerified = bcVerification.verified;
    } catch (bcError) {
      console.error('Blockchain verification error:', bcError.message);
    }

    res.status(200).json({
      success: true,
      authentique: onChainVerified && diploma.issuedOnBlockchain,
      verified: onChainVerified && diploma.issuedOnBlockchain,
      message: (onChainVerified && diploma.issuedOnBlockchain) ? 'DIPLOME AUTHENTIQUE' : 'DIPLOME NON RECONNU',
      data: {
        certificateNumber: diploma.certificateNumber,
        studentName: `${diploma.student.firstName} ${diploma.student.lastName}`,
        institutionName: diploma.institution.name,
        title: diploma.title,
        field: diploma.field,
        level: diploma.level,
        issueDate: diploma.issueDate,
        grade: diploma.grade,
        blockchainTxHash: diploma.blockchainTxHash,
        blockchainTimestamp: diploma.blockchainTimestamp,
        onChainVerified
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour un diplôme
// @route   PUT /api/diplomas/:id
// @access  Private (institution only)
const updateDiploma = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Erreurs de validation',
        errors: errors.array()
      });
    }

    const diploma = await Diploma.findById(req.params.id);
    if (!diploma) {
      return res.status(404).json({ success: false, message: 'Diplôme non trouvé' });
    }

    // Vérifier les permissions
    const institution = await Institution.findOne({ adminUser: req.user._id });
    if (!institution || institution._id.toString() !== diploma.institution.toString()) {
      return res.status(403).json({ success: false, message: 'Accès refusé' });
    }

    // Vérifier que le diplôme n'est pas déjà émis
    if (diploma.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Impossible de modifier un diplôme qui a déjà été émis'
      });
    }

    // Mettre à jour les champs autorisés
    const allowedFields = ['title', 'description', 'field', 'level', 'issueDate', 'expiryDate', 'grade', 'gpa', 'creditsEarned'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        diploma[field] = req.body[field];
      }
    });

    await diploma.save();

    res.status(200).json({
      success: true,
      message: 'Diplôme mis à jour avec succès',
      data: diploma
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un diplôme
// @route   DELETE /api/diplomas/:id
// @access  Private (institution only)
const deleteDiploma = async (req, res, next) => {
  try {
    const diploma = await Diploma.findById(req.params.id);
    if (!diploma) {
      return res.status(404).json({ success: false, message: 'Diplôme non trouvé' });
    }

    // Vérifier les permissions
    const institution = await Institution.findOne({ adminUser: req.user._id });
    if (!institution || institution._id.toString() !== diploma.institution.toString()) {
      return res.status(403).json({ success: false, message: 'Accès refusé' });
    }

    // Vérifier que le diplôme est en brouillon
    if (diploma.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Impossible de supprimer un diplôme qui a déjà été émis'
      });
    }

    await Diploma.deleteOne({ _id: req.params.id });

    res.status(200).json({ success: true, message: 'Diplôme supprimé avec succès' });

  } catch (error) {
    next(error);
  }
};

// @desc    Révoquer un diplôme
// @route   PUT /api/diplomas/:id/revoke
// @access  Private (institution only)
const revokeDiploma = async (req, res, next) => {
  try {
    const diploma = await Diploma.findById(req.params.id);
    if (!diploma) {
      return res.status(404).json({ success: false, message: 'Diplôme non trouvé' });
    }

    // Vérifier les permissions
    const institution = await Institution.findOne({ adminUser: req.user._id });
    if (!institution || institution._id.toString() !== diploma.institution.toString()) {
      return res.status(403).json({ success: false, message: 'Accès refusé' });
    }

    // Révoquer le diplôme
    await diploma.revoke(req.body.reason || 'Aucune raison spécifiée');

    res.status(200).json({
      success: true,
      message: 'Diplôme révoqué avec succès',
      data: diploma
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDiploma,
  getDiplomas,
  getDiplomaById,
  verifyDiplomaByHash,
  updateDiploma,
  deleteDiploma,
  revokeDiploma
};