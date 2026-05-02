# 🚀 Blockchain DiploChain — Deployment Guide

**Déploiement des smart contracts DiploChain**

---

## Préparation

- Vérifier que les tests passent
- Configurer `INFURA_API_KEY` et `DEPLOYER_PRIVATE_KEY`
- Mettre le réseau target dans `.env`

## Réseaux supportés

- Sepolia (testnet)
- Mainnet (production)

## Déploiement local

```bash
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

## Déploiement Sepolia

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

## Vérification des contrats

```bash
npx hardhat verify --network sepolia <contractAddress> [args]
```

## Bonnes pratiques

- Ne jamais pousser la clé privée dans Git
- Logging minimal pour les transactions
- Documenter les adresses de contrat
- Vérifier l’état après chaque déploiement

## Post-déploiement

- Mettre à jour `.env.example`
- Partager les adresses de contrat avec le backend
- Vérifier les transactions sur Etherscan

---

**Blockchain deployment ready**
