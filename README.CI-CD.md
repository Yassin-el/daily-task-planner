# Intégration CI/CD pour TaskFlow

Ce document décrit l'intégration CI/CD (Continuous Integration/Continuous Deployment) mise en place pour le projet TaskFlow.

## Pipeline CI/CD avec GitHub Actions

Le projet utilise GitHub Actions pour automatiser le processus de build, de test et de déploiement.

### Structure des fichiers

```
task-planner/
└── .github/
    └── workflows/
        └── ci.yml
```

### Fonctionnement du workflow

Le workflow défini dans `ci.yml` s'exécute automatiquement dans les cas suivants :
- À chaque push sur les branches `main` ou `master`
- À chaque Pull Request vers les branches `main` ou `master`

### Étapes du workflow

Le workflow est divisé en deux jobs principaux :

#### 1. Job "build-and-test"

Ce job s'exécute sur toutes les branches et comprend les étapes suivantes :

1. **Checkout du code source** - Récupération du code depuis le dépôt GitHub
2. **Configuration de Node.js** - Installation de Node.js v18
3. **Installation des dépendances** - Exécution de `npm ci` pour installer les dépendances
4. **Linting du code** - Exécution de `npm run lint` pour vérifier la qualité du code
5. **Build de l'application** - Exécution de `npm run build` pour compiler l'application
6. **Mise en cache des artefacts de build** - Stockage des fichiers générés pour une utilisation ultérieure

#### 2. Job "docker"

Ce job ne s'exécute que sur les branches `main` ou `master` et uniquement si le job "build-and-test" réussit :

1. **Checkout du code source** - Récupération du code depuis le dépôt GitHub
2. **Configuration de Docker Buildx** - Préparation de l'environnement Docker
3. **Connexion à Docker Hub** - Authentification avec les identifiants stockés dans les secrets GitHub
4. **Build et push de l'image Docker** - Construction de l'image Docker et publication sur Docker Hub

### Secrets nécessaires

Pour que le workflow fonctionne correctement, vous devez configurer les secrets suivants dans les paramètres de votre dépôt GitHub :

- `DOCKER_HUB_USERNAME` : Votre nom d'utilisateur Docker Hub
- `DOCKER_HUB_TOKEN` : Un token d'accès personnel Docker Hub (pas votre mot de passe)

## Configuration des secrets

1. Allez dans votre dépôt GitHub
2. Cliquez sur "Settings" (Paramètres)
3. Dans le menu latéral, cliquez sur "Secrets and variables" > "Actions"
4. Cliquez sur "New repository secret"
5. Ajoutez les secrets `DOCKER_HUB_USERNAME` et `DOCKER_HUB_TOKEN`

## Surveillance des workflows

Vous pouvez surveiller l'exécution de vos workflows dans l'onglet "Actions" de votre dépôt GitHub. Vous y trouverez des informations détaillées sur chaque exécution, y compris les logs et les résultats. 