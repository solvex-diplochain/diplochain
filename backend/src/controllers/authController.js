const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Générer un token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @desc    Inscription d'un nouvel utilisateur
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Erreurs de validation',
        errors: errors.array()
      });
    }

    const { email, password, firstName, lastName, role, phoneNumber, dateOfBirth } = req.body;

    // Empêcher l'inscription en tant qu'admin via l'API publique
    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'L\'inscription en tant qu\'administrateur est interdite via ce canal.'
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findByEmail(email);
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà'
      });
    }

    // Créer l'utilisateur
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: role || 'student',
      phoneNumber,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined
    });

    // Si c'est une institution, créer le profil d'institution par défaut
    if (user.role === 'institution') {
      try {
        await Institution.create({
          name: `${firstName} ${lastName}`,
          email: email,
          adminUser: user._id,
          isActive: true,
          isVerified: true // On l'active par défaut pour le hackathon
        });
        console.log(`✅ Profil institution créé pour ${email}`);
      } catch (instError) {
        console.error(' Erreur création profil institution:', instError.message);
      }
    }

    // Générer le token
    const token = generateToken(user._id);

    // Réponse avec le token et les infos utilisateur (sans mot de passe)
    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          phoneNumber: user.phoneNumber,
          dateOfBirth: user.dateOfBirth,
          isActive: user.isActive,
          isEmailVerified: user.isEmailVerified,
          createdAt: user.createdAt
        },
        token
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Connexion d'un utilisateur
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Erreurs de validation',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe et inclure le mot de passe
    const user = await User.findByEmail(email).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier si le compte est verrouillé
    if (user.isLocked()) {
      return res.status(423).json({
        success: false,
        message: 'Compte temporairement verrouillé en raison de trop nombreuses tentatives de connexion'
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      // Incrémenter les tentatives de connexion
      await user.incLoginAttempts();
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier si le compte est actif
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Compte désactivé'
      });
    }

    // Réinitialiser les tentatives de connexion et mettre à jour la dernière connexion
    await user.resetLoginAttempts();

    // Générer le token
    const token = generateToken(user._id);

    // Réponse avec le token et les infos utilisateur
    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          phoneNumber: user.phoneNumber,
          dateOfBirth: user.dateOfBirth,
          isActive: user.isActive,
          isEmailVerified: user.isEmailVerified,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        },
        token
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir le profil de l'utilisateur connecté
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          phoneNumber: user.phoneNumber,
          dateOfBirth: user.dateOfBirth,
          profilePicture: user.profilePicture,
          isActive: user.isActive,
          isEmailVerified: user.isEmailVerified,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          // Inclure les profils spécifiques selon le rôle
          ...(user.role === 'student' && { studentProfile: user.studentProfile }),
          ...(user.role === 'employer' && { employerProfile: user.employerProfile }),
          ...(user.role === 'institution' && { institutionProfile: user.institutionProfile })
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour le profil de l'utilisateur
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Erreurs de validation',
        errors: errors.array()
      });
    }

    const { firstName, lastName, phoneNumber, dateOfBirth, profilePicture } = req.body;

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth);
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture;

    // Ajouter les données spécifiques au rôle si elles sont fournies
    if (req.user.role === 'student' && req.body.studentProfile) {
      updateData.studentProfile = { ...req.user.studentProfile, ...req.body.studentProfile };
    }

    if (req.user.role === 'employer' && req.body.employerProfile) {
      updateData.employerProfile = { ...req.user.employerProfile, ...req.body.employerProfile };
    }

    if (req.user.role === 'institution' && req.body.institutionProfile) {
      updateData.institutionProfile = { ...req.user.institutionProfile, ...req.body.institutionProfile };
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          phoneNumber: user.phoneNumber,
          dateOfBirth: user.dateOfBirth,
          profilePicture: user.profilePicture,
          isActive: user.isActive,
          isEmailVerified: user.isEmailVerified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          // Inclure les profils spécifiques selon le rôle
          ...(user.role === 'student' && { studentProfile: user.studentProfile }),
          ...(user.role === 'employer' && { employerProfile: user.employerProfile }),
          ...(user.role === 'institution' && { institutionProfile: user.institutionProfile })
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Changer le mot de passe
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Erreurs de validation',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Récupérer l'utilisateur avec le mot de passe
    const user = await User.findById(req.user._id).select('+password');

    // Vérifier le mot de passe actuel
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Mot de passe actuel incorrect'
      });
    }

    // Mettre à jour le mot de passe
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Mot de passe changé avec succès'
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Déconnexion (côté serveur, le token reste valide)
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
  try {
    // Ici, on pourrait ajouter le token à une liste noire
    // Pour l'instant, on se contente de répondre positivement
    // Le frontend doit supprimer le token côté client

    res.status(200).json({
      success: true,
      message: 'Déconnexion réussie'
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Demander la réinitialisation du mot de passe
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Erreurs de validation',
        errors: errors.array()
      });
    }

    const { email } = req.body;
    const user = await User.findByEmail(email);

    if (!user) {
      // Ne pas révéler si l'email existe ou non pour des raisons de sécurité
      return res.status(200).json({
        success: true,
        message: 'Si cet email existe, un lien de réinitialisation a été envoyé'
      });
    }

    // Générer le token de réinitialisation
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // TODO: Envoyer l'email avec le token de réinitialisation
    // Pour l'instant, on retourne le token dans la réponse (uniquement en développement)
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    res.status(200).json({
      success: true,
      message: 'Lien de réinitialisation envoyé',
      ...(process.env.NODE_ENV === 'development' && { resetUrl, resetToken })
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Réinitialiser le mot de passe
// @route   PUT /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Erreurs de validation',
        errors: errors.array()
      });
    }

    const { token } = req.params;
    const { password } = req.body;

    // Hasher le token pour le comparer avec celui en base
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: resetPasswordToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token invalide ou expiré'
      });
    }

    // Mettre à jour le mot de passe
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès'
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Vérifier l'email
// @route   POST /api/auth/verify-email/:token
// @access  Public
const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    // Hasher le token pour le comparer avec celui en base
    const emailVerificationToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      emailVerificationToken,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token de vérification invalide ou expiré'
      });
    }

    // Marquer l'email comme vérifié
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email vérifié avec succès'
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail
};