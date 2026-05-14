const Institution = require('../models/Institution');
const User = require('../models/User');
const Diploma = require('../models/Diploma');
const { validationResult } = require('express-validator');

const getInstitutions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 25, 100);
    const { search, type, isVerified } = req.query;

    const query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } }
      ];
    }

    if (type) query.type = type;
    if (isVerified === 'true') query.isVerified = true;

    const total = await Institution.countDocuments(query);
    const institutions = await Institution.find(query)
      .select('-blockchainAddress')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        pagination: { total, page, limit, pages: Math.ceil(total / limit) },
        institutions
      }
    });
  } catch (error) {
    next(error);
  }
};

const getInstitutionById = async (req, res, next) => {
  try {
    const institution = await Institution.findById(req.params.id);

    if (!institution) {
      return res.status(404).json({ success: false, message: 'Institution non trouvée' });
    }

    res.status(200).json({ success: true, data: institution });
  } catch (error) {
    next(error);
  }
};

const createInstitution = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Erreurs de validation',
        errors: errors.array()
      });
    }

    // Vérifier si l'institution existe déjà
    const existingInstitution = await Institution.findByEmail(req.body.email);
    if (existingInstitution) {
      return res.status(400).json({
        success: false,
        message: 'Une institution avec cet email existe déjà'
      });
    }

    const institution = await Institution.create({
      name: req.body.name,
      type: req.body.type,
      email: req.body.email,
      phone: req.body.phone,
      website: req.body.website,
      address: req.body.address,
      accreditationNumber: req.body.accreditationNumber,
      description: req.body.description,
      contactPerson: req.body.contactPerson,
      adminUser: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Institution créée avec succès',
      data: institution
    });
  } catch (error) {
    next(error);
  }
};

const updateInstitution = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Erreurs de validation',
        errors: errors.array()
      });
    }

    const institution = await Institution.findById(req.params.id);
    if (!institution) {
      return res.status(404).json({ success: false, message: 'Institution non trouvée' });
    }

    if (institution.adminUser.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Accès refusé' });
    }

    const allowedFields = ['name', 'type', 'phone', 'website', 'logo', 'address', 'description', 'contactPerson'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        institution[field] = req.body[field];
      }
    });

    if (req.user.role === 'admin' && req.body.isVerified !== undefined) {
      institution.isVerified = req.body.isVerified;
      institution.verifiedAt = new Date();
      institution.verifiedBy = req.user._id;
    }

    await institution.save();

    res.status(200).json({
      success: true,
      message: 'Institution mise à jour avec succès',
      data: institution
    });
  } catch (error) {
    next(error);
  }
};

const getInstitutionDiplomas = async (req, res, next) => {
  try {
    const institution = await Institution.findById(req.params.id);
    if (!institution) {
      return res.status(404).json({ success: false, message: 'Institution non trouvée' });
    }

    const diplomas = await Diploma.find({ institution: institution._id })
      .populate('student', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        institution: institution.name,
        diplomasCount: diplomas.length,
        diplomas
      }
    });
  } catch (error) {
    next(error);
  }
};

const getMyInstitution = async (req, res, next) => {
  try {
    const institution = await Institution.findOne({ adminUser: req.user._id });
    if (!institution) {
      return res.status(404).json({ success: false, message: 'Profil institution non trouvé' });
    }
    res.status(200).json({ success: true, data: institution });
  } catch (error) {
    next(error);
  }
};

const updateMyInstitution = async (req, res, next) => {
  try {
    const institution = await Institution.findOne({ adminUser: req.user._id });
    if (!institution) {
      return res.status(404).json({ success: false, message: 'Profil institution non trouvé' });
    }

    const allowedFields = ['name', 'sigle', 'type', 'phone', 'website', 'logo', 'address', 'description', 'contactPerson'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        institution[field] = req.body[field];
      }
    });

    await institution.save();

    res.status(200).json({
      success: true,
      message: 'Profil institution mis à jour avec succès',
      data: institution
    });
  } catch (error) {
    next(error);
  }
};

const uploadLogoInstitution = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Aucun fichier image fourni' });
    }

    const institution = await Institution.findOne({ adminUser: req.user._id });
    if (!institution) {
      return res.status(404).json({ success: false, message: 'Institution non trouvée' });
    }

    // Build the public URL for the uploaded logo
    const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
    const logoUrl = `${backendUrl}/uploads/diplomas/${req.file.filename}`;

    institution.logo = logoUrl;
    await institution.save();

    res.status(200).json({
      success: true,
      message: 'Logo téléchargé avec succès',
      data: { logoUrl }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInstitutions,
  getInstitutionById,
  createInstitution,
  updateInstitution,
  getInstitutionDiplomas,
  getMyInstitution,
  updateMyInstitution,
  uploadLogoInstitution
};