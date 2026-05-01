# 🧪 Backend DiploChain — Testing Guide

**Guide complet pour les tests et l'assurance qualité**

---

## 📋 Table des matières

1. [Setup](#setup)
2. [Unit Tests](#unit-tests)
3. [Integration Tests](#integration-tests)
4. [Coverage](#coverage-de-code)
5. [Best Practices](#best-practices)

---

## ⚙️ Setup

### Installation

```bash
# Install dependencies (déjà inclus dans npm install)
npm install --save-dev jest supertest mongodb-memory-server

# Vérifier
npm test --version
```

### Configuration Jest

#### jest.config.js
```javascript
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/config/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
};
```

#### tests/setup.js
```javascript
// Setup global test utilities
beforeAll(async () => {
  // Start MongoDB Memory Server if needed
});

afterAll(async () => {
  // Cleanup
});
```

---

## 🧪 Unit Tests

### Structure

```
tests/unit/
├── models.test.js
├── services.test.js
├── controllers.test.js
├── middleware.test.js
└── utils.test.js
```

### Exemple : Model test

#### tests/unit/models.test.js
```javascript
const mongoose = require('mongoose');
const User = require('../../src/models/User');

describe('User Model', () => {
  
  beforeEach(async () => {
    // Clear database before each test
    await User.deleteMany({});
  });

  describe('Creating a user', () => {
    
    it('should create a user with valid data', async () => {
      const user = await User.create({
        email: 'test@example.com',
        password: 'hashedpassword',
        firstName: 'John',
        lastName: 'Doe',
        role: 'student',
      });

      expect(user).toBeDefined();
      expect(user.email).toBe('test@example.com');
      expect(user.role).toBe('student');
    });

    it('should fail without email', async () => {
      expect(async () => {
        await User.create({
          password: 'hashedpassword',
          firstName: 'John',
          lastName: 'Doe',
          role: 'student',
        });
      }).rejects.toThrow();
    });

    it('should enforce unique email', async () => {
      await User.create({
        email: 'duplicate@example.com',
        password: 'hashedpassword',
        firstName: 'John',
        lastName: 'Doe',
        role: 'student',
      });

      expect(async () => {
        await User.create({
          email: 'duplicate@example.com',
          password: 'hashedpassword',
          firstName: 'Jane',
          lastName: 'Smith',
          role: 'student',
        });
      }).rejects.toThrow();
    });

  });

  describe('Validations', () => {
    
    it('should reject invalid role', async () => {
      expect(async () => {
        await User.create({
          email: 'test@example.com',
          password: 'hashedpassword',
          firstName: 'John',
          lastName: 'Doe',
          role: 'invalid_role',
        });
      }).rejects.toThrow();
    });

  });

});
```

### Exemple : Service test

#### tests/unit/services.test.js
```javascript
const authService = require('../../src/services/authService');
const User = require('../../src/models/User');

describe('Auth Service', () => {

  describe('register()', () => {
    
    it('should register a new user', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'student',
      };

      const result = await authService.register(userData);

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe('newuser@example.com');
    });

    it('should hash the password', async () => {
      const plainPassword = 'password123';
      
      const result = await authService.register({
        email: 'test@example.com',
        password: plainPassword,
        firstName: 'John',
        lastName: 'Doe',
        role: 'student',
      });

      const user = await User.findById(result.user.id);
      expect(user.password).not.toBe(plainPassword);
    });

    it('should reject existing email', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'student',
      };

      await authService.register(userData);

      expect(
        authService.register(userData)
      ).rejects.toThrow('Email already exists');
    });

  });

  describe('login()', () => {
    
    it('should login with correct credentials', async () => {
      const userData = {
        email: 'user@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'student',
      };

      await authService.register(userData);
      
      const result = await authService.login({
        email: userData.email,
        password: userData.password,
      });

      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe(userData.email);
    });

    it('should reject incorrect password', async () => {
      const userData = {
        email: 'user@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'student',
      };

      await authService.register(userData);

      expect(
        authService.login({
          email: userData.email,
          password: 'wrongpassword',
        })
      ).rejects.toThrow('Invalid credentials');
    });

  });

});
```

### Exemple : Utility test

#### tests/unit/utils.test.js
```javascript
const { validateEmail, isValidRole } = require('../../src/utils/validators');

describe('Validators', () => {

  describe('validateEmail()', () => {
    
    it('should validate correct emails', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('test.user@example.co.uk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('invalid@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });

  });

  describe('isValidRole()', () => {
    
    it('should accept valid roles', () => {
      expect(isValidRole('student')).toBe(true);
      expect(isValidRole('employer')).toBe(true);
      expect(isValidRole('institution')).toBe(true);
      expect(isValidRole('admin')).toBe(true);
    });

    it('should reject invalid roles', () => {
      expect(isValidRole('superuser')).toBe(false);
      expect(isValidRole('moderator')).toBe(false);
      expect(isValidRole('')).toBe(false);
    });

  });

});
```

---

## 🔗 Integration Tests

### Structure

```
tests/integration/
├── auth.test.js
├── diploma.test.js
├── blockchain.test.js
└── verification.test.js
```

### Exemple : Auth endpoints test

#### tests/integration/auth.test.js
```javascript
const request = require('supertest');
const app = require('../../src/server');
const User = require('../../src/models/User');

describe('Auth Endpoints', () => {
  
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
          role: 'student',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toBe('newuser@example.com');
    });

    it('should return 400 for invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalidemail',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
          role: 'student',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 409 for duplicate email', async () => {
      const userData = {
        email: 'duplicate@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'student',
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData);

      const res = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(res.statusCode).toBe(409);
      expect(res.body.error).toContain('already registered');
    });

  });

  describe('POST /api/auth/login', () => {
    
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'user@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
          role: 'student',
        });
    });

    it('should login with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe('user@example.com');
    });

    it('should return 401 for incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@example.com',
          password: 'wrongpassword',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toContain('Invalid');
    });

  });

  describe('GET /api/auth/me', () => {
    
    let token;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'user@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
          role: 'student',
        });

      token = res.body.token;
    });

    it('should return current user with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.email).toBe('user@example.com');
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .get('/api/auth/me');

      expect(res.statusCode).toBe(401);
    });

  });

});
```

### Exemple : Diploma endpoints test

#### tests/integration/diploma.test.js
```javascript
const request = require('supertest');
const app = require('../../src/server');
const User = require('../../src/models/User');
const Diploma = require('../../src/models/Diploma');

describe('Diploma Endpoints', () => {
  
  let token;
  let userId;
  let institutionId;

  beforeEach(async () => {
    await User.deleteMany({});
    await Diploma.deleteMany({});

    // Create and login institution user
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'institution@example.com',
        password: 'password123',
        firstName: 'University',
        lastName: 'Name',
        role: 'institution',
      });

    token = res.body.token;
    institutionId = res.body.user.id;

    // Create student
    const studentRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'student@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'student',
      });

    userId = studentRes.body.user.id;
  });

  describe('POST /api/diplomas', () => {
    
    it('should create a diploma', async () => {
      const res = await request(app)
        .post('/api/diplomas')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Bachelor en Informatique',
          diplomaNumber: '2024-001',
          description: 'Degree in Computer Science',
          studentId: userId,
          issuedAt: '2024-05-01',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('draft');
      expect(res.body.title).toBe('Bachelor en Informatique');
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .post('/api/diplomas')
        .send({
          title: 'Bachelor',
          studentId: userId,
        });

      expect(res.statusCode).toBe(401);
    });

  });

  describe('GET /api/diplomas', () => {
    
    beforeEach(async () => {
      await request(app)
        .post('/api/diplomas')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Bachelor',
          diplomaNumber: '2024-001',
          studentId: userId,
          issuedAt: '2024-05-01',
        });
    });

    it('should list diplomas', async () => {
      const res = await request(app)
        .get('/api/diplomas')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should support pagination', async () => {
      const res = await request(app)
        .get('/api/diplomas?page=1&limit=10')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('pagination');
      expect(res.body.pagination).toHaveProperty('page');
      expect(res.body.pagination).toHaveProperty('limit');
    });

  });

});
```

---

## 📊 Coverage de code

### Lancer les tests avec couverture

```bash
# Générer le rapport
npm test -- --coverage

# Voir le rapport HTML
open coverage/lcov-report/index.html

# Ou sur Linux
xdg-open coverage/lcov-report/index.html
```

### Objectifs de couverture

```
Minimum requis : 80%
Excellent : 90%+

Breakdown :
- Statements : 80%+
- Branches : 80%+
- Functions : 80%+
- Lines : 80%+
```

### Améliorer la couverture

```javascript
// Avant : 60% coverage
if (user.role === 'admin') {
  // sensitive operation
}

// Après : 100% coverage
describe('Admin operations', () => {
  it('should allow admin', () => { /* ... */ });
  it('should deny non-admin', () => { /* ... */ });
});
```

---

## ✅ Best Practices

### 1. Test structure

```javascript
describe('Feature', () => {
  beforeEach(() => {
    // Setup
  });

  describe('Action', () => {
    it('should do something specific', () => {
      // Arrange
      const input = ...;
      
      // Act
      const result = ...;
      
      // Assert
      expect(result).toBe(...);
    });
  });

  afterEach(() => {
    // Cleanup
  });
});
```

### 2. Test naming

✅ Good:
```javascript
it('should return 401 when token is missing', () => {});
it('should create a user with valid data', () => {});
it('should fail with duplicate email', () => {});
```

❌ Bad:
```javascript
it('tests login', () => {});
it('check email', () => {});
it('test', () => {});
```

### 3. Assertions

✅ Good:
```javascript
expect(user.email).toBe('test@example.com');
expect(response.status).toBe(201);
expect(Array.isArray(diplomas)).toBe(true);
expect(error.message).toContain('Invalid');
```

❌ Bad:
```javascript
expect(user).toBeTruthy();  // Too vague
expect(response).toBeDefined();  // Not specific
```

### 4. Mock data

```javascript
const mockUser = {
  id: '507f1f77bcf86cd799439011',
  email: 'test@example.com',
  password: 'hashedpassword',
  role: 'student',
};

const mockDiploma = {
  id: '507f1f77bcf86cd799439012',
  title: 'Bachelor',
  studentId: mockUser.id,
  status: 'draft',
};
```

### 5. Mocking fonctions

```javascript
const mockBlockchainService = {
  issueDiploma: jest.fn().mockResolvedValue({
    transactionHash: '0x...',
    blockNumber: 12345,
  }),
};

// Tester
await mockBlockchainService.issueDiploma({});
expect(mockBlockchainService.issueDiploma).toHaveBeenCalled();
```

---

## 🚀 CI/CD Integration

### GitHub Actions

#### .github/workflows/test.yml
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mongodb:
        image: mongo:6
        options: >-
          --health-cmd mongosh
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 27017:27017

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      - run: npm test -- --coverage
      - run: npm run lint
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

---

## 📝 Commandes utiles

```bash
# Tous les tests
npm test

# Specific test file
npm test auth.test.js

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage

# Single run (CI)
npm test -- --coverage --ci --maxWorkers=2

# Verbose output
npm test -- --verbose
```

---

## 📞 Questions fréquentes

**Q: Comment tester une fonction async?**
A:
```javascript
it('should work', async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});
```

**Q: Comment mocker une dépendance?**
A:
```javascript
jest.mock('../../src/services/blockchainService', () => ({
  issueDiploma: jest.fn().mockResolvedValue({}),
}));
```

**Q: Comment nettoyer après les tests?**
A:
```javascript
afterEach(async () => {
  await User.deleteMany({});
  await Diploma.deleteMany({});
});
```

---

**Prêt à tester ! 🧪**

Target: 80%+ coverage by week 7

