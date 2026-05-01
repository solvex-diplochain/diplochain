# 🛠️ Backend DiploChain — Setup Guide

**Guide détaillé pour configurer l'environnement de développement**

---

## ✅ Prérequis

### Software requis
- **Node.js 18+** — https://nodejs.org/ (LTS recommended)
- **npm 9+** ou **yarn 3+** — Inclus avec Node.js
- **MongoDB 6+** — [Installation](#mongodb-setup)
- **Git** — https://git-scm.com/

### Hardware recommandé
- **RAM** : 4GB minimum
- **Disk space** : 2GB libre
- **Network** : Connexion Internet stable

### Comptes externes (Phase 2)
- **Infura** — https://infura.io (pour RPC Ethereum)
- **MongoDB Atlas** — https://www.mongodb.com/cloud/atlas (cloud database)

---

## 1️⃣ MongoDB Setup

### Option A: MongoDB Local (Développement)

#### Windows
```bash
# Télécharger MongoDB Community Edition
# https://www.mongodb.com/try/download/community

# Installer (wizard guide)
# MongoDB s'installe comme service

# Vérifier l'installation
mongosh
# Si ça ouvre un shell, c'est bon !
```

#### macOS
```bash
# Avec Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Démarrer le service
brew services start mongodb-community

# Vérifier
mongosh
```

#### Linux (Ubuntu)
```bash
# Installer
curl https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Démarrer
sudo systemctl start mongod

# Vérifier
mongosh
```

### Option B: MongoDB Atlas (Cloud)

1. **Créer un compte** : https://www.mongodb.com/cloud/atlas
2. **Créer un cluster** :
   - Click "Create Deployment"
   - Sélectionner "Free" (M0)
   - Sélectionner une région proche
   - Créer le cluster
3. **Créer un user** :
   - Database Access → Add Database User
   - Username: `admin`
   - Password: Strong password
4. **Whitelist IP** :
   - Network Access → Add IP Address
   - Ajouter `0.0.0.0/0` (dev only, restreindre en prod)
5. **Obtenir la connection string** :
   - Cluster → Connect → Connection String
   - Copier la chaîne

**Connection string format**:
```
mongodb+srv://admin:password@cluster.mongodb.net/diplochain?retryWrites=true&w=majority
```

---

## 2️⃣ Node.js Setup

### Installation

#### Windows
```bash
# Télécharger depuis https://nodejs.org/
# Exécuter l'installer
# Cocher "Add to PATH"
# Finir l'installation

# Vérifier
node --version
npm --version
```

#### macOS
```bash
# Avec Homebrew
brew install node

# Vérifier
node --version
npm --version
```

#### Linux (Ubuntu)
```bash
# Installer NodeSource repo
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Vérifier
node --version
npm --version
```

### Configuration npm

```bash
# Vérifier la version
npm --version
# Doit être 9+ pour yarn, npm ok

# (Optional) Installer yarn (plus rapide)
npm install -g yarn
yarn --version
```

---

## 3️⃣ Clone et installation des dépendances

### Clone du repository

```bash
# Si vous n'avez pas le repo
git clone <repo-url> diplochain
cd diplochain/backend

# Ou si vous êtes déjà dans le dossier
cd backend
```

### Installation des packages

```bash
# Avec npm
npm install

# OU avec yarn (plus rapide)
yarn install

# Vérifier l'installation
npm list
# Doit montrer toutes les dépendances
```

**Dépendances principales installées** :
```
express           -> Framework web
mongoose          -> ODM MongoDB
jsonwebtoken      -> JWT tokens
bcryptjs          -> Password hashing
dotenv            -> Configuration
web3.js           -> Blockchain
joi               -> Validation
nodemon (dev)     -> Auto-reload
jest (dev)        -> Testing
```

---

## 4️⃣ Configuration .env

### Créer le fichier

```bash
# Copier le template
cp .env.example .env

# Éditer avec votre éditeur préféré
code .env   # VS Code
# ou
nano .env   # Terminal editor
```

### Configurer les variables

```env
# 🔧 Server
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000

# 🗄️ Database — MongoDB
# Option 1: Local
MONGODB_URI=mongodb://localhost:27017/diplochain

# Option 2: Atlas (remplacer les valeurs)
# MONGODB_URI=mongodb+srv://admin:PASSWORD@cluster.mongodb.net/diplochain?retryWrites=true&w=majority

# 🔑 JWT
JWT_SECRET=your_secret_key_here_min_32_chars_long
JWT_EXPIRE=7d

# ⛓️ Blockchain
# Obtenir une clé Infura
WEB3_PROVIDER=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# Adresses des contrats (après déploiement)
CONTRACT_ISSUER_ADDRESS=0x0000000000000000000000000000000000000000
CONTRACT_VERIFIER_ADDRESS=0x0000000000000000000000000000000000000000

# Clé testnet seulement !
DEPLOYER_PRIVATE_KEY=0x0000000000000000000000000000000000000000000000000000000000000000

# 🌐 URLs
FRONTEND_URL=http://localhost:5173
MOBILE_URL=https://app.diplochain.bf

# 📝 Logging
LOG_LEVEL=debug
LOG_FORMAT=json
```

### Générer JWT_SECRET

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Ou utiliser une chaîne forte quelconque
# Minimum 32 caractères
```

---

## 5️⃣ Infura Setup (Blockchain)

1. **Créer un compte** : https://infura.io
2. **Créer un projet** :
   - Dashboard → Create Project
   - Sélectionner "Web3 API"
   - Nommer: "DiploChain"
3. **Obtenir la clé API** :
   - Voir les endpoints
   - Sélectionner "Sepolia"
   - Copier le lien `https://sepolia.infura.io/v3/YOUR_KEY`
4. **Mettre à jour .env** :
   ```env
   WEB3_PROVIDER=https://sepolia.infura.io/v3/YOUR_KEY
   ```

---

## 6️⃣ Démarrer le serveur

### Premier lancement

```bash
# Depuis le dossier backend/
npm start

# ✅ Vous devriez voir :
# ✅ MongoDB connected
# ✅ Server running on port 5000
```

### Vérifier que c'est OK

```bash
# Dans un autre terminal
curl http://localhost:5000/api/health

# Réponse attendue
# {"status":"Backend is running!"}
```

### Mode développement (watch)

```bash
# Auto-reload à chaque changement
npm run dev

# Ou directement
nodemon src/server.js
```

---

## 7️⃣ Setup VS Code (Optionnel mais recommandé)

### Extensions recommandées

1. **REST Client** — Thunder Client ou REST Client
   - Pour tester les endpoints directement

2. **MongoDB** — MongoDB for VS Code
   - Pour explorer la base de données

3. **ES7+ React/Redux/React-Native snippets**
   - Snippets JavaScript utiles

4. **Prettier** — Code formatter
   - Pour formater automatiquement

5. **ESLint** — Linter
   - Pour vérifier la qualité du code

### Settings JSON (.vscode/settings.json)

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["javascript"],
  "search.exclude": {
    "node_modules": true,
    ".env": true
  }
}
```

---

## 8️⃣ Tester l'API

### Avec cURL

```bash
# Health check
curl http://localhost:5000/api/health

# Register (remplacer les valeurs)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "role": "student"
  }'
```

### Avec Postman

1. **Télécharger** : https://postman.com
2. **Créer une collection**
3. **Ajouter une requête** :
   - Method: POST
   - URL: http://localhost:5000/api/auth/login
   - Body (JSON):
     ```json
     {
       "email": "test@example.com",
       "password": "password123"
     }
     ```
4. **Envoyer**

### Avec REST Client (VS Code)

```http
### Health check
GET http://localhost:5000/api/health

### Register
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "firstName": "Test",
  "lastName": "User",
  "role": "student"
}
```

---

## 🧪 Tests

### Exécuter les tests

```bash
# Tous les tests
npm test

# Watch mode
npm test -- --watch

# Avec couverture
npm test -- --coverage
```

### Fichiers de test

```
tests/
├── unit/
│   ├── models.test.js
│   ├── services.test.js
│   └── utils.test.js
└── integration/
    ├── auth.test.js
    ├── diploma.test.js
    └── blockchain.test.js
```

---

## 🐛 Troubleshooting

### Port 5000 déjà en utilisation

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>

# Ou utiliser un autre port
PORT=5001 npm start
```

### MongoDB ne démarre pas

```bash
# Windows: Vérifier le service
# Services → MongoDB Server → Start

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
sudo systemctl status mongod
```

### Erreur: "Cannot find module"

```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### JWT_SECRET error

```bash
# Générer une clé valide
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Mettre à jour .env
JWT_SECRET=votre_clé_générée
```

### Infura API key non valide

```bash
# Vérifier la clé
# 1. Aller sur https://infura.io
# 2. Copier exactement le lien
# 3. Mettre à jour .env
WEB3_PROVIDER=https://sepolia.infura.io/v3/YOUR_KEY
```

---

## 📊 Vérification de la setup

### Checklist final

- [ ] Node.js installé (`node --version`)
- [ ] npm/yarn installé (`npm --version`)
- [ ] MongoDB tourne (`mongosh connect works`)
- [ ] Dépendances installées (`npm install` réussi)
- [ ] `.env` configuré avec les vraies valeurs
- [ ] Server démarre (`npm start` réussi)
- [ ] Health check passe (`curl /api/health`)
- [ ] Can register a user
- [ ] Can login with credentials

### Commandes de vérification

```bash
# 1. Versions
node --version        # Doit être 18+
npm --version         # Doit être 9+

# 2. MongoDB
mongosh              # Doit ouvrir un shell

# 3. Dépendances
npm list             # Doit lister tous les packages

# 4. Server
npm start            # Doit démarrer sans erreur

# 5. API
curl http://localhost:5000/api/health
# Doit retourner {"status":"Backend is running!"}
```

---

## 🚀 Prochaines étapes

Une fois que tout est configuré :

1. **Lire la documentation** :
   - [README.md](./README.md) — Vue d'ensemble
   - [SKILL.md](./SKILL.md) — Tâches détaillées
   - [ARCHITECTURE.md](./ARCHITECTURE.md) — Design
   - [API.md](./API.md) — Endpoints

2. **Commencer à coder** :
   - Semaine 1: Authentification
   - Semaine 2-3: Users et diplômes
   - Semaine 4-5: Blockchain integration

3. **Faire des tests** :
   - `npm test` pour vérifier la couverture
   - `npm run lint` pour vérifier la qualité

4. **Commit et push** :
   ```bash
   git checkout -b feature/initial-setup
   git add .
   git commit -m "chore: setup backend"
   git push origin feature/initial-setup
   ```

---

## 📞 Support

**Problèmes de setup ?**
- Slack #backend
- Lire le troubleshooting ci-dessus
- DM à Marc pour les blockers

---

**Setup complète ! Prêt à développer ! 🚀**

