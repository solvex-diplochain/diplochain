# 🔧 DiploChain — Backend API

**API REST Node.js pour la plateforme blockchain de vérification des diplômes**

---

## 📖 Vue d'ensemble

Le backend DiploChain est une API Express.js qui :
- ✅ Gère l'authentification JWT des utilisateurs
- ✅ Persiste les données des diplômes dans MongoDB
- ✅ Intègre la blockchain Ethereum/Polygon via Web3.js
- ✅ Sert les requêtes du frontend web et mobile
- ✅ Offre les endpoints de vérification de diplômes

**Stack** : Node.js 18+ | Express 4 | MongoDB 6+ | Web3.js 1.10+

---

## 🚀 Quick Start

### Prérequis
- Node.js 18+ ([télécharger](https://nodejs.org/))
- MongoDB ([local](https://docs.mongodb.com/manual/installation/) ou [Atlas](https://www.mongodb.com/cloud/atlas))
- npm ou yarn

### Installation (5 minutes)

```bash
# 1. Cloner et accéder au dossier
cd backend

# 2. Installer les dépendances
npm install

# 3. Créer le fichier de configuration
cp .env.example .env
# Éditer .env avec vos valeurs
```

### Démarrer MongoDB localement

Option 1 — si MongoDB est installé localement :
```bash
mongod --dbpath ./data/db
```

Option 2 — via Docker Compose :
```bash
docker compose up -d
```

### Démarrer le serveur

```bash
npm start
```

# ✅ Le serveur tourne sur http://localhost:5000

### Exécution sans MongoDB local

Si vous ne souhaitez pas installer MongoDB localement, activez la base de données en mémoire :

```bash
USE_IN_MEMORY_DB=true npm start
```

### Vérifier que ça marche
```bash
curl http://localhost:5000/api/health
# { "status": "OK", "timestamp": "...", "uptime": ..., "environment": "development" }
```

> Si `npm start` échoue avec `connect ECONNREFUSED`, vérifiez que MongoDB est démarré sur le port `27017` ou mettez à jour `MONGODB_URI` dans `.env`.


---

## 📁 Structure du projet

```
backend/
├── src/
│   ├── server.js                    # Point d'entrée Express
│   ├── config/
│   │   ├── database.js              # Connection MongoDB
│   │   ├── web3.js                  # Setup Ethereum/Polygon
│   │   └── constants.js             # Constantes du projet
│   ├── models/
│   │   ├── User.js                  # Schéma utilisateur
│   │   ├── Diploma.js               # Schéma diplôme
│   │   └── Institution.js           # Schéma établissement
│   ├── controllers/
│   │   ├── authController.js        # Logique authentification
│   │   ├── userController.js        # Logique utilisateur
│   │   ├── diplomaController.js     # Logique diplôme
│   │   └── verifyController.js      # Logique vérification
│   ├── routes/
│   │   ├── authRoutes.js            # Routes authentification
│   │   ├── userRoutes.js            # Routes utilisateur
│   │   ├── diplomaRoutes.js         # Routes diplôme
│   │   └── verifyRoutes.js          # Routes vérification
│   ├── middleware/
│   │   ├── auth.js                  # Vérification JWT
│   │   ├── errorHandler.js          # Gestion des erreurs
│   │   ├── validation.js            # Validation des inputs
│   │   └── cors.js                  # Configuration CORS
│   ├── services/
│   │   ├── authService.js           # Service authentification
│   │   ├── diplomaService.js        # Service diplôme
│   │   ├── blockchainService.js     # Service blockchain
│   │   └── emailService.js          # Service email
│   ├── utils/
│   │   ├── logger.js                # Logging structuré
│   │   ├── helpers.js               # Fonctions utiles
│   │   └── crypto.js                # Utilitaires crypto
│   └── blockchain/
│       ├── contracts.json           # ABI des contrats
│       ├── web3.js                  # Initialisation Web3
│       └── deployer.js              # Utilitaires déploiement
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
│   ├── API.md                       # Documentation API
│   ├── ARCHITECTURE.md              # Design architecture
│   └── DEPLOYMENT.md                # Guide déploiement
├── .env.example                     # Exemple .env
├── .eslintrc.json                   # Configuration ESLint
├── .gitignore                       # Fichiers à ignorer
├── package.json                     # Dépendances npm
├── nodemon.json                     # Configuration dev server
└── README.md                        # Ce fichier
```

---

## 🔧 Configuration

### Fichier .env

Copier `.env.example` vers `.env` et configurer :

```env
# Server
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000

# Database
MONGODB_URI=mongodb://localhost:27017/diplochain
# OU pour MongoDB Atlas
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/diplochain

# JWT Authentication
JWT_SECRET=your_very_long_secret_key_here
JWT_EXPIRE=7d

# Blockchain
WEB3_PROVIDER=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
CONTRACT_ISSUER_ADDRESS=0x...
CONTRACT_VERIFIER_ADDRESS=0x...
DEPLOYER_PRIVATE_KEY=0x...

# Frontend/Mobile URLs
FRONTEND_URL=http://localhost:5173
MOBILE_URL=https://app.diplochain.bf

# Logging
LOG_LEVEL=info
LOG_FORMAT=json
```

**⚠️ IMPORTANT** : Ne jamais committer `.env`

---

## 🎯 API Endpoints

### 🔐 Authentication

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student"
}

Response: 
{
  "token": "eyJhbGc...",
  "user": { "id": "...", "email": "..." }
}
```

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

Response:
{
  "token": "eyJhbGc...",
  "user": { "id": "...", "email": "..." }
}
```

```http
POST /api/auth/logout
Authorization: Bearer eyJhbGc...

Response: { "success": true }
```

```http
GET /api/auth/me
Authorization: Bearer eyJhbGc...

Response:
{
  "id": "...",
  "email": "user@example.com",
  "firstName": "John",
  "role": "student"
}
```

### 👤 Users

```http
GET /api/users/profile
Authorization: Bearer eyJhbGc...

Response: { ... user profile ... }
```

```http
PUT /api/users/profile
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{ "firstName": "Jane", "phone": "..." }

Response: { ... updated user ... }
```

```http
GET /api/users/:id
Authorization: Bearer eyJhbGc...

Response: { ... user public profile ... }
```

```http
DELETE /api/users/:id
Authorization: Bearer eyJhbGc...

Response: { "success": true }
```

### 🎓 Diplomas

```http
GET /api/diplomas
Authorization: Bearer eyJhbGc...

Response: [
  {
    "id": "...",
    "title": "Bachelor en Informatique",
    "diplomaNumber": "2024-001",
    "issuedAt": "2024-05-01",
    "status": "issued",
    "blockchainHash": "0x..."
  }
]
```

```http
POST /api/diplomas
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "title": "Bachelor en Informatique",
  "diplomaNumber": "2024-001",
  "studentId": "...",
  "issuedAt": "2024-05-01"
}

Response: { ... created diploma ... }
```

```http
GET /api/diplomas/:id
Authorization: Bearer eyJhbGc...

Response: { ... diploma details ... }
```

```http
PUT /api/diplomas/:id
Authorization: Bearer eyJhbGc...

Response: { ... updated diploma ... }
```

```http
DELETE /api/diplomas/:id
Authorization: Bearer eyJhbGc...

Response: { "success": true }
```

### ⛓️ Blockchain Verification

```http
POST /api/diplomas/:id/issue
Authorization: Bearer eyJhbGc...

Response: {
  "transactionHash": "0x...",
  "blockNumber": 12345,
  "status": "pending"
}
```

```http
GET /api/diplomas/:id/blockchain-status
Authorization: Bearer eyJhbGc...

Response: {
  "status": "verified",
  "blockchainHash": "0x...",
  "timestamp": 1234567890,
  "blockNumber": 12345
}
```

```http
POST /api/verify
Content-Type: application/json

{
  "diplomaHash": "0x..."
}

Response: {
  "isValid": true,
  "verified": true,
  "issuer": "0x...",
  "timestamp": 1234567890
}
```

### 🏥 Health Check

```http
GET /api/health

Response: { "status": "Backend is running!" }
```

---

## 📦 Dépendances principales

```json
{
  "express": "^4.18.2",           // Framework web
  "mongoose": "^7.0.0",           // ODM MongoDB
  "jsonwebtoken": "^9.0.0",       // JWT tokens
  "bcryptjs": "^2.4.3",           // Password hashing
  "dotenv": "^16.0.3",            // Configuration
  "web3.js": "^1.10.0",           // Blockchain
  "joi": "^17.9.0",               // Validation
  "cors": "^2.8.5"                // CORS
}
```

**Dev dependencies** :
- `nodemon` — Auto-reload
- `jest` — Testing
- `supertest` — HTTP testing
- `eslint` — Code linting

---

## 🚀 Commandes npm

```bash
# Development
npm start              # Démarrer avec nodemon
npm run dev            # Alias de start

# Testing
npm test               # Exécuter tous les tests
npm test -- --coverage # Avec rapport de couverture
npm run test:unit      # Tests unitaires seulement
npm run test:integration # Tests d'intégration

# Code quality
npm run lint           # ESLint
npm run lint:fix       # Corriger automatiquement

# Documentation
npm run docs           # Générer documentation Swagger

# Database
npm run db:seed        # Seed données de test
npm run db:migrate     # Migrations

# Build & Deploy
npm run build          # Build pour production
npm run docker:build   # Build Docker image
npm run docker:run     # Run Docker container
```

---

## 🧪 Tests

### Exécuter les tests

```bash
# Tous les tests
npm test

# Tests spécifiques
npm test -- auth.test.js

# Watch mode (ré-exécute à chaque changement)
npm test -- --watch

# Avec couverture
npm test -- --coverage
```

### Écrire un test

```javascript
// tests/unit/example.test.js
const request = require('supertest');
const app = require('../../src/server');

describe('Auth Service', () => {
  it('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
```

**Couverture visée** : >80%

---

## 🐳 Docker

### Build & Run

```bash
# Build l'image
npm run docker:build

# Run le container
npm run docker:run

# Ou directement
docker build -t diplochain-backend .
docker run -p 5000:5000 --env-file .env diplochain-backend
```

### Dockerfile

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src
EXPOSE 5000
CMD ["npm", "start"]
```

---

## 🔒 Sécurité

### Points critiques

1. **Authentification**
   - JWT tokens avec expiration
   - Passwords hashés avec bcryptjs
   - HTTPS en production

2. **Smart Contracts**
   - Clés privées jamais en dur
   - Utilisation de wallets sécurisés
   - Transactions validées

3. **Data**
   - Validation des inputs obligatoire
   - Rate limiting sur endpoints sensibles
   - HTTPS et encryption en transit
   - RGPD compliant

### Checklist sécurité

- [ ] Pas de secrets en dur
- [ ] Validation des inputs
- [ ] Rate limiting activé
- [ ] CORS bien configuré
- [ ] Logging sécurisé
- [ ] Dépendances à jour
- [ ] Audit npm régulier
- [ ] Tests de sécurité

---

## 📊 Performance

### Targets

| Opération | Target | Réel |
|-----------|--------|------|
| Login | <100ms | ? |
| Get diploma | <50ms | ? |
| List diplomas | <200ms | ? |
| Verify blockchain | <1000ms | ? |

### Optimisations

- Indexes MongoDB créés
- Connection pooling configuré
- Caching en place
- Queries optimisées

### Profiler

```bash
# Générer profil Node.js
node --prof src/server.js
node --prof-process isolate-*.log > profile.txt
```

---

## 🚨 Troubleshooting

### Port 5000 en utilisation

```bash
# Windows
netstat -ano | findstr :5000

# macOS/Linux
lsof -i :5000

# Killer le processus
kill -9 <PID>

# Ou utiliser un autre port
PORT=5001 npm start
```

### MongoDB ne se connecte pas

```bash
# Vérifier MongoDB tourne
# Windows: Services → MongoDB
# macOS: brew services list
# Linux: systemctl status mongod

# Ou utiliser MongoDB Atlas
# Récupérer la chaîne de connexion
```

### JWT token expiré

```
❌ 401 Unauthorized - Invalid token

✅ Solution :
- Obtenir un nouveau token via /api/auth/login
- Ou utiliser refresh token si implémenté
```

### Erreurs de blockchain

```
❌ Web3 provider not responding

✅ Solutions :
- Vérifier la clé Infura dans .env
- Vérifier la connexion réseau
- Basculer vers un autre RPC provider
```

---

## 📚 Ressources

### Documentation
- [Express.js](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [Web3.js](https://web3js.readthedocs.io/)
- [JWT.io](https://jwt.io/)
- [Ethereum Docs](https://ethereum.org/developers)

### Tutoriels
- Backend Node.js : https://www.youtube.com/watch?v=fsCjFHuV1D0
- REST API : https://restfulapi.net/
- Testing : https://www.youtube.com/watch?v=7r4xVZIrXQ8

### Tools
- Postman: https://postman.com/ — Test APIs
- MongoDB Compass: https://www.mongodb.com/products/compass — GUI MongoDB
- Remix IDE: https://remix.ethereum.org/ — Test contrats

---

## 📋 Checklist avant commit

- [ ] Code follows ESLint rules
- [ ] All tests pass
- [ ] No console.logs
- [ ] Error handling implemented
- [ ] API docs updated
- [ ] `.env.example` updated
- [ ] No hardcoded secrets
- [ ] Git history clean
- [ ] PR reviewed

---

## 🤝 Contribution

### Git workflow

```bash
# Créer une branche
git checkout -b feature/new-feature

# Faire des commits
git add .
git commit -m "feat: add new feature"

# Push et créer une PR
git push origin feature/new-feature
```

### Code style

- ESLint configuré
- Prettier formatting
- Conventional commits

### Review process

- Minimum 1 reviewer (Marc)
- Tests doivent passer
- No merge conflicts

---

## 📞 Support

**Questions techniques** → Slack #backend  
**Code reviews** → DM à Marc  
**Issues urgentes** → Appel Marc

---

## 📄 License

MIT - Voir LICENSE file

---

## 🎯 Prochaines étapes

👉 Lire [SKILL.md](./SKILL.md) pour les tâches détaillées par semaine

👉 Lire [claude.md](./claude.md) pour les conventions de codage

👉 Lire [../PHASE2_DEVELOPMENT.md](../PHASE2_DEVELOPMENT.md) pour le contexte global

---

**Prêt à développer ! 🚀**

**Backend DiploChain — Phase 2 (MIABE Hackathon 2026)**
