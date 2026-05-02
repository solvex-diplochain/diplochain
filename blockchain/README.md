# DiploChain — Blockchain

Ce dossier contient le smart contract DiploChain développé avec Hardhat. Il permet l'émission et la vérification sécurisée des diplômes universitaires sur la blockchain Ethereum.

## Architecture

Le système se compose de trois contrats principaux :

- **`DiplomaContract.sol`**: Le contrat central qui gère le cycle de vie des diplômes.
- **`IssuerRegistry.sol`**: Gère les adresses autorisées à émettre des diplômes (universités, grandes écoles).
- **`VerifierRegistry.sol`**: Gère les adresses autorisées à vérifier les diplômes (employeurs, organismes de certification).

## Prérequis

Assurez-vous d'avoir installé Node.js (>= 18) et npm :

```bash
# Vérifier les versions
node --version
npm --version
```

## Installation

Clonez ce dépôt et installez les dépendances Hardhat :

```bash
mkdir -p ~/Developpement/Solvex/diplochain/blockchain
cd ~/Developpement/Solvex/diplochain/blockchain
git clone <repository-url>
npm install
```

## Configuration

Configurez Hardhat en copiant le fichier d'exemple :

```bash
cp .env.example .env

# Éditez .env avec vos clés privées et URLs
# Par défaut:
# RPC_URL=http://127.0.0.1:8545
# PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

## Compilation

Compilez les contrats :

```bash
npx hardhat compile
```

## Déploiement

Déployez les contrats sur le réseau Hardhat local :

```bash
npx hardhat run scripts/deploy.js --network localhost

# Notez les adresses des contrats déployés
# Ex: DiplomaContract at: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

Pour déployer sur un autre réseau (testnet) :

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

## Tests

Exécutez les tests unitaires :

```bash
npx hardhat test
```

## Utilisation

### Émettre un diplôme

```javascript
const { ethers } = require("hardhat");

const diplomaContractAddress = "0x...";
const diploma = await ethers.getContractAt("DiplomaContract", diplomaContractAddress);

const tx = await diploma.issueDiploma(
  studentAddress,
  "Jean Dupont",
  "2023-JKZ-001",
  "Licence en Informatique",
  "Université de Ouagadougou",
  "https://hash-of-diploma-pdf"
);
await tx.wait();

console.log("Diplôme émis avec succès !");
```

### Vérifier un diplôme

```javascript
const { ethers } = require("hardhat");

const diplomaContractAddress = "0x...";
const diploma = await ethers.getContractAt("DiplomaContract", diplomaContractAddress);

const isValid = await diploma.verifyDiploma(
  studentAddress,
  "2023-JKZ-001",
  "https://hash-of-diploma-pdf"
);

console.log(`Le diplôme est ${isValid ? "valide" : "invalide"}`);
```

## Structure du projet

```
blockchain/
├── artifacts/            # Contrats compilés
├── cache/                # Fichiers temporaires
├── contracts/            # Fichiers Solidity
│   ├── DiplomaContract.sol
│   ├── IssuerRegistry.sol
│   └── VerifierRegistry.sol
├── hardhat.config.js   # Configuration Hardhat
├── scripts/              # Scripts de déploiement
├── test/                 # Tests unitaires
└── .env                 # Variables d'environnement
```

## Documentation complète

Pour une documentation complète, consultez :

- [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture du système
- [SETUP.md](SETUP.md) - Instructions de configuration
- [DEPLOYMENT.md](DEPLOYMENT.md) - Instructions de déploiement
- [TESTING.md](TESTING.md) - Tests unitaires
- [COMPLETE_DOCUMENTATION.md](COMPLETE_DOCUMENTATION.md) - Documentation complète
- [API.md](API.md) - Interface API Hardhat
- [SKILL.md](SKILL.md) - Compétences acquises

## Licence

Ce projet est développé par DiploChain.

## Contribuer

Voir [ARCHITECTURE.md](ARCHITECTURE.md) pour les lignes directrices.

---

**Contact:** [EMAIL_ADDRESS]
**Site web:** https://diplochain.solvex-tech.com
