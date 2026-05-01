# 🏗️ Backend DiploChain — Architecture

**Document de conception technique du backend**

---

## 📊 Vue d'ensemble

```
┌──────────────────────────────────────────────┐
│        Frontend / Mobile Clients              │
└────────────────┬─────────────────────────────┘
                 │ HTTP/REST
                 │
       ┌─────────▼──────────┐
       │  Express.js API    │
       │  :5000             │
       └─────────┬──────────┘
                 │
     ┌───────────┼───────────┐
     │           │           │
┌────▼───┐  ┌───▼────┐  ┌───▼──────┐
│MongoDB  │  │Web3.js │  │Services  │
│(Local)  │  │Ethereum│  │(Email,   │
│         │  │Polygon │  │etc)      │
└─────────┘  └────────┘  └──────────┘
```

---

## 🎯 Principes de design

### 1. Séparation des responsabilités

```
Routes          → Réception et validation des requêtes
Controllers     → Orchestration
Services        → Logique métier
Models          → Schémas et persistance
Middleware      → Cross-cutting concerns (auth, logging, etc)
```

### 2. DRY (Don't Repeat Yourself)
- Code réutilisable dans les services
- Middleware centralisé
- Utilities pour les fonctions communes

### 3. SOLID Principles
- **S**ingle Responsibility
- **O**pen/Closed
- **L**iskov Substitution
- **I**nterface Segregation
- **D**ependency Inversion

### 4. Error Handling
- Try/catch dans les routes/controllers
- Pass à error middleware
- Logging centralisé

---

## 📁 Architecture par dossier

### `src/routes/`

**Responsabilité** : Définir les endpoints HTTP

```javascript
// authRoutes.js
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', auth, authController.logout);

module.exports = router;
```

**Convention** :
- Noms au pluriel (`authRoutes`, `userRoutes`)
- HTTP verbs clairs (GET, POST, PUT, DELETE)
- Routes publiques et protégées séparées

---

### `src/controllers/`

**Responsabilité** : Orchestrer la requête/réponse

```javascript
// authController.js
exports.login = async (req, res, next) => {
  try {
    // 1. Validate input
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    
    // 2. Call service
    const result = await authService.login(value);
    
    // 3. Return response
    res.json(result);
  } catch (err) {
    next(err); // Pass to error middleware
  }
};
```

**Convention** :
- Nom du fichier = Nom du module (auth, user, diploma)
- Une fonction par endpoint
- Logique métier → services (pas ici)
- Error handling avec try/catch

---

### `src/services/`

**Responsabilité** : Logique métier complexe

```javascript
// authService.js
class AuthService {
  async login(credentials) {
    // Logique métier
    const user = await User.findOne({ email: credentials.email });
    if (!user) throw new Error('User not found');
    
    const valid = await bcrypt.compare(credentials.password, user.password);
    if (!valid) throw new Error('Invalid password');
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    return { token, user };
  }
}

module.exports = new AuthService();
```

**Convention** :
- Classes ou fonctions pour la réutilisabilité
- Une responsabilité par service
- Tests unitaires faciles

---

### `src/models/`

**Responsabilité** : Schémas Mongoose

```javascript
// User.js
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  role: { 
    type: String, 
    enum: ['student', 'employer', 'institution', 'admin'],
    default: 'student'
  },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Index for performance
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
```

**Convention** :
- Schémas avec validation
- Indexes sur champs fréquemment queryés
- Hooks pour logique pré/post save
- Champs de timestamp

---

### `src/middleware/`

**Responsabilité** : Cross-cutting concerns

```javascript
// auth.js - JWT verification
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

// errorHandler.js - Global error handling
module.exports = (err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal server error' 
  });
};
```

**Convention** :
- Middleware pour auth, validation, logging
- Error handler au dernier middleware

---

### `src/utils/`

**Responsabilité** : Fonctions utiles réutilisables

```javascript
// helpers.js
function formatResponse(data, message) {
  return { success: true, data, message };
}

function formatError(err) {
  return { success: false, error: err.message };
}

module.exports = { formatResponse, formatError };
```

---

### `src/blockchain/`

**Responsabilité** : Intégration Web3

```javascript
// web3.js
const Web3 = require('web3');
const web3 = new Web3(process.env.WEB3_PROVIDER);

const issuerABI = require('./contracts.json').DiplomaIssuer;

const contract = new web3.eth.Contract(
  issuerABI,
  process.env.CONTRACT_ISSUER_ADDRESS
);

module.exports = { web3, contract };
```

---

## 🔄 Flux de requête

### 1. Requête arrive
```
Client → HTTP Request → Express app
```

### 2. Middleware exécutés
```
CORS
  ↓
Body Parser
  ↓
Auth (si protected)
  ↓
Validation
  ↓
Route Handler
```

### 3. Controller
```
Parse input
  ↓
Validate
  ↓
Call service
  ↓
Format response
  ↓
Send response
```

### 4. Service
```
Query database
  ↓
Business logic
  ↓
Return result
```

### 5. Error handling
```
Any error
  ↓
Caught in try/catch
  ↓
Passed to error handler
  ↓
Logged
  ↓
Response envoyée
```

---

## 🗄️ Modèles de données

### User
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  firstName: String,
  lastName: String,
  role: String (student|employer|institution|admin),
  institution: ObjectId (ref: Institution),
  avatar: String (URL),
  phone: String,
  address: String,
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date (soft delete)
}
```

### Diploma
```javascript
{
  _id: ObjectId,
  title: String,
  diplomaNumber: String (unique),
  description: String,
  issuer: ObjectId (ref: Institution),
  student: ObjectId (ref: User),
  issuedAt: Date,
  expiresAt: Date (optional),
  fileUrl: String,
  status: String (draft|pending|issued|verified),
  blockchainHash: String,
  blockNumber: Number,
  transactionHash: String,
  metadata: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### Institution
```javascript
{
  _id: ObjectId,
  name: String,
  code: String (unique),
  address: String,
  contactEmail: String,
  phone: String,
  walletAddress: String,
  verified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Authentification

### Flux Login

```
1. User POST /api/auth/login
2. Controller validate credentials
3. Service:
   - Find user by email
   - Compare passwords
   - Generate JWT token
4. Return { token, user }
5. Client stores token in localStorage
6. Client includes token in Authorization header
7. Middleware verifies token on protected routes
```

### Token format

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                 ^
                 Required prefix
```

### Token content

```javascript
{
  id: "user_id",
  email: "user@example.com",
  role: "student",
  iat: 1234567890,        // issued at
  exp: 1234654290         // expires at
}
```

---

## ⛓️ Blockchain Integration

### Flux d'émission

```
1. Institution crée diploma
2. User clique "Issue on blockchain"
3. Backend:
   - Prepare transaction data
   - Estimate gas
   - Sign transaction with deployer key
   - Send to blockchain
4. Transaction pending
5. Listen for confirmation
6. Update diploma status
7. Store blockchainHash en DB
```

### Flux de vérification

```
1. User/Employer POST /api/verify?hash=0x...
2. Backend:
   - Call contract DiplomaVerifier.verify(hash)
   - Contract returns bool
3. Return { isValid: bool }
4. User sees result in <1s
```

---

## 📊 Database Design

### Indexes (Performance)

```javascript
// High-frequency queries
User.index({ email: 1 });
Diploma.index({ diplomaNumber: 1 });
Diploma.index({ issuer: 1 });
Diploma.index({ student: 1 });
Diploma.index({ status: 1 });
Institution.index({ code: 1 });
```

### Connection pooling

```javascript
// Mongoose handles automatically
// Min pool size: 10
// Max pool size: 30
```

### Transactions (if needed)

```javascript
const session = await mongoose.startSession();
session.startTransaction();

try {
  // Multiple operations
  await User.updateOne(..., { session });
  await Diploma.insertOne(..., { session });
  await session.commitTransaction();
} catch (err) {
  await session.abortTransaction();
}
```

---

## 🧪 Testing Architecture

### Unit tests
```
✓ Services (business logic)
✓ Models (validations)
✓ Utils (helper functions)
```

### Integration tests
```
✓ API endpoints
✓ Database interactions
✓ Blockchain integration
```

### Test setup
```javascript
// Use MongoDB Memory Server for tests
import { MongoMemoryServer } from 'mongodb-memory-server';

beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
});
```

---

## 🚀 Deployment Architecture

### Development
```
Local machine
├── Express :5000
├── MongoDB local
└── Testnet blockchain
```

### Staging
```
Heroku/Railway
├── Express :5000
├── MongoDB Atlas
└── Ethereum Sepolia
```

### Production
```
AWS EC2 / DigitalOcean
├── Express :5000 (with PM2)
├── MongoDB Atlas (sharded)
├── Ethereum Mainnet
├── CloudFlare CDN
└── Monitoring & Alerting
```

---

## 📈 Scalability Considerations

### For 1000 users
- Current setup is fine
- Single MongoDB instance ok

### For 10,000 users
- Add Redis caching
- MongoDB indexes critical
- Load balancing needed

### For 100,000+ users
- MongoDB sharding
- API rate limiting
- CDN for assets
- Microservices if needed

---

## 🔄 Versioning

### API versioning (if needed)
```javascript
// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/diplomas', diplomaRoutes);

// Future: add v2 when breaking changes
app.use('/api/v2/auth', authRoutesV2);
```

---

## 📝 Documentation Standards

### Code comments
```javascript
// ✓ Good
// Check if user has permission to delete this diploma
if (user.role !== 'admin' && user.id !== diploma.issuerId) {
  throw new Error('Unauthorized');
}

// ✗ Bad
// DON'T DO THIS
if (user.role !== 'admin' && user.id !== diploma.issuerId) { // check permission
  throw new Error('Unauthorized'); // unauthorized
}
```

### API documentation
```javascript
/**
 * POST /api/auth/login
 * @description Authenticate user
 * @param {Object} credentials - { email, password }
 * @returns {Object} { token, user }
 * @throws {Error} Invalid credentials
 */
```

---

## ✅ Architecture Checklist

- [ ] Separation of concerns (routes, controllers, services)
- [ ] Error handling middleware
- [ ] Input validation
- [ ] Authentication/Authorization
- [ ] Logging
- [ ] Database indexes
- [ ] Testing strategy
- [ ] API documentation
- [ ] Security best practices
- [ ] Performance monitoring

---

**Cette architecture est scalable, testable, et maintenable ! 🏗️**

