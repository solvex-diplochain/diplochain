# 🧠 Blockchain DiploChain — Conventions de code

**Guidelines pour le développement Solidity et Web3**

---

## Principes

- Sécurité avant tout
- Simplicité et clarté
- Contrôle strict des accès
- Tests exhaustifs
- Documentation claire

## Styles Solidity

- Version : `pragma solidity ^0.8.0;`
- Nommage : contrats en `PascalCase`
- Variables : `camelCase`

## Sécurité

- Toujours utiliser `require` pour valider les entrées
- Protéger les fonctions critiques avec `onlyOwner` ou `AccessControl`
- Ne jamais stocker de données sensibles inutilement
- Éviter les integer overflows grâce à Solidity ^0.8

## Contrôle d’accès

- Utiliser OpenZeppelin `AccessControl`
- Définir : `ISSUER_ROLE`, `VERIFIER_ROLE`, `DEFAULT_ADMIN_ROLE`
- Restreindre les fonctions de mint/issue et verification

## Testing

- Tester tous les cas : succès, échec, accès non autorisé
- Vérifier les events
- Tester les reverts

## Structure du contrat

- `event DiplomaIssued(...)`
- `event DiplomaVerified(...)`
- `struct Diploma` avec hash, issuer, timestamp
- `mapping(bytes32 => Diploma)`
- `function issueDiploma(...)`
- `function verifyDiploma(...)`

## Recommandations Web3

- Gérer correctement le provider
- Signer les transactions côté backend uniquement
- Utiliser `ethers.js` ou `web3.js` côté server
- Vérifier le gas estimé

## Développement backend

- Séparer la logique Web3 dans `blockchain/`
- Ne pas mixer la logique métier avec les appels Web3
- Gérer les erreurs de transaction proprement

## Bonnes pratiques de commit

- Messages clairs
- Commits atomiques
- Pas de secrets dans le code

---

**Blockchain code quality ready**
