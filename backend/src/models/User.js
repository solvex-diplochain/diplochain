const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez entrer un email valide']
  },
  walletAddress: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true,
    match: [/^0x[a-fA-F0-9]{40}$/, 'Veuillez entrer une adresse Ethereum valide']
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères'],
    select: false // Ne pas inclure dans les requêtes par défaut
  },
  firstName: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true,
    maxlength: [50, 'Le prénom ne peut pas dépasser 50 caractères']
  },
  lastName: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
    maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
  },
  role: {
    type: String,
    enum: {
      values: ['student', 'employer', 'institution', 'admin'],
      message: 'Le rôle doit être: student, employer, institution ou admin'
    },
    default: 'student'
  },
  phoneNumber: {
    type: String,
    trim: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Veuillez entrer un numéro de téléphone valide']
  },
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function(value) {
        // Vérifier que l'utilisateur a au moins 16 ans
        const age = new Date().getFullYear() - value.getFullYear();
        return age >= 16;
      },
      message: 'L\'utilisateur doit avoir au moins 16 ans'
    }
  },
  profilePicture: {
    type: String, // URL de l'image
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  // Champs spécifiques selon le rôle
  studentProfile: {
    studentId: String,
    institution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institution'
    },
    graduationYear: Number,
    gpa: {
      type: Number,
      min: 0,
      max: 4
    },
    major: String,
    skills: [String],
    linkedinProfile: String,
    portfolioUrl: String
  },
  employerProfile: {
    companyName: String,
    companySize: {
      type: String,
      enum: ['startup', 'small', 'medium', 'large', 'enterprise']
    },
    industry: String,
    website: String,
    location: String,
    jobTitle: String
  },
  institutionProfile: {
    institutionName: String,
    institutionType: {
      type: String,
      enum: ['university', 'college', 'institute', 'academy']
    },
    accreditationNumber: String,
    website: String,
    location: {
      address: String,
      city: String,
      country: String,
      postalCode: String
    },
    contactPerson: {
      name: String,
      email: String,
      phone: String
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour les performances
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'studentProfile.institution': 1 });
userSchema.index({ createdAt: -1 });

// Virtual pour le nom complet
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual pour l'âge
userSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  return new Date().getFullYear() - this.dateOfBirth.getFullYear();
});

// Middleware pour hasher le mot de passe avant la sauvegarde
userSchema.pre('save', async function(next) {
  // Ne hasher que si le mot de passe a été modifié
  if (!this.isModified('password')) return next();

  try {
    // Hasher le mot de passe avec un coût de 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour vérifier le mot de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour vérifier si le compte est verrouillé
userSchema.methods.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Méthode pour incrémenter les tentatives de connexion
userSchema.methods.incLoginAttempts = function() {
  // Si le compte est déjà verrouillé, ne pas incrémenter
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };

  // Verrouiller le compte après 5 tentatives
  if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.$set = {
      lockUntil: Date.now() + 2 * 60 * 60 * 1000 // 2 heures
    };
  }

  return this.updateOne(updates);
};

// Méthode pour réinitialiser les tentatives de connexion
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
    $set: { lastLogin: new Date() }
  });
};

// Méthode pour générer un token de réinitialisation de mot de passe
userSchema.methods.generatePasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

// Méthode pour générer un token de vérification d'email
userSchema.methods.generateEmailVerificationToken = function() {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 heures
  return verificationToken;
};

// Méthode statique pour trouver un utilisateur par email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Middleware post-save pour gérer les erreurs de duplication
userSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Un utilisateur avec cet email existe déjà'));
  } else {
    next(error);
  }
});

module.exports = mongoose.model('User', userSchema);