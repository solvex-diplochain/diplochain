# 🧭 Blockchain DiploChain — SKILL.md

**Feuille de route blockchain 8 semaines pour Marc NANA**

---

## Vue d’ensemble

Ce document décrit les tâches blockchain par semaine pour DiploChain.

## Semaine 1-2 — Setup & Base des contrats

### Objectifs
- Initialiser Hardhat
- Créer les premiers contrats
- Définir les rôles et permissions

### Tâches
- Installer Hardhat et dépendances
- Créer `DiplomaIssuer.sol`
- Créer `DiplomaVerifier.sol`
- Ajouter `Ownable` / `AccessControl`
- Définir `issueDiploma()` et `verifyDiploma()`
- Écrire les premiers tests

### Critères
- Les contrats compilent
- Les tests de base passent
- Les rôles sont définis

## Semaine 3-4 — Émission & Vérification

### Objectifs
- Implémenter la logique métier des diplômes
- Enregistrer les données nécessaires
- Vérifier les diplômes sur la blockchain

### Tâches
- Ajouter la structure de diplôme (`struct Diploma`)
- Implémenter l’issue d’un diplôme
- Stocker le hash du diplôme
- Implémenter la vérification on-chain
- Ajouter des events `DiplomaIssued` et `DiplomaVerified`

### Critères
- Un diplôme peut être émis
- Un diplôme peut être vérifié
- La donnée blockchain est traçable

## Semaine 5-6 — Intégration backend & tests

### Objectifs
- Connecter les contrats au backend
- Tester les flux end-to-end
- Documenter l’API Web3

### Tâches
- Ajouter `scripts/deploy.js`
- Ajouter `scripts/verify.js`
- Intégrer les adresses de contrat dans le backend
- Écrire des tests de contrat et d’intégration

### Critères
- Le backend peut appeler `issueDiploma`
- Les tests passent sur Sepolia
- Les adresses sont stables

## Semaine 7 — Sécurité & optimisation

### Objectifs
- Auditer le contrat
- Optimiser le gas
- Ajouter des protections

### Tâches
- Revoir les modifiers et conditions
- Vérifier les overflows / underflows
- Ajouter des tests de sécurité
- Documenter les limites de gas

### Critères
- Aucun test de sécurité ne casse
- Les fonctions critiques ont des guards
- Les coûts gas sont raisonnables

## Semaine 8 — Déploiement & documentation

### Objectifs
- Déployer en testnet
- Préparer la version production
- Finaliser la documentation

### Tâches
- Déployer sur Sepolia
- Documenter les adresses de contrat
- Mettre à jour `.env.example`
- Vérifier l’intégration backend

### Critères
- Les contrats sont déployés
- Les adresses sont publiées
- La documentation est complète

---

## Checklist

- [ ] Hardhat installé
- [ ] Contrats compilent
- [ ] Tests passés
- [ ] Intégration backend OK
- [ ] Déploiement effectué

**Blockchain DiploChain — Roadmap prête**
