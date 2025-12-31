# DentalCare - Plateforme de Gestion de Cabinet Dentaire 🦷

Une application web moderne pour la gestion de rendez-vous dentaires, développée avec React, TypeScript et Tailwind CSS. Cette interface frontend est conçue pour se connecter à un backend Java EE (JBoss/Wildfly).

## 🚀 Fonctionnalités

### 🏥 Pour les Patients
- **Inscription & Connexion** : Création de compte patient sécurisée.
- **Prise de Rendez-vous** : Formulaire interactif pour choisir un dentiste, une date et un motif.
- **Tableau de Bord (Mon Dossier)** : 
  - Affichage des informations personnelles (État civil, adresse, groupe sanguin, etc.).
  - Historique et liste des rendez-vous à venir.
  - Bouton de déconnexion sécurisé.
- **Informations** : Accès à la liste des services médicaux et aux publications du cabinet.

### 👨‍⚕️ Pour le Personnel (Dentistes / Aide-Soignants)
- **Espace Professionnel** :
  - Tableau de bord affichant les informations du profil.
  - Liste de tous les rendez-vous planifiés ("Rendez-vous planifiés").
- **Gestion des Publications** : Création d'articles et de conseils santé pour les patients.
- **Gestion des Services** : Administration des services offerts par le cabinet.

## 🛠 Technologies Utilisées

- **Frontend** : React 18, TypeScript, Vite
- **Styling** : Tailwind CSS, Shadcn UI (Composants), Lucide React (Icônes)
- **Routing** : React Router DOM
- **HTTP Client** : Fetch API (avec utilitaire personnalisé `api.ts`)
- **Backend (Attendu)** : Java EE / Jakarta EE (API REST JAX-RS)

## ⚙️ Installation et Démarrage

### Prérequis
- Node.js (v18+ recommandé)
- npm ou yarn
- Un serveur backend Java (Wildfly/JBoss) tournant sur `localhost:8080`.

### Étapes
1.  **Cloner le projet**
    ```bash
    git clone <VOTRE_URL_GIT>
    cd dental-app
    ```

2.  **Installer les dépendances**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Lancer le serveur de développement**
    ```bash
    npm run dev
    ```
    L'application sera accessible sur `http://localhost:5173`.

## 🔗 Intégration Backend

Ce frontend est configuré pour communiquer avec une API REST sur `http://localhost:8080/Backoffice/api`.

### Entités Requises (Backend Java)

Assurez-vous que vos entités Java possèdent les champs suivants pour fonctionner avec ce frontend :

#### 1. `Patient`
- `idP` (Long)
- `nomP`, `prenomP`, `emailP`, `mdpP` (String)
- `adresseP` (String)
- `telP` (String)
- `groupSanguinP` (String, length >= 5)
- `sexeP`, `recouvrementP`, `dateNP`

#### 2. `Dentiste` (ou AideSoignant)
- `idD` (Long)
- `nomD`, `prenomD`, `emailD`, `mdpD`, `telD`
- `specialiteD` (String)
- `rendezvousList` (List) - *Attention aux boucles infinies JSON, utilisez `@JsonbTransient`*

#### 3. `Rendezvous`
- `idRv` (Long)
- `dateRv` (`Date` avec `@JsonbDateFormat("yyyy-MM-dd")` ou `LocalDate`)
- `heureRv` (String)
- `statutRv` (String)
- `detailsRv` (String)
- `patient` (ManyToOne)
- `dentiste` (ManyToOne)

#### 4. `Publication`
- `titre`, `resume`, `categorie`, `auteur` (String)
- `datePublication` (`LocalDate` / `Date`)

## 📝 Auteur
**Cheikh Ahmed** - *Étudiant ENIT*
Email : `cheikhahmed.zenvour@etudiant-enit.utm.tn`

---
© 2026 DentalCare
