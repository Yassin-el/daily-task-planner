# Containerisation du projet TaskFlow avec Docker

Ce document explique comment containeriser et exécuter l'application TaskFlow avec Docker.

## Prérequis

- Docker installé sur votre machine
- Git pour cloner le dépôt (si nécessaire)

## Structure des fichiers Docker

Le projet contient les fichiers suivants pour la containerisation:

- `Dockerfile`: Configuration pour construire l'image Docker
- `.dockerignore`: Liste des fichiers et dossiers à exclure lors du build
- `nginx.conf`: Configuration Nginx pour servir l'application React

## Construction de l'image Docker

Pour construire l'image Docker, exécutez la commande suivante à la racine du projet:

```bash
docker build -t taskflow-app .
```

Cette commande va:
1. Construire l'application React (étape de build)
2. Créer une image optimisée avec Nginx pour servir les fichiers statiques

## Lancement du conteneur

Pour démarrer un conteneur à partir de l'image, exécutez:

```bash
docker run -p 8080:80 -d --name taskflow taskflow-app
```

Cette commande va:
- Démarrer un conteneur nommé "taskflow"
- Mapper le port 8080 de votre machine au port 80 du conteneur
- Exécuter le conteneur en arrière-plan (-d)

L'application sera accessible à l'adresse: http://localhost:8080

## Gestion du conteneur

### Arrêter le conteneur
```bash
docker stop taskflow
```

### Redémarrer le conteneur
```bash
docker start taskflow
```

### Supprimer le conteneur
```bash
docker rm taskflow
```

### Voir les logs du conteneur
```bash
docker logs taskflow
```

## Notes additionnelles

- L'application utilise Nginx comme serveur web pour servir les fichiers statiques
- La configuration Nginx gère les routes React (SPA) correctement
- Les fichiers statiques sont mis en cache pour améliorer les performances 