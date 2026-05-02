const mongoose = require('mongoose');
const crypto = require('crypto');

const diplomaSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'étudiant est requis']
  },
  institution: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    required: [true, 'L\'institution est requise']
  },
  title: {
    type: String,
    required: [true, 'Le titre du diplôme est requis'],
    trim: true,
    maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères']
  },
  field: {
    type: String,
    required: [true, 'Le domaine d\'études est requis'],
    trim: true
  },
  level: {
    type: String,
    enum: {
      values: ['bachelor', 'master', 'phd', 'diploma', 'certificate'],
      message: 'Niveau invalide: bachelor, master, phd, diploma ou certificate'
    },
    default: 'bachelor'
  },
  issueDate: {
    type: Date,
    required: [true, 'La date de délivrance est requise']
  },
  expiryDate: {
    type: Date,
    default: null
  },
  grade: {
    type: String,
    enum: {
      values: ['distinction', 'merit', 'pass', 'fail'],
      message: 'Note invalide'
    },
    default: 'pass'
  },
  gpa: {
    type: Number,
    min: 0,
    max: 4
  },
  creditsEarned: {
    type: Number,
    min: 0
  },
  certificateNumber: {
    type: String,
    unique: true,
    trim: true
  },
  // Blockchain
  blockchainHash: {
    type: String,
    default: null,
    index: true
  },
  blockchainTxHash: {
    type: String,
    default: null
  },
  blockchainAddress: {
    type: String,
    default: null
  },
  issuedOnBlockchain: {
    type: Boolean,
    default: false
  },
  blockchainTimestamp: {
    type: Date,
    default: null
  },
  // Statut
  status: {
    type: String,
    enum: {
      values: ['draft', 'issued', 'verified', 'revoked'],
      message: 'Statut invalide'
    },
    default: 'draft'
  },
  verificationUrl: {
    type: String,
    default: null
  },
  revokedAt: {
    type: Date,
    default: null
  },
  revocationReason: {
    type: String,
    default: null
  },
  // Pièces jointes
  attachments: [{
    type: String, // URL du fichier
    name: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  // Vérifications
  verifications: [{
    verifier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedAt: Date,
    notes: String
  }],
  metadata: mongoose.Schema.Types.Mixed
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour les performances
diplomaSchema.index({ student: 1, institution: 1 });
diplomaSchema.index({ certificateNumber: 1 });
diplomaSchema.index({ blockchainHash: 1 });
diplomaSchema.index({ status: 1 });
diplomaSchema.index({ createdAt: -1 });

// Virtual pour l'URL de vérification
diplomaSchema.virtual('shareableLink').get(function() {
  return `${process.env.FRONTEND_URL}/verify/${this.blockchainHash}`;
});

// Middleware pre-save pour générer certificateNumber
diplomaSchema.pre('save', async function(next) {
  if (!this.certificateNumber) {
    const timestamp = Date.now();
    const randomStr = crypto.randomBytes(4).toString('hex').toUpperCase();
    this.certificateNumber = `DIPL-${timestamp}-${randomStr}`;
  }
  next();
});

// Méthode pour générer un hash blockchain
diplomaSchema.methods.generateBlockchainHash = function() {
  const data = `${this._id}${this.certificateNumber}${this.issueDate.getTime()}`;
  return '0x' + crypto.createHash('sha256').update(data).digest('hex');
};

// Méthode pour marquer comme émis sur la blockchain
diplomaSchema.methods.markAsBlockchainIssued = function(txHash, address) {
  this.issuedOnBlockchain = true;
  this.blockchainTxHash = txHash;
  this.blockchainAddress = address;
  this.blockchainTimestamp = new Date();
  this.status = 'verified';
  return this.save();
};

// Méthode pour révoquer un diplôme
diplomaSchema.methods.revoke = function(reason) {
  this.status = 'revoked';
  this.revokedAt = new Date();
  this.revocationReason = reason;
  return this.save();
};

// Méthode statique pour trouver par hash blockchain
diplomaSchema.statics.findByBlockchainHash = function(hash) {
  return this.findOne({ blockchainHash: hash });
};

// Méthode statique pour trouver par certificateNumber
diplomaSchema.statics.findByCertificateNumber = function(number) {
  return this.findOne({ certificateNumber: number });
};

module.exports = mongoose.model('Diploma', diplomaSchema);