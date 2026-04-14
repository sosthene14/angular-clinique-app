# Backend - Système de Gestion de Clinique

API REST avec Express + TypeScript + JWT + MySQL

## Installation

```bash
npm install
```

## Configuration

1. Créer un fichier `.env` à partir de `.env.example`
2. Configurer les variables de base de données MySQL
3. Créer la base de données : `CREATE DATABASE clinique_db;`

## Démarrage

```bash
# Mode développement
npm run dev

# Build production
npm run build
npm start
```

## Endpoints API

### Authentification
- POST `/api/auth/register` - Créer un compte
- POST `/api/auth/login` - Se connecter (retourne JWT)

### Patients (protégé par JWT)
- GET `/api/patients?page=0&size=10` - Liste paginée
- GET `/api/patients/search?keyword=ali` - Recherche
- GET `/api/patients/:id` - Détail
- POST `/api/patients` - Créer
- PUT `/api/patients/:id` - Modifier
- DELETE `/api/patients/:id` - Supprimer

### Médecins (protégé par JWT)
- GET `/api/medecins?page=0&size=10` - Liste paginée
- GET `/api/medecins/search?keyword=cardio` - Recherche
- GET `/api/medecins/:id` - Détail
- POST `/api/medecins` - Créer
- PUT `/api/medecins/:id` - Modifier
- DELETE `/api/medecins/:id` - Supprimer

### Rendez-vous (protégé par JWT)
- GET `/api/rdv?page=0&size=10` - Liste paginée
- GET `/api/rdv?statut=EN_ATTENTE` - Filtrer par statut
- GET `/api/rdv/:id` - Détail
- POST `/api/rdv` - Créer
- PUT `/api/rdv/:id` - Modifier
- DELETE `/api/rdv/:id` - Supprimer

### Dashboard (protégé par JWT)
- GET `/api/dashboard/stats` - Statistiques globales

## Test avec Postman

1. Créer un compte : POST `/api/auth/register`
2. Se connecter : POST `/api/auth/login` → copier le token
3. Ajouter le header `Authorization: Bearer <token>` pour les autres requêtes
