# 🧪 Blockchain DiploChain — Testing Guide

**Guide de tests pour le module blockchain**

---

## Outils recommandés

- `hardhat`
- `ethers`
- `chai`
- `mocha`

## Installation

```bash
npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers chai mocha
```

## Exécution des tests

```bash
npx hardhat test
```

## Tests unitaires

### Exemple : `DiplomaIssuer`

```js
const { expect } = require('chai');

describe('DiplomaIssuer', function () {
  it('should issue a diploma', async function () {
    // setup
  });
});
```

## Scénarios à couvrir

- Émission d’un diplôme
- Vérification d’un diplôme
- Tentative d’émission par un utilisateur non autorisé
- Vérification d’un diplôme inexistant
- Double émission d’un même diplôme

## Tests de sécurité

- `onlyIssuer` et `onlyVerifier`
- Rejet des entrées invalides
- Limitation des accès

## Test d’intégration

- Déployer en local
- Appeler les contrats via le backend
- Vérifier les réponses

## Commandes utiles

```bash
npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js --network sepolia
```

## Meilleures pratiques

- Mocker les adresses dans les tests
- Utiliser des fixtures
- Vérifier les events
- Couvrir les reverts

---

**Blockchain testing ready**
