# 🔧 Backend DiploChain — Skill Documentation

**Développeur** : Sawadogo Daouda  
**Module** : Backend (Node.js + Express)  
**Date** : 1er Mai 2026

---

## 📋 À propos de ce skill

Ce fichier documente le **backend DiploChain**, l'API centrale qui :
- Gère l'authentification des utilisateurs
- Persiste les données des diplômes
- Intègre la blockchain Ethereum/Polygon
- Sert le frontend web et mobile

**Durée Phase 2** : 8 semaines  
**Effort estimé** : 45 jours/homme  
**Tech stack** : Node.js + Express + MongoDB + Web3.js

---

## 🚀 Quick Start (5 minutes)

```bash
cd backend

# 1. Installer les dépendances
npm install

# 2. Créer le fichier .env
cp .env.example .env
# Éditer .env avec vos valeurs

# 3. Démarrer le serveur
npm start

# Server devrait être disponible sur http://localhost:5000
```

**Prêt en 5 min !**

---

## 📚 Structure du backend

```
backend/
├── src/
│   ├── server.js                 # Point d'entrée
│   ├── config/
│   │   ├── database.js          # MongoDB config
│   │   ├── web3.js              # Blockchain config
│   │   └── constants.js         # Constantes
│   ├── models/
│   │   ├── User.js              # Schéma utilisateur
│   │   ├── Diploma.js           # Schéma diplôme
│   │   └── Institution.js       # Schéma établissement
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   ├── userController.js    # User logic
│   │   ├── diplomaController.js # Diploma logic
│   │   └── verifyController.js  # Verification logic
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── userRoutes.js        # User endpoints
│   │   ├── diplomaRoutes.js     # Diploma endpoints
│   │   └── verifyRoutes.js      # Verification endpoints
│   ├── middleware/
│   │   ├── auth.js              # JWT middleware
│   │   ├── errorHandler.js      # Error handling
│   │   └── validation.js        # Input validation
│   ├── services/
│   │   ├── authService.js       # Auth logic métier
│   │   ├── diplomaService.js    # Diploma logic métier
│   │   └── blockchainService.js # Blockchain integration
│   ├── utils/
│   │   ├── logger.js            # Logging
│   │   ├── helpers.js           # Helper functions
│   │   └── crypto.js            # Cryptography
│   └── blockchain/
│       ├── contracts.json       # ABI des contrats
│       ├── web3.js              # Web3 setup
│       └── deployer.js          # Deploy utilities
├── tests/
│   ├── unit/
│   │   ├── models.test.js
│   │   ├── services.test.js
│   │   └── utils.test.js
│   └── integration/
│       ├── auth.test.js
│       ├── diploma.test.js
│       └── blockchain.test.js
├── docs/
│   ├── API.md                   # API documentation
│   ├── ARCHITECTURE.md          # Architecture design
│   └── DEPLOYMENT.md            # Deployment guide
├── .env.example                 # Environment template
├── .eslintrc.json              # Linter config
├── package.json                # Dependencies
├── nodemon.json                # Dev server config
└── README.md                   # Backend README
```

---

## 🎯 Tâches par semaine

### **Semaine 1-2 : Setup & Authentification**

**Objectif** : Backend qui tourne avec auth fonctionnelle

#### Checklist
- [ ] `npm install` complète
- [ ] MongoDB connectée (local ou Atlas)
- [ ] Server démarre sur port 5000
- [ ] `.env` configuré
- [ ] Middleware CORS OK
- [ ] Modèle User créé
- [ ] Login endpoint (`POST /api/auth/login`)
- [ ] Register endpoint (`POST /api/auth/register`)
- [ ] JWT tokens fonctionnels
- [ ] Protected routes OK
- [ ] Tests d'auth écrits
- [ ] Swagger docs générée

**Dépendances clés** :
```json
{
  "express": "^4.18",
  "mongoose": "^7.0",
  "jsonwebtoken": "^9.0",
  "bcryptjs": "^2.4",
  "dotenv": "^16.0",
  "cors": "^2.8"
}
```

**Fichiers à créer** :
- `src/server.js` - Express server
- `src/config/database.js` - MongoDB
- `src/models/User.js` - User model
- `src/controllers/authController.js` - Auth logic
- `src/routes/authRoutes.js` - Auth endpoints
- `src/middleware/auth.js` - JWT verification

**Endpoints à implémenter** :
```
POST /api/auth/register    # Register user
POST /api/auth/login       # Login user
POST /api/auth/logout      # Logout user
GET  /api/auth/me          # Get current user
```

**Tests d'acceptation** :
```javascript
✓ User can register avec email/password
✓ User can login avec credentials valides
✓ JWT token retourné lors du login
✓ Protected routes retournent 401 sans token
✓ Token expiré retourne 401
```

---

### **Semaine 3-4 : Gestion des utilisateurs & diplômes**

**Objectif** : CRUD complet users et diplômes

#### Checklist
- [ ] User model complété (profil, role, etc.)
- [ ] Diploma model créé
- [ ] Institution model créé
- [ ] User CRUD endpoints
- [ ] Diploma CRUD endpoints
- [ ] Permissions par rôle (étudiant/employeur/admin)
- [ ] Upload de documents
- [ ] Storage (local ou S3)
- [ ] Tests CRUD écrits
- [ ] Error handling complet

**Modèles Mongoose** :
```javascript
// User
{
  email, password, firstName, lastName, role,
  institution, phone, address, createdAt, updatedAt
}

// Diploma
{
  title, diplomaNumber, issuedAt, issuedBy (Institution),
  student (User), status, blockchainHash, fileUrl,
  createdAt, updatedAt
}

// Institution
{
  name, code, address, contactEmail, verified,
  createdAt, updatedAt
}
```

**Endpoints à implémenter** :
```
# Users
GET    /api/users/profile         # My profile
PUT    /api/users/profile         # Update profile
GET    /api/users/:id             # Get user
DELETE /api/users/:id             # Delete account

# Diplomas
GET    /api/diplomas              # List my diplomas
POST   /api/diplomas              # Create diploma
GET    /api/diplomas/:id          # Get diploma
PUT    /api/diplomas/:id          # Update diploma
DELETE /api/diplomas/:id          # Delete diploma
```

**Permissions** :
```
- Étudiant : Voir ses propres diplômes
- Employeur : Vérifier les diplômes (lecture seulement)
- Institution : Émettre les diplômes
- Admin : Accès total
```

**Tests d'acceptation** :
```
✓ User peut accéder à son profil
✓ User peut mettre à jour son profil
✓ Institution peut créer un diplôme
✓ Étudiant peut voir ses diplômes
✓ Employeur ne peut pas modifier les diplômes
✓ Diplôme créé a un hash blockchain vide
```

---

### **Semaine 5-6 : Intégration Blockchain**

**Objectif** : API complètement intégrée à la blockchain

#### Checklist
- [ ] Web3.js configuré
- [ ] Smart contract ABI importé
- [ ] DiplomaIssuer contract connecté
- [ ] DiplomaVerifier contract connecté
- [ ] Endpoint d'émission (`POST /api/diplomas/:id/issue`)
- [ ] Endpoint de vérification (`POST /api/verify`)
- [ ] Transaction tracking
- [ ] Gas estimation
- [ ] Error handling blockchain
- [ ] Tests blockchain écrits
- [ ] Testnet config (Sepolia/Mumbai)

**Configuration Web3** :
```javascript
// web3.js
const Web3 = require('web3');
const web3 = new Web3(process.env.WEB3_PROVIDER);

// Connecter les contrats
const issuerContract = new web3.eth.Contract(
  ISSUER_ABI,
  process.env.CONTRACT_ISSUER_ADDRESS
);

const verifierContract = new web3.eth.Contract(
  VERIFIER_ABI,
  process.env.CONTRACT_VERIFIER_ADDRESS
);
```

**Endpoints blockchain** :
```
POST /api/diplomas/:id/issue      # Issue diploma on blockchain
GET  /api/diplomas/:id/status     # Get blockchain status
POST /api/verify                  # Verify diploma on chain
GET  /api/verify/:id              # Get verification result
```

**Flux d'émission** :
```
1. User crée diploma → MongoDB stored
2. Admin clique "Issue" 
3. Call smart contract DiplomaIssuer
4. Transaction signed (backend wallet)
5. Hash stocké dans MongoDB
6. Événement blockchain écouté
7. Statut mis à jour en "Verified"
```

**Flux de vérification** :
```
1. User appelle /api/verify?diplomaHash=0x...
2. Backend appelle DiplomaVerifier.verify()
3. Contrat retourne true/false
4. Backend retourne résultat
5. Vérification complète en <1s
```

**Tests d'acceptation** :
```
✓ Diplôme peut être émis sur blockchain
✓ Transaction hash sauvegardé en DB
✓ Statut changé à "Verified" après emission
✓ Diplôme peut être vérifié en <1s
✓ Faux diplôme retourne false
✓ Erreur gas handled gracefully
```

**Variables .env requises** :
```
WEB3_PROVIDER=https://sepolia.infura.io/v3/YOUR_KEY
CONTRACT_ISSUER_ADDRESS=0x...
CONTRACT_VERIFIER_ADDRESS=0x...
DEPLOYER_PRIVATE_KEY=0x...
```

---

### **Semaine 7 : Tests & Optimisation**

**Objectif** : API robuste avec couverture de tests >80%

#### Checklist
- [ ] 80%+ test coverage
- [ ] All tests passing
- [ ] Stress tests (1000 req/sec)
- [ ] Latency <200ms average
- [ ] Connection pooling optimisé
- [ ] Query indexes créés
- [ ] Caching implémenté
- [ ] Rate limiting on endpoints
- [ ] Logging structuré
- [ ] Error messages clairs
- [ ] API docs Swagger générée
- [ ] Performance monitoring setup

**Testing stack** :
```json
{
  "jest": "^29.0",
  "supertest": "^6.3",
  "mongodb-memory-server": "^8.0",
  "sinon": "^15.0"
}
```

**Commandes de test** :
```bash
# Tous les tests
npm test

# Avec coverage
npm test -- --coverage

# Tests spécifiques
npm test -- auth.test.js

# Watch mode
npm test -- --watch

# Integration tests
npm run test:integration
```

**Cibles de couverture** :
```
Controllers:   >80%
Services:      >85%
Models:        >80%
Utils:         >90%
Middleware:    >75%
```

**Performance targets** :
```
Login:         <100ms
Get diploma:   <50ms
Verify:        <1000ms (blockchain)
List diplomas: <200ms
Update:        <100ms
```

**Swagger documentation** :
```bash
# Générer automatiquement
npm run docs

# Accéder sur http://localhost:5000/api-docs
```

---

### **Semaine 8 : Déploiement**

**Objectif** : Backend déployé en production mainnet

#### Checklist
- [ ] Docker image buildée
- [ ] Heroku/Railway account prêt
- [ ] Production `.env` configuré
- [ ] MongoDB Atlas cluster créé
- [ ] Infura mainnet key prêt
- [ ] Smart contracts déployées sur mainnet
- [ ] Health check endpoint
- [ ] Monitoring setup (PM2/New Relic)
- [ ] Logs centralisées
- [ ] Backup strategy en place
- [ ] CI/CD pipeline prêt
- [ ] Deployment successful

**Docker setup** :
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src
EXPOSE 5000
CMD ["npm", "start"]
```

**Deployment checklist** :
```
✓ All env vars set correctly
✓ Database migrations ran
✓ Smart contracts verified on Etherscan
✓ Health checks returning 200
✓ Logs properly configured
✓ Monitoring alerts active
✓ Backup running
✓ Team trained on ops
```

---

## 📝 Fichiers clés

### `server.js` — Point d'entrée
```javascript
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/diplomas', require('./routes/diplomaRoutes'));
app.use('/api/verify', require('./routes/verifyRoutes'));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
```

### `config/database.js` — MongoDB connection
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### `models/User.js` — User schema
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  role: { type: String, enum: ['student', 'employer', 'institution', 'admin'] },
  institution: mongoose.Schema.Types.ObjectId,
  createdAt: { type: Date, default: Date.now }
});

// Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);
```

### `middleware/auth.js` — JWT verification
```javascript
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

---

## 🔑 Variables d'environnement

**`.env` template** :
```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/diplochain
MONGODB_USER=admin
MONGODB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d

# Blockchain
WEB3_PROVIDER=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
CONTRACT_ISSUER_ADDRESS=0x...
CONTRACT_VERIFIER_ADDRESS=0x...
DEPLOYER_PRIVATE_KEY=0x...

# Frontend
FRONTEND_URL=http://localhost:5173
MOBILE_URL=https://app.diplochain.bf

# Logging
LOG_LEVEL=debug
```

---

## 📊 Commandes npm

```bash
# Development
npm start              # Démarrer avec nodemon
npm run dev            # Alias pour start

# Testing
npm test               # Jest tests
npm test -- --coverage # Avec coverage report
npm run test:unit      # Tests unitaires
npm run test:integration # Tests intégration

# Code quality
npm run lint           # ESLint
npm run lint:fix       # Auto-fix

# Documentation
npm run docs           # Générer Swagger docs

# Build & Deploy
npm run build          # Build for production
npm run docker:build   # Build Docker image
npm run docker:run     # Run Docker container
```

---

## 🧪 Testing

### Unit tests (Jest)

```bash
npm run test:unit

# Structure
tests/unit/
├── models.test.js       # Test schemas
├── services.test.js     # Test business logic
└── utils.test.js        # Test utilities
```

### Integration tests

```bash
npm run test:integration

# Structure
tests/integration/
├── auth.test.js         # Test auth flow
├── diploma.test.js      # Test diploma flow
└── blockchain.test.js   # Test blockchain integration
```

### Example test

```javascript
describe('Auth Service', () => {
  it('should hash password', async () => {
    const password = 'test123';
    const hashed = await hashPassword(password);
    const match = await bcrypt.compare(password, hashed);
    expect(match).toBe(true);
  });
});
```

---

## 🔗 Intégrations

### Avec le Frontend
- API docs: http://localhost:5000/api-docs
- CORS: Configuré pour `http://localhost:5173`
- Token storage: localStorage (frontend)

### Avec la Blockchain
- Web3.js: Connecté à Sepolia testnet
- Contrats: DiplomaIssuer + DiplomaVerifier
- Gas: Estimation automatique

### Avec MongoDB
- Atlas ou local
- Indexes créés sur email, diplomaNumber
- Backup configuré

---

## 🚨 Troubleshooting

### Port 5000 en utilisation
```bash
# Windows
netstat -ano | findstr :5000

# macOS/Linux
lsof -i :5000

# Changer le port
PORT=5001 npm start
```

### MongoDB connection error
```bash
# Vérifier si MongoDB tourne
# Windows: Services → MongoDB
# macOS: brew services list
# Linux: sudo systemctl status mongod

# Ou utiliser MongoDB Atlas
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
```

### JWT token error
```bash
# Vérifier le token dans Authorization header
Authorization: Bearer <token_here>

# Vérifier JWT_SECRET dans .env
echo $JWT_SECRET
```

---

## 📚 Ressources

### Documentation
- [Express.js](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [Web3.js](https://web3js.readthedocs.io/)
- [Jest](https://jestjs.io/)
- [JWT](https://jwt.io/)

### Tutoriels
- Node.js backend: https://www.youtube.com/watch?v=fsCjFHuV1D0
- REST API: https://restfulapi.net/
- Testing: https://www.youtube.com/watch?v=7r4xVZIrXQ8

### Tools
- Postman: https://postman.com/
- MongoDB Compass: https://www.mongodb.com/products/compass
- Remix IDE: https://remix.ethereum.org/

---

## ✅ Checklist de validation

Avant de merger une PR :

- [ ] Code follows ESLint rules
- [ ] All tests pass (`npm test`)
- [ ] Coverage >80%
- [ ] No console.logs
- [ ] Error handling implemented
- [ ] API docs updated
- [ ] `.env.example` updated
- [ ] No hardcoded secrets
- [ ] Code reviewed by Marc
- [ ] Commandes git propres

---

## 🎯 Success criteria

### Semaine 1-2
✓ Server tourne, auth fonctionnelle

### Semaine 3-4
✓ CRUD users et diplômes OK

### Semaine 5-6
✓ Blockchain intégration complète

### Semaine 7
✓ 80%+ test coverage, docs OK

### Semaine 8
✓ Deployé en production mainnet

---

## 📞 Support

**Questions techniques** → Slack #backend  
**Code reviews** → DM à Marc  
**Blockers** → Marc urgently

---

**Happy coding ! 🚀**

