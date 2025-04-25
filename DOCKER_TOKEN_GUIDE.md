# Guide de configuration des tokens Docker Hub pour GitHub Actions

Ce guide explique comment générer un token d'accès Docker Hub et le configurer comme secret dans GitHub Actions pour permettre au workflow CI/CD de publier des images Docker.

## Pourquoi utiliser un token au lieu d'un mot de passe ?

- **Sécurité** : Les tokens peuvent être révoqués individuellement sans affecter votre mot de passe principal
- **Contrôle d'accès** : Vous pouvez limiter les autorisations accordées à chaque token
- **Traçabilité** : Vous pouvez suivre quels tokens sont utilisés pour quelles actions

## Étape 1 : Générer un token d'accès Docker Hub

1. Connectez-vous à [Docker Hub](https://hub.docker.com)
2. Cliquez sur votre nom d'utilisateur dans le coin supérieur droit, puis sélectionnez **Account Settings**
3. Dans le menu de gauche, cliquez sur **Security**
4. Cliquez sur le bouton **New Access Token**
5. Donnez un nom descriptif à votre token (par exemple, "GitHub Actions CI/CD")
6. Sélectionnez les autorisations appropriées (généralement "Read, Write, Delete" pour un pipeline CI/CD)
7. Cliquez sur **Generate**
8. **IMPORTANT** : Copiez immédiatement le token généré et conservez-le dans un endroit sûr temporairement. Vous ne pourrez plus voir ce token après avoir quitté cette page.

## Étape 2 : Configurer les secrets dans GitHub

1. Accédez à votre dépôt GitHub
2. Cliquez sur l'onglet **Settings** en haut
3. Dans le menu de gauche, sélectionnez **Secrets and variables** puis **Actions**
4. Cliquez sur **New repository secret**
5. Créez un premier secret :
   - Nom : `DOCKER_HUB_USERNAME`
   - Valeur : votre nom d'utilisateur Docker Hub
6. Cliquez sur **Add secret**
7. Cliquez à nouveau sur **New repository secret**
8. Créez un second secret :
   - Nom : `DOCKER_HUB_TOKEN`
   - Valeur : le token d'accès Docker Hub que vous avez généré à l'étape 1
9. Cliquez sur **Add secret**

## Étape 3 : Vérifier le workflow GitHub Actions

Le fichier de workflow `.github/workflows/ci.yml` est déjà configuré pour utiliser ces secrets :

```yaml
- name: Login to Docker Hub
  uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKER_HUB_USERNAME }}
    password: ${{ secrets.DOCKER_HUB_TOKEN }}
```

## Tester le workflow

Pour vérifier que votre configuration fonctionne correctement :

1. Effectuez une modification dans votre code
2. Poussez les changements vers la branche principale de votre dépôt
3. Allez dans l'onglet **Actions** de votre dépôt GitHub
4. Observez le workflow en cours d'exécution
5. Si tout est configuré correctement, vous devriez voir que le job "docker" se connecte avec succès à Docker Hub et publie l'image

## Résolution des problèmes courants

### Erreur : "Error: Username and password required"

Cette erreur signifie que les secrets `DOCKER_HUB_USERNAME` et/ou `DOCKER_HUB_TOKEN` ne sont pas accessibles ou n'ont pas été définis. Vérifiez que :

1. Vous avez correctement créé les secrets dans les paramètres du dépôt (et non pas dans votre profil personnel)
2. Les noms des secrets correspondent exactement à ceux utilisés dans le workflow
3. Le workflow a les autorisations nécessaires pour accéder aux secrets

### Erreur : "Error: incorrect username / password"

Cette erreur peut survenir si :

1. Le nom d'utilisateur Docker Hub est incorrect
2. Le token d'accès est incorrect ou a expiré
3. Le token n'a pas les autorisations suffisantes pour publier des images

## Renouvellement du token

Les tokens Docker Hub ont parfois une date d'expiration. Pour renouveler un token :

1. Suivez à nouveau les étapes de la section **Étape 1** pour générer un nouveau token
2. Mettez à jour le secret `DOCKER_HUB_TOKEN` dans les paramètres de votre dépôt GitHub 