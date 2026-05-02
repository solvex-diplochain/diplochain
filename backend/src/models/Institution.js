const mongoose = require('mongoose');

const institutionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom de l\'institution est requis'],
    trim: true,
    unique: true,
    maxlength: [150, 'Le nom ne peut pas dépasser 150 caractères']
  },
  type: {
    type: String,
    enum: {
      values: ['university', 'college', 'institute', 'academy', 'training-center'],
      message: 'Type d\'institution invalide'
    },
    default: 'university'
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Numéro de téléphone invalide']
  },
  website: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.*/, 'URL du site web invalide']
  },
  logo: {
    type: String, // URL du logo
    default: null
  },
  // Adresse
  address: {
    street: String,
    city: String,
    country: String,
    postalCode: String
  },
  // Informations de l'institution
  accreditationNumber: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  accreditationExpiry: {
    type: Date,
    default: null
  },
  description: {
    type: String,
    maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères']
  },
  // Contact
  contactPerson: {
    name: String,
    title: String,
    email: String,
    phone: String
  },
  // Blockchain
  blockchainAddress: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  blockchainDeployed: {
    type: Boolean,
    default: false
  },
  // Admin user
  adminUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Statut
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedAt: {
    type: Date,
    default: null
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Statistiques
  totalDiplomas: {
    type: Number,
    default: 0
  },
  totalStudents: {
    type: Number,
    default: 0
  },
  metadata: mongoose.Schema.Types.Mixed
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour les performances
institutionSchema.index({ name: 1 });
institutionSchema.index({ email: 1 });
institutionSchema.index({ blockchainAddress: 1 });
institutionSchema.index({ isActive: 1 });
institutionSchema.index({ createdAt: -1 });

// Middleware pour vérifier l'accréditation
institutionSchema.virtual('isAccreditationValid').get(function() {
  if (!this.accreditationExpiry) return true;
  return this.accreditationExpiry > new Date();
});

// Méthode statique pour trouver par email
institutionSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Méthode statique pour trouver par adresse blockchain
institutionSchema.statics.findByBlockchainAddress = function(address) {
  return this.findOne({ blockchainAddress: address.toLowerCase() });
};

// Méthode pour marquer comme déployée sur la blockchain
institutionSchema.methods.markBlockchainDeployed = function(address) {
  this.blockchainAddress = address;
  this.blockchainDeployed = true;
  return this.save();
};

module.exports = mongoose.model('Institution', institutionSchema);