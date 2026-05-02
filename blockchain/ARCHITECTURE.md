# 🏗️ Blockchain DiploChain — Architecture

**Architecture du module blockchain**

---

## Objectif

Décrire la conception des smart contracts, le flux d’émission et de vérification, et l’intégration avec le backend.

## Structure des contrats

- `DiplomaIssuer.sol`
- `DiplomaVerifier.sol`
- `interfaces/` (si nécessaire)
- `libraries/` (pour fonctions utilitaires)

## `DiplomaIssuer.sol`

### Responsabilités
- Émettre un diplôme
- Stocker les métadonnées nécessaires
- Émettre un event d’émission

### Fonctions principales
- `issueDiploma(address recipient, string memory diplomaHash, string memory metadata)`
- `getDiploma(bytes32 diplomaHash)`

## `DiplomaVerifier.sol`

### Responsabilités
- Vérifier l’authenticité d’un diplôme
- Retourner l’état de validité

### Fonctions principales
- `verifyDiploma(bytes32 diplomaHash)`
- `isValid(bytes32 diplomaHash)`

## Rôles et contrôle d’accès

- `OWNER` ou `ADMIN`
- `ISSUER_ROLE`
- `VERIFIER_ROLE`

### Pattern recommandé

- Utiliser `AccessControl` de OpenZeppelin
- Restreindre `issueDiploma` aux institutions autorisées
- Restreindre la vérification aux services autorisés

## Flux de transaction

1. Le backend appelle `issueDiploma` avec les données du diplôme.
2. Le contrat enregistre le hash et émet un event.
3. Le backend écoute l’event ou vérifie le statut on-chain.
4. Le mobile/frontend appelle le backend pour vérifier le diplôme.

## Intégration backend

- Utiliser `web3.js` ou `ethers.js`
- `WEB3_PROVIDER` dans le backend
- Adresses de contrat dans `.env`
- Signature de transaction côté backend avec clé privée sécurisée

## Sécurité

- Ne jamais hardcoder les clés privées
- Utiliser `require` pour chaque validation
- Vérifier l’authenticité des addresses
- Limiter les actions sensibles aux rôles

## Tests

- Tests unitaires de contrats
- Scénarios d’émission et de vérification
- Cas d’erreur : duplicate diploma, invalid hash, unauthorized issuer

## Déploiement

- Déployer d’abord en **Sepolia**
- Vérifier les adresses de contrat
- Documenter les adresses dans `.env.example`
- Préparer la migration vers **Mainnet**

---

**Architecture blockchain prête**
