# 🔗 Backend DiploChain — API Documentation

**Documentation complète des endpoints**

---

## 📋 Table des matières

1. [Authentication](#authentication)
2. [Users](#users)
3. [Diplomas](#diplomas)
4. [Verification](#verification)
5. [Health](#health)

---

## 🔐 Authentication

Base URL: `http://localhost:5000/api`

### Register

```http
POST /auth/register
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student"
}
```

**Response 201**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "student@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student"
  }
}
```

**Response 400** (Bad request)
```json
{
  "error": "Invalid email format"
}
```

**Response 409** (Conflict)
```json
{
  "error": "Email already registered"
}
```

**Role options**: `student` | `employer` | `institution` | `admin`

---

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "securepassword123"
}
```

**Response 200**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "student@example.com",
    "role": "student"
  }
}
```

**Response 401** (Unauthorized)
```json
{
  "error": "Invalid email or password"
}
```

---

### Logout

```http
POST /auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response 200**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Get Current User

```http
GET /auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response 200**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "student@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student",
  "createdAt": "2024-05-01T10:00:00Z"
}
```

**Response 401** (No token)
```json
{
  "error": "No token provided"
}
```

---

## 👤 Users

### Get User Profile

```http
GET /users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response 200**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "student@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student",
  "phone": "+226 XX XX XX XX",
  "address": "123 Rue de la Paix, Ouagadougou",
  "avatar": "https://...",
  "createdAt": "2024-05-01T10:00:00Z"
}
```

---

### Update User Profile

```http
PUT /users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+226 XX XX XX XX",
  "address": "456 Avenue des Savannes, Ouagadougou"
}
```

**Response 200**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "student@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+226 XX XX XX XX",
  "address": "456 Avenue des Savannes, Ouagadougou",
  "updatedAt": "2024-05-01T11:30:00Z"
}
```

---

### Get User by ID

```http
GET /users/507f1f77bcf86cd799439011
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response 200** (Public profile)
```json
{
  "id": "507f1f77bcf86cd799439011",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student",
  "avatar": "https://..."
}
```

**Response 404** (Not found)
```json
{
  "error": "User not found"
}
```

---

### Delete User Account

```http
DELETE /users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "password": "currentpassword"
}
```

**Response 200**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

---

## 🎓 Diplomas

### List My Diplomas

```http
GET /diplomas
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (draft|pending|issued|verified)

```http
GET /diplomas?page=1&limit=10&status=issued
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response 200**
```json
{
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "Bachelor en Informatique",
      "diplomaNumber": "2024-001",
      "issuedAt": "2024-05-01",
      "issuer": {
        "id": "507f1f77bcf86cd799439012",
        "name": "Université de Ouagadougou"
      },
      "status": "issued",
      "blockchainHash": "0x...",
      "createdAt": "2024-05-01T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "pages": 1
  }
}
```

---

### Create Diploma

```http
POST /diplomas
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Bachelor en Informatique",
  "diplomaNumber": "2024-001",
  "description": "Degree in Computer Science",
  "studentId": "507f1f77bcf86cd799439010",
  "issuedAt": "2024-05-01",
  "expiresAt": "2034-05-01"
}
```

**Response 201**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "Bachelor en Informatique",
  "diplomaNumber": "2024-001",
  "status": "draft",
  "issuer": "507f1f77bcf86cd799439013",
  "student": "507f1f77bcf86cd799439010",
  "createdAt": "2024-05-01T10:00:00Z"
}
```

**Response 400** (Validation error)
```json
{
  "error": "Diploma number must be unique"
}
```

---

### Get Diploma Details

```http
GET /diplomas/507f1f77bcf86cd799439011
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response 200**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "Bachelor en Informatique",
  "diplomaNumber": "2024-001",
  "description": "Degree in Computer Science",
  "issuer": {
    "id": "507f1f77bcf86cd799439013",
    "name": "Université de Ouagadougou",
    "code": "UO"
  },
  "student": {
    "id": "507f1f77bcf86cd799439010",
    "firstName": "John",
    "lastName": "Doe"
  },
  "issuedAt": "2024-05-01",
  "expiresAt": "2034-05-01",
  "status": "issued",
  "blockchainHash": "0xabc123...",
  "blockNumber": 12345,
  "transactionHash": "0xdef456...",
  "fileUrl": "https://...",
  "createdAt": "2024-05-01T10:00:00Z",
  "updatedAt": "2024-05-01T11:00:00Z"
}
```

---

### Update Diploma

```http
PUT /diplomas/507f1f77bcf86cd799439011
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Master en Informatique",
  "description": "Updated description"
}
```

**Response 200** (Updated diploma)

**Note**: Only draft diplomas can be updated

---

### Delete Diploma

```http
DELETE /diplomas/507f1f77bcf86cd799439011
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response 200**
```json
{
  "success": true,
  "message": "Diploma deleted"
}
```

**Note**: Only draft diplomas can be deleted

---

### Issue Diploma on Blockchain

```http
POST /diplomas/507f1f77bcf86cd799439011/issue
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response 200**
```json
{
  "transactionHash": "0xabc123def456...",
  "blockNumber": 12345,
  "status": "pending",
  "message": "Diploma issued on blockchain. Waiting for confirmation..."
}
```

**Response 400** (Already issued)
```json
{
  "error": "Diploma already issued"
}
```

---

### Get Blockchain Status

```http
GET /diplomas/507f1f77bcf86cd799439011/blockchain-status
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response 200**
```json
{
  "status": "verified",
  "blockchainHash": "0xabc123...",
  "transactionHash": "0xdef456...",
  "blockNumber": 12345,
  "timestamp": 1714553600,
  "confirmations": 10,
  "gasUsed": 150000,
  "gasCost": "0.015 ETH"
}
```

---

## ✅ Verification

### Verify Diploma

```http
POST /verify
Content-Type: application/json

{
  "diplomaHash": "0xabc123def456..."
}
```

**Response 200** (Valid)
```json
{
  "isValid": true,
  "verified": true,
  "diploma": {
    "title": "Bachelor en Informatique",
    "diplomaNumber": "2024-001",
    "issuer": "Université de Ouagadougou",
    "student": "John Doe",
    "issuedAt": "2024-05-01"
  },
  "blockchainVerification": {
    "contractAddress": "0x...",
    "blockNumber": 12345,
    "timestamp": 1714553600
  }
}
```

**Response 200** (Invalid)
```json
{
  "isValid": false,
  "verified": false,
  "message": "Diploma not found on blockchain"
}
```

---

### Quick Verification (3-second target)

```http
POST /verify/quick
Content-Type: application/json

{
  "diplomaNumber": "2024-001"
}
```

**Response 200**
```json
{
  "isValid": true,
  "verified": true,
  "responseTime": "0.8s"
}
```

---

## 🏥 Health

### Health Check

```http
GET /health
```

**Response 200**
```json
{
  "status": "healthy",
  "timestamp": "2024-05-01T10:00:00Z",
  "uptime": 3600,
  "database": "connected",
  "blockchain": "connected"
}
```

**Response 503** (Service unavailable)
```json
{
  "status": "unhealthy",
  "message": "Database connection failed"
}
```

---

## 📊 Response Format

### Success Response

```json
{
  "success": true,
  "data": { /* ... */ },
  "message": "Operation completed"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": { /* additional info */ }
}
```

---

## 🔑 Authentication

**Header Format**:
```
Authorization: Bearer <token>
```

**Token obtained from**:
- `POST /auth/register`
- `POST /auth/login`

**Token expiration**: 7 days (configurable)

---

## 📝 Rate Limiting

- **Public endpoints** (auth, verify): 100 requests per 15 minutes
- **Protected endpoints**: 1000 requests per 15 minutes

Response headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1714554300
```

---

## ⚠️ Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| INVALID_INPUT | 400 | Validation failed |
| UNAUTHORIZED | 401 | No valid token |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource already exists |
| BLOCKCHAIN_ERROR | 502 | Blockchain connection failed |
| INTERNAL_ERROR | 500 | Server error |

---

## 🧪 Testing Endpoints

### With cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "role": "student"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get profile (replace TOKEN)
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer TOKEN"
```

### With Postman

1. Import the API collection
2. Set environment variables
3. Run requests

---

**API Documentation — Last updated: May 1, 2026**

