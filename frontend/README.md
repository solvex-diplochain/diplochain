#  DiploChain Frontend — Interface Blockchain Premium

Interface utilisateur moderne et réactive pour la plateforme DiploChain, permettant une interaction fluide avec le système de certification académique.

##  Descriptions
Le frontend de DiploChain est conçu pour offrir une expérience utilisateur haut de gamme (Glassmorphism). Il permet aux institutions d'émettre des diplômes, aux étudiants de gérer leurs titres, aux employeurs de vérifier des candidats et aux administrateurs de piloter le réseau.

##  Technologies utilisées
- **React 18** : Bibliothèque UI moderne.
- **Vite** : Outil de build ultra-rapide.
- **Framer Motion** : Animations fluides et transitions dynamiques.
- **Lucide React** : Bibliothèque d'icônes vectorielles cohérente.
- **Axios** : Client HTTP pour communiquer avec l'API Backend.
- **QR Code React** : Génération instantanée de codes de vérification.
- **Vanilla CSS** : Design système personnalisé avec Glassmorphism.

##  Installation et Utilisation

1. **Cloner le projet** :
   ```bash
   cd frontend
   npm install
   ```             

2. **Lancer l'application** :
   ```bash
   npm run dev
   ```
   L'application sera accessible sur [http://localhost:5173](http://localhost:5173).

##  Fonctionnalités par Profil

###  Étudiant
- Visualisation des diplômes certifiés.
- Partage via lien sécurisé ou **QR Code**.
- Statistiques de consultations.

### Institution (Université)
- Formulaire d'émission de diplômes avec upload PDF.
- Importation massive d'étudiants via fichiers Excel/CSV.
- Historique complet des certifications émises.

###  Employeur
- Recherche de candidats par email ou hash de diplôme.
- Vérification instantanée de l'authenticité (On-Chain).
- Historique des vérifications effectuées.

### Administrateur
- Gestion et validation des institutions académiques.
- Vue globale sur les statistiques du réseau.
- Contrôle de la sécurité des accès.

##  Design System
L'application utilise un thème **Premium Dark** avec :
- **Backdrop-filter** pour les effets de verre.
- **Gradients dynamiques** pour les boutons et titres.
- **Layouts adaptatifs** pour une utilisation sur desktop et tablette.
- **Feedbacks visuels** immédiats pour les actions blockchain.

##  Structure du projet
- `src/components/` : Composants réutilisables (Navbar, Cards, Stats).
- `src/context/` : Gestion globale de l'état (Authentification).
- `src/pages/` : Vues principales de l'application.
- `src/services/` : Configuration Axios et appels API centralisés.
https://drive.google.com/drive/folders/1YfebNOPRAlSpxIft-ANV6als0G5cbyku?usp=drive_link

Le projet a été réalisé en 48h, et c'est un prototype fonctionnel. La version déployée est une version simplifiée.