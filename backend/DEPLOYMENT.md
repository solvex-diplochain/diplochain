# 🚀 Backend DiploChain — Deployment Guide

**Guide complet pour déployer le backend en production**

---

## 📋 Table des matières

1. [Pré-requis](#pré-requis)
2. [Staging](#staging-déploiement)
3. [Production](#production-déploiement)
4. [Monitoring](#monitoring)
5. [Troubleshooting](#troubleshooting)

---

## ✅ Pré-requis

### Avant de déployer

- [ ] Tous les tests passent (`npm test`)
- [ ] Coverage >80%
- [ ] Zero console.logs
- [ ] Code reviewed et mergé
- [ ] .env.example à jour
- [ ] README à jour
- [ ] No hardcoded secrets
- [ ] Linting passed (`npm run lint`)

### Infrastructure prête

- [ ] MongoDB Atlas cluster créé
- [ ] Infura account avec API key
- [ ] Heroku/Railway account
- [ ] Vercel (pour frontend)
- [ ] Domaine configuré
- [ ] SSL/TLS certificat

---

## 🔧 Staging — Déploiement

**Objectif** : Tester avant production

### 1. Préparer pour Staging

#### .env.staging
```env
NODE_ENV=staging
PORT=5000
API_URL=https://staging-api.diplochain.bf

MONGODB_URI=mongodb+srv://admin:password@staging-cluster.mongodb.net/diplochain

JWT_SECRET=your_staging_secret_key
JWT_EXPIRE=7d

WEB3_PROVIDER=https://sepolia.infura.io/v3/YOUR_KEY
CONTRACT_ISSUER_ADDRESS=0x... (testnet address)
CONTRACT_VERIFIER_ADDRESS=0x... (testnet address)
DEPLOYER_PRIVATE_KEY=0x... (testnet key only)

FRONTEND_URL=https://staging.diplochain.bf
```

### 2. Avec Docker

#### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src ./src

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start server
CMD ["npm", "start"]
```

#### Build et push

```bash
# Build l'image
docker build -t diplochain-backend:staging .

# Tag pour Docker Hub
docker tag diplochain-backend:staging username/diplochain-backend:staging

# Push
docker push username/diplochain-backend:staging
```

### 3. Déployer sur Heroku

#### Prérequis
- Heroku CLI installé
- Heroku account

#### Procédure

```bash
# 1. Login à Heroku
heroku login

# 2. Créer l'app
heroku create diplochain-backend-staging

# 3. Ajouter buildpacks
heroku buildpacks:add heroku/nodejs

# 4. Set environment variables
heroku config:set -a diplochain-backend-staging \
  NODE_ENV=staging \
  MONGODB_URI=mongodb+srv://... \
  JWT_SECRET=... \
  WEB3_PROVIDER=... \
  etc...

# 5. Deploy
git push heroku main

# 6. Vérifier
heroku logs -a diplochain-backend-staging --tail

# 7. Tester
curl https://diplochain-backend-staging.herokuapp.com/api/health
```

### 4. Ou déployer sur Railway

#### Procédure

```bash
# 1. Installer CLI
npm i -g railway

# 2. Login
railway login

# 3. Créer le projet
railway init

# 4. Configurer les variables
railway variable add NODE_ENV=staging
railway variable add MONGODB_URI=mongodb+srv://...
# etc...

# 5. Deploy
railway up

# 6. Voir les logs
railway logs
```

---

## 🎯 Production — Déploiement

**Objectif** : Application en production mainnet

### 1. Préparer pour Production

#### .env.production
```env
NODE_ENV=production
PORT=5000
API_URL=https://api.diplochain.bf

MONGODB_URI=mongodb+srv://admin:password@prod-cluster.mongodb.net/diplochain

JWT_SECRET=very_long_random_secret_key_min_64_chars
JWT_EXPIRE=7d

WEB3_PROVIDER=https://mainnet.infura.io/v3/YOUR_KEY
# Smart contracts déployées sur mainnet
CONTRACT_ISSUER_ADDRESS=0x... (mainnet address)
CONTRACT_VERIFIER_ADDRESS=0x... (mainnet address)

# Clé privée mainnet (ULTRA SÉCURISÉE)
# Utiliser un hardware wallet ou service sécurisé !
DEPLOYER_PRIVATE_KEY=0x...

FRONTEND_URL=https://app.diplochain.bf

LOG_LEVEL=info
LOG_FORMAT=json

# Monitoring
SENTRY_DSN=https://...@sentry.io/...
NEW_RELIC_LICENSE_KEY=...
```

### 2. Avec AWS EC2

#### Lancer une instance EC2
```bash
# AWS Console
# EC2 → Instances → Launch Instance

# Configuration recommandée
AMI: Ubuntu 22.04 LTS
Instance type: t3.small (2 vCPU, 2 GB RAM)
Storage: 50 GB SSD
Security: SSH (22), HTTP (80), HTTPS (443)
```

#### Setup sur EC2
```bash
# 1. SSH dans l'instance
ssh -i your-key.pem ec2-user@your-instance-ip

# 2. Installer Node.js
curl https://deb.nodesource.com/setup_18.x | sudo bash
sudo apt-get install -y nodejs

# 3. Installer PM2 (process manager)
npm install -g pm2

# 4. Clone le repo
git clone <repo-url> diplochain-backend
cd diplochain-backend

# 5. Install dependencies
npm ci --only=production

# 6. Setup .env
nano .env
# (Coller les valeurs production)

# 7. Start avec PM2
pm2 start src/server.js --name "diplochain-backend"
pm2 startup
pm2 save

# 8. Vérifier
pm2 logs diplochain-backend
```

### 3. Avec Docker sur AWS

```bash
# 1. Créer ECR repository
aws ecr create-repository --repository-name diplochain-backend

# 2. Build et push
docker build -t diplochain-backend:prod .
docker tag diplochain-backend:prod your-account.dkr.ecr.region.amazonaws.com/diplochain-backend:prod
docker push your-account.dkr.ecr.region.amazonaws.com/diplochain-backend:prod

# 3. Créer ECS task
# AWS Console → ECS → Task Definitions → Create

# 4. Lancer le service
# AWS Console → ECS → Clusters → Create Service
```

### 4. Configuration Nginx (Reverse Proxy)

```nginx
upstream diplochain_backend {
  server localhost:5000;
}

server {
  listen 80;
  server_name api.diplochain.bf;
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl http2;
  server_name api.diplochain.bf;

  # SSL certificates (Let's Encrypt)
  ssl_certificate /etc/letsencrypt/live/api.diplochain.bf/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/api.diplochain.bf/privkey.pem;

  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers HIGH:!aNULL:!MD5;
  ssl_prefer_server_ciphers on;

  # Gzip compression
  gzip on;
  gzip_types text/plain text/css application/json application/javascript;

  location / {
    proxy_pass http://diplochain_backend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # Timeouts
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
  }
}
```

### 5. SSL avec Let's Encrypt

```bash
# Installer Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Générer les certificats
sudo certbot certonly --standalone -d api.diplochain.bf

# Auto-renewal
sudo systemctl enable certbot.timer
```

---

## 📊 Monitoring

### Avec PM2

```bash
# Dashboard
pm2 monit

# Logs
pm2 logs

# Restarting
pm2 restart diplochain-backend
pm2 stop diplochain-backend
pm2 delete diplochain-backend
```

### Avec Sentry (Error tracking)

```javascript
// src/server.js
const Sentry = require('@sentry/node');

Sentry.init({ dsn: process.env.SENTRY_DSN });
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

### Avec New Relic (Application monitoring)

```bash
# Install
npm install newrelic

# Require en premier
# src/server.js
require('newrelic');
const express = require('express');
```

### Health checks

```bash
# Monitorez l'endpoint health
curl https://api.diplochain.bf/api/health

# Script de monitoring
#!/bin/bash
while true; do
  status=$(curl -s https://api.diplochain.bf/api/health)
  if [[ $status != *"healthy"* ]]; then
    # Alert!
    echo "Backend DOWN!" | mail -s "Alert" admin@diplochain.bf
  fi
  sleep 300  # Check every 5 minutes
done
```

---

## 🔄 Database Backup

### MongoDB Atlas

**Automated** :
- Backup automatiques quotidiens
- Rétention : 35 jours
- Restauration facile via console

### Manuel

```bash
# Backup
mongodump --uri "mongodb+srv://..." --out ./backup

# Restore
mongorestore --uri "mongodb+srv://..." ./backup
```

---

## 🔐 Sécurité Production

### Checklist sécurité

- [ ] HTTPS/SSL enabled
- [ ] JWT secrets strong (64+ chars)
- [ ] Database password strong
- [ ] Private key secured (hardware wallet)
- [ ] No console.logs
- [ ] Rate limiting active
- [ ] CORS configured
- [ ] Audit logging
- [ ] Regular dependency updates (`npm audit`)

### Commands

```bash
# Check vulnerabilities
npm audit

# Fix them
npm audit fix

# Force major updates (careful!)
npm audit fix --force
```

---

## 🚨 Troubleshooting

### Server ne démarre pas

```bash
# Vérifier les logs
pm2 logs diplochain-backend

# Vérifier port
lsof -i :5000

# Vérifier les variables
env | grep NODE_ENV
```

### Database connection error

```bash
# Tester la connection
mongosh "mongodb+srv://..."

# Vérifier l'IP whitelist MongoDB Atlas
# https://cloud.mongodb.com/v2/... → Network Access
```

### Blockchain errors

```bash
# Vérifier Infura key
curl https://sepolia.infura.io/v3/YOUR_KEY

# Vérifier addresses
node -e "console.log(process.env.CONTRACT_ISSUER_ADDRESS)"
```

### Performance issues

```bash
# Vérifier les logs
pm2 logs --lines 100

# Profiler
node --prof src/server.js
node --prof-process isolate-*.log > profile.txt
```

---

## 📈 Scaling (si besoin)

### Ajouter des instances

```bash
# PM2 cluster mode
pm2 start src/server.js -i max --name "diplochain-backend"

# Load balancing
# Nginx upstream with multiple servers
upstream backend {
  server backend1:5000;
  server backend2:5000;
  server backend3:5000;
}
```

### Caching avec Redis

```javascript
const redis = require('redis');
const client = redis.createClient();

// Cache responses
app.get('/diplomas/:id', async (req, res) => {
  const cached = await client.get(`diploma:${req.params.id}`);
  if (cached) return res.json(JSON.parse(cached));
  
  const diploma = await Diploma.findById(req.params.id);
  await client.setEx(`diploma:${req.params.id}`, 3600, JSON.stringify(diploma));
  res.json(diploma);
});
```

---

## ✅ Post-deployment checklist

- [ ] Health check passing
- [ ] Logs flowing normally
- [ ] Database connected
- [ ] Blockchain working
- [ ] Monitoring active
- [ ] Backups running
- [ ] Team notified
- [ ] Rollback plan ready

---

## 📞 Support

**Deployment issues?**

- Documentation: Check the logs
- Quick help: Slack #backend
- Emergency: Call Marc

---

**Production-ready ! 🚀**

