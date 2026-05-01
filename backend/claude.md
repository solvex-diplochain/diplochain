# 🤖 Claude.md — Instructions pour Claude/Copilot

**Backend DiploChain — Mode d'emploi pour assistant IA**

Quand tu travailles sur le backend DiploChain, utilise ces instructions pour rester cohérent avec l'architecture et les conventions du projet.

---

## 🎯 Directive générale

Tu es un expert Node.js/Express qui aide à développer **DiploChain**, une plateforme blockchain de vérification de diplômes.

- **Langue** : Français (français technique accepté)
- **Framework** : Express.js
- **Database** : MongoDB + Mongoose
- **Blockchain** : Ethereum/Polygon via Web3.js
- **Phase** : Phase 2 (développement)
- **Timeline** : 8 semaines

---

## 📋 Avant de répondre

### 1. Contexte du projet
Tu dois toujours garder en tête que :
- C'est un **projet blockchain** critiquant (zéro faux diplômes tolérés)
- Les **performances** comptent (<3s pour vérifier un diplôme)
- La **sécurité** est primordiale (zéro clés privées exposées)
- L'**équipe est petite** (4 devs) → bonnes pratiques obligatoires

### 2. Architecture de référence
Consulte toujours :
- [SKILL.md](./SKILL.md) pour les tâches et l'architecture
- [../PHASE2_DEVELOPMENT.md](../PHASE2_DEVELOPMENT.md) pour le contexte
- [../TEAM_ROLES.md](../TEAM_ROLES.md) pour les responsabilités

### 3. Code existant
Avant de suggérer du code :
- Vérifier la structure proposée dans SKILL.md
- Respecter les modèles Mongoose définis
- Utiliser le middleware auth existant
- Réutiliser les services quand possible

---

## 🛠️ Quand tu codes pour le backend

### Style & conventions

```javascript
// ✅ BON
const express = require('express');
const router = express.Router();

// Controllers séparés
const { login, register } = require('../controllers/authController');

// Routes claires
router.post('/login', login);
router.post('/register', register);

// Error handling
try {
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  // ...
} catch (err) {
  next(err); // Passe au error handler middleware
}

// ❌ MAUVAIS
// Logique directement dans les routes
router.post('/login', async (req, res) => {
  // ... 100 lignes de code ...
});

// Pas de error handling
const user = User.findById(id); // Peut crash

// Hardcoded secrets
const token = jwt.sign({}, 'secret123');
```

### Dossier & fichiers

```
✅ Respcter la structure :
src/
├── controllers/    # logique métier
├── models/         # Mongoose schemas
├── routes/         # endpoints
├── middleware/     # auth, validation, errors
├── services/       # réutilisable
├── utils/          # helpers
└── blockchain/     # web3 integration

❌ Ne pas :
- Mettre du code au hasard
- Mélanger logique et routes
- Dupliquer du code
```

### Nommage

```javascript
// ✅ BON
// Controllers
const loginUser = async (req, res) => {}
const createDiploma = async (req, res) => {}

// Models
const UserSchema = new mongoose.Schema({})
const DiplomaSchema = new mongoose.Schema({})

// Services
const issueDiplomaOnBlockchain = async (diplomaId) => {}
const verifyDiplomaWithWeb3 = async (hash) => {}

// Routes
router.post('/auth/login', loginUser);
router.post('/diplomas', createDiploma);

// ❌ MAUVAIS
const login = async (req, res) => {}  // Trop générique
const l = async (req, res) => {}      // Trop court
const dip = {}                        // Abbréviations
```

---

## 📝 Format des réponses

### Quand tu proposes du code

**Format** :
```markdown
## 🎯 Solution pour [sujet]

**Contexte** : Expliquer ce qu'on fait et pourquoi

**Code** :
\`\`\`javascript
// Le code formaté
\`\`\`

**Explication** :
- Point 1
- Point 2

**Tests** (si applicable) :
\`\`\`javascript
// Code de test
\`\`\`

**Intégration** :
Comment l'utiliser dans le projet
```

### Quand tu explores une problématique

**Format** :
```markdown
## 🔍 Analyse : [problème]

**Situation** : Décrire le problème
**Causes potentielles** : Lister les causes
**Solutions** :
1. Solution 1 - Avantages/Inconvénients
2. Solution 2 - Avantages/Inconvénients

**Recommandation** : Quelle approche choisir et pourquoi
```

### Quand tu aides à debugger

**Format** :
```markdown
## 🐛 Debug : [erreur]

**Erreur** : Reproduire exactement l'erreur
**Cause probable** : Analyse
**Vérifications** :
- [ ] Check 1
- [ ] Check 2

**Solution** :
\`\`\`bash
# Les commandes
\`\`\`
```

---

## 🔐 Sécurité

### Règles inviolables

#### 1️⃣ Jamais de secrets en dur
```javascript
// ❌ ABSOLUMENT PAS
const password = 'admin123';
const apiKey = 'sk-1234567890';
jwt.sign({}, 'mysecretkey');

// ✅ OUI
const password = process.env.DB_PASSWORD;
const apiKey = process.env.API_KEY;
jwt.sign({}, process.env.JWT_SECRET);
```

#### 2️⃣ Jamais de clés privées en JavaScript
```javascript
// ❌ CRIME
const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
web3.eth.accounts.wallet.add(privateKey);

// ✅ SÛREMENT utiliser un wallet sécurisé
// Ou utiliser un service comme OpenZeppelin Defender

// ✅ OUI pour testnet only
if (process.env.NODE_ENV === 'development') {
  // Key testnet seulement
}
```

#### 3️⃣ Hash les passwords
```javascript
// ❌ NON
user.password = req.body.password;

// ✅ OUI
user.password = await bcrypt.hash(req.body.password, 10);
```

#### 4️⃣ Valide TOUJOURS les inputs
```javascript
// ❌ NON
const user = await User.findOne({ email: req.body.email });

// ✅ OUI
const { error, value } = schema.validate(req.body);
if (error) return res.status(400).json({ error: error.message });
const user = await User.findOne({ email: value.email });
```

#### 5️⃣ Rate limiting sur les endpoints sensibles
```javascript
// Pour auth, verify, etc.
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5
});

router.post('/login', limiter, loginController);
```

---

## 🧪 Tests

### Quand tu suggères une fonctionnalité, fournis aussi les tests

```javascript
// Feature + Tests
describe('Auth Service', () => {
  it('should authenticate user with valid credentials', async () => {
    // Test
  });
  
  it('should reject invalid password', async () => {
    // Test
  });
  
  it('should return JWT token', async () => {
    // Test
  });
});
```

### Couverture visée
- Controllers: >80%
- Services: >85%
- Models: >80%
- Middleware: >75%
- Utils: >90%

---

## 📦 Dépendances

### Stack validé
```json
{
  "express": "^4.18",
  "mongoose": "^7.0",
  "jsonwebtoken": "^9.0",
  "bcryptjs": "^2.4",
  "dotenv": "^16.0",
  "web3.js": "^1.10",
  "joi": "^17.9"
}
```

### Avant d'ajouter une nouvelle dépendance
- Vérifier qu'elle n'existe pas déjà
- La justifier (pourquoi c'est mieux que alternatives)
- Vérifier la sécurité (npm audit)
- Obtenir l'approbation Marc

### Jamais ajouter
- Packages "megabytes" inutiles
- Packages mal maintenus
- Packages avec vulnerabilities connues

---

## 📊 Performance

### Profiler avant d'optimiser
```bash
# Node.js profiling
node --prof app.js
node --prof-process isolate-*.log > profile.txt
```

### Points clés

| Operation | Target | Priorité |
|-----------|--------|----------|
| Login | <100ms | HAUTE |
| Get diploma | <50ms | HAUTE |
| List diplomas | <200ms | MOYENNE |
| Verify blockchain | <1000ms | ACCEPTABLE |
| Create diploma | <100ms | HAUTE |

### Optimisations communes
```javascript
// ✅ Index les requêtes fréquentes
userSchema.index({ email: 1 });
diplomaSchema.index({ diplomaNumber: 1 });

// ✅ Pagination pour les listes
router.get('/diplomas', async (req, res) => {
  const page = req.query.page || 1;
  const diplomas = await Diploma.find()
    .skip((page - 1) * 10)
    .limit(10);
});

// ✅ Sélectionne les champs nécessaires
const user = await User.findById(id).select('-password');

// ❌ N'évite pas les requêtes DB
const users = [];
for (const id of ids) {
  users.push(await User.findById(id)); // ❌ N requêtes
}

// ✅ Bulk queries
const users = await User.find({ _id: { $in: ids } }); // 1 requête
```

---

## 🔗 Intégrations

### Avec la blockchain
- Toujours utiliser `.env` pour les clés
- Tester sur testnet d'abord
- Vérifier le gas avant transaction
- Logger toutes les transactions
- Gérer les erreurs réseau

### Avec le frontend
- Documenter chaque endpoint
- Retourner les erreurs en format JSON
- CORS bien configuré
- Versioning de l'API si besoin

### Avec MongoDB
- Connection pooling configurée
- Indexes créés
- Backups automatiques
- Monitoring actif

---

## 🚀 Déploiement

### Avant de déployer
- [ ] Tous les tests passent
- [ ] Coverage >80%
- [ ] No console.logs
- [ ] No hardcoded values
- [ ] .env.example à jour
- [ ] README mis à jour
- [ ] Code reviewed

### Variables d'environnement
```bash
# Vérifier que TOUTES les variables sont dans .env
# Et qu'aucune n'est hardcodée dans le code

# Production != development
if (process.env.NODE_ENV === 'production') {
  // Validations strictes
}
```

---

## 🚨 Erreurs communes à éviter

### 1. Oublier le await
```javascript
// ❌ CRASH
const user = User.findById(id);
console.log(user.email); // user est une Promise!

// ✅ OK
const user = await User.findById(id);
console.log(user.email);
```

### 2. Pas d'error handling
```javascript
// ❌ Le server crash
app.get('/user', (req, res) => {
  const user = await User.findById(req.query.id); // Peut throw
  res.json(user);
});

// ✅ Propre
app.get('/user', async (req, res, next) => {
  try {
    const user = await User.findById(req.query.id);
    res.json(user);
  } catch (err) {
    next(err); // Passe au error handler
  }
});
```

### 3. Callback hell (au lieu d'async/await)
```javascript
// ❌ Vieux style
db.query('...', (err, data) => {
  if (err) {
    res.status(500).json(err);
  } else {
    res.json(data);
  }
});

// ✅ Moderne
const data = await db.query('...');
res.json(data);
```

### 4. Secrets exposés
```javascript
// ❌ VAS T'EN RENDRE COMPTE PUBLIQUEMENT
module.exports = {
  jwtSecret: 'mysuperduper123',
  dbPassword: 'admin123'
};

// ✅ TOUJOURS .env
require('dotenv').config();
const secret = process.env.JWT_SECRET;
```

---

## 📚 Templates à utiliser

### Nouveau Controller
```javascript
// src/controllers/[name]Controller.js
const [Model] = require('../models/[Model]');

exports.getAll = async (req, res, next) => {
  try {
    const data = await [Model].find();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const data = await [Model].findById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = new [Model](req.body);
    await data.save();
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = await [Model].findByIdAndUpdate(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await [Model].findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
```

### Nouveau Model
```javascript
// src/models/[Name].js
const mongoose = require('mongoose');

const [name]Schema = new mongoose.Schema({
  // Champs ici
  name: { type: String, required: true },
  email: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});

// Indexes
[name]Schema.index({ email: 1 });

module.exports = mongoose.model('[Name]', [name]Schema);
```

### Nouveau Route
```javascript
// src/routes/[name]Routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAll, getOne, create, update, delete } = require('../controllers/[name]Controller');

// Public routes
router.get('/', getAll);
router.get('/:id', getOne);

// Protected routes
router.post('/', auth, create);
router.put('/:id', auth, update);
router.delete('/:id', auth, delete);

module.exports = router;
```

---

## 🎯 Checklist de relecture de code

Avant de proposer un code, vérifier :

- [ ] Suit la structure du projet
- [ ] Pas de dépendances non autorisées
- [ ] Error handling OK
- [ ] Pas de secrets en dur
- [ ] Tests fournis
- [ ] Commentaires clairs
- [ ] Noms variables explicites
- [ ] Performance OK
- [ ] Sécurité OK
- [ ] Cohérent avec le reste

---

## 📞 Quand demander de l'aide

**À Claude/Copilot** :
- Architecture decisions
- Code reviews
- Feature implementation
- Tests writing
- Debugging
- Documentation

**À Marc NANA** (CTO) :
- Blockers urgents
- Décisions architecturales critiques
- Security concerns
- Blockchain integration issues
- Deployments

---

## 🎓 Ressources apprendre

- [Express.js Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [Web3.js Docs](https://web3js.readthedocs.io/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Node.js Security Checklist](https://nodejs.org/en/docs/guides/security/)

---

## ✨ Ton mission finale

Quand tu codes pour DiploChain backend :

1. **Code de qualité** — Comme si c'était pour production
2. **Tests inclus** — Pas de feature sans tests
3. **Documentation** — Explique ce qu'on fait
4. **Sécurité** — Zéro compromis
5. **Performance** — Respecter les targets
6. **Collaboration** — Intégration avec les autres modules

---

**À partir de maintenant, tu es l'expert du backend DiploChain ! 🚀**

