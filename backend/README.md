# 🌐 DiploChain Backend API

DiploChain est une solution révolutionnaire de certification académique basée sur la blockchain, conçue pour éliminer la fraude aux diplômes et simplifier le processus de vérification pour les employeurs.

##  Description
L'API DiploChain sert de "cerveau" à l'application. Elle gère l'authentification sécurisée, communique avec les contrats intelligents sur la blockchain Ethereum (Hardhat), stocke les documents sur IPFS et maintient une base de données MongoDB pour les métadonnées et la gestion des utilisateurs.

##  Technologies utilisées
- **Node.js & Express** : Serveur d'API robuste et scalable.
- **MongoDB & Mongoose** : Stockage des métadonnées des utilisateurs et des diplômes.
- **Web3.js & Ethers.js** : Interaction avec la blockchain.
- **IPFS (Pinata/Infura)** : Stockage décentralisé des fichiers PDF des diplômes.
- **JWT (JSON Web Tokens)** : Authentification sécurisée par rôles.
- **Nodemailer** : Notifications automatiques par email.
- **Multer** : Gestion des uploads de fichiers.

##  Installation et Configuration

1. **Cloner le projet** :
   ```bash
   cd backend
   npm install
   ```

2. **Configuration des variables d'environnement** :
   Créez un fichier `.env` à la racine du dossier `backend` (utilisez `.env.example` comme modèle) :
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/diplochain
   JWT_SECRET=votre_secret_jwt
   FRONTEND_URL=http://localhost:5173
   BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
   ```

3. **Lancer le serveur** :
   ```bash
   # Mode développement (avec nodemon)
   npm run dev
   ```

4. **Initialiser l'Admin par défaut** :
   ```bash
   node seed.js
   ```
   *Accès par défaut : admin@diplochain.com / AdminPassword123!*

##  Fonctionnalités principales
- **Gestion Multi-Rôles** : Systèmes distincts pour Étudiants, Institutions, Employeurs et Administrateurs.
- **Ancrage Blockchain** : Génération de hashs uniques et enregistrement sur la blockchain.
- **Stockage Décentralisé** : Upload automatique des scans de diplômes sur IPFS.
- **Vérification en Temps Réel** : API de vérification double (DB + On-Chain).
- **Import de masse** : Support des fichiers Excel/CSV pour l'importation massive d'étudiants.
- **Tableau de Bord Admin** : Validation et gestion des institutions académiques.

##  Structure du projet
- `src/controllers/` : Logique métier des APIs.
- `src/models/` : Schémas de données Mongoose.
- `src/routes/` : Définition des points d'entrée API.
- `src/services/` : Services tiers (Blockchain, IPFS, Email).
- `src/blockchain/` : ABIs et interactions avec les contrats.
