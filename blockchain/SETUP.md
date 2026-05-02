# 🛠️ Blockchain DiploChain — Setup Guide

**Installation et configuration du module blockchain**

---

## ✅ Prérequis

- Node.js 18+
- npm 9+
- Git
- Hardhat
- Infura ou Alchemy account

## 1️⃣ Cloner le projet

```bash
cd c:\Users\kosac\diplochain\blockchain
npm install
```

## 2️⃣ Installer les dépendances

```bash
npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers dotenv chai mocha
```

## 3️⃣ Configurer `.env`

Copier :

```bash
cp .env.example .env
```

### Exemple `.env`

```env
NETWORK=sepolia
INFURA_API_KEY=YOUR_INFURA_KEY
DEPLOYER_PRIVATE_KEY=0x0000000000000000000000000000000000000000000000000000000000000000
CONTRACT_ISSUER_ADDRESS=0x0000000000000000000000000000000000000000
CONTRACT_VERIFIER_ADDRESS=0x0000000000000000000000000000000000000000
```

## 4️⃣ Lancer les tests

```bash
npx hardhat test
```

## 5️⃣ Déployer sur Sepolia

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

## 6️⃣ Vérifier les contrats

```bash
npx hardhat verify --network sepolia <contractAddress> [constructorArguments]
```

---

**Blockchain prêt pour le développement**
