# Frontend - Système de Gestion de Clinique

Application Angular 18 avec Tailwind CSS et design style GitHub

## Installation

```bash
npm install
```

## Configuration

L'API backend doit être accessible sur `http://localhost:3000`

Modifier `src/environments/environment.ts` si nécessaire.

## Démarrage

```bash
ng serve
```

L'application sera disponible sur `http://localhost:4200`

## Fonctionnalités

- ✅ Authentification JWT (Login/Register)
- ✅ Dashboard avec statistiques
- ✅ Gestion des patients (CRUD)
- ✅ Gestion des médecins (CRUD)
- ✅ Gestion des rendez-vous (CRUD)
- ✅ Recherche et pagination
- ✅ Design GitHub-style (dark theme)
- ✅ Responsive design

## Structure

```
src/app/
├── core/                    # Services, Guards, Interceptors
│   ├── services/
│   ├── guards/
│   └── interceptors/
├── modules/                 # Feature modules
│   ├── auth/
│   ├── dashboard/
│   ├── patients/
│   ├── medecins/
│   └── rendez-vous/
└── shared/                  # Composants réutilisables
    ├── components/
    └── models/
```

## Build production

```bash
ng build --configuration production
```

Les fichiers seront dans `dist/clinique-frontend/`
