const User = require('../models/User');
const { validationResult } = require('express-validator');

const getEmployers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 25, 100);
    const { search, industry } = req.query;

    const query = { role: 'employer', isActive: true };

    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { 'employerProfile.companyName': { $regex: search, $options: 'i' } },
        { 'employerProfile.industry': { $regex: search, $options: 'i' } }
      ];
    }

    if (industry) {
      query['employerProfile.industry'] = industry;
    }

    const total = await User.countDocuments(query);
    const employers = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        pagination: { total, page, limit, pages: Math.ceil(total / limit) },
        employers
      }
    });
  } catch (error) {
    next(error);
  }
};

const getEmployerById = async (req, res, next) => {
  try {
    const employer = await User.findById(req.params.id)
      .where('role').equals('employer')
      .select('-password');

    if (!employer) {
      return res.status(404).json({ success: false, message: 'Employeur non trouvé' });
    }

    res.status(200).json({ success: true, data: employer });
  } catch (error) {
    next(error);
  }
};

const updateEmployerProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Erreurs de validation',
        errors: errors.array()
      });
    }

    const employer = await User.findById(req.params.id);
    if (!employer || employer.role !== 'employer') {
      return res.status(404).json({ success: false, message: 'Employeur non trouvé' });
    }

    if (employer._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Accès refusé' });
    }

    // Mettre à jour le profil employeur
    if (req.body.employerProfile) {
      employer.employerProfile = {
        ...employer.employerProfile,
        ...req.body.employerProfile
      };
    }

    // Mettre à jour les champs généraux
    const allowedFields = ['firstName', 'lastName', 'phoneNumber', 'profilePicture'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        employer[field] = req.body[field];
      }
    });

    await employer.save();

    res.status(200).json({
      success: true,
      message: 'Profil employeur mis à jour avec succès',
      data: employer
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmployers,
  getEmployerById,
  updateEmployerProfile
};