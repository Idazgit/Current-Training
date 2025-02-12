# Configuration initiale

git config --global user.name "Votre Nom" # Définir votre nom d'utilisateur
git config --global user.email "email@ex.com" # Définir votre email

# Commandes de base

git init # Initialiser un nouveau dépôt Git
git clone <url> # Cloner un dépôt distant
git status # Voir l'état des fichiers
git add <fichier> # Ajouter un fichier à l'index
git add . # Ajouter tous les fichiers modifiés à l'index

# Commits

git commit -m "message" # Créer un commit avec un message
git commit -am "message" # Add + commit pour les fichiers déjà suivis

# Branches

git branch # Voir toutes les branches
git branch <nom> # Créer une nouvelle branche
git checkout <branche> # Changer de branche
git checkout -b <nom> # Créer et basculer sur une nouvelle branche
git merge <branche> # Fusionner une branche dans la branche actuelle

# Remote (travail distant)

git remote add origin <url> # Ajouter un dépôt distant
git push origin <branche> # Pousser les commits vers le dépôt distant
git pull origin <branche> # Récupérer et fusionner les changements distants
git fetch # Récupérer les changements sans fusionner

# Historique et différences

git log # Voir l'historique des commits
git log --oneline # Historique compact
git diff # Voir les modifications non indexées
git diff --staged # Voir les modifications indexées

# Annulation et modification

git reset HEAD <fichier> # Désindexer un fichier
git checkout -- <fichier> # Annuler les modifications d'un fichier
git reset --hard HEAD~1 # Annuler le dernier commit
git revert <commit> # Créer un nouveau commit qui annule un commit précédent

# Stash (remisage)

git stash # Remiser les modifications en cours
git stash pop # Appliquer et supprimer le dernier stash
git stash list # Lister tous les stash
git stash drop # Supprimer le dernier stash

# Tags (étiquettes)

git tag <nom> # Créer un tag léger
git tag -a <nom> -m "message" # Créer un tag annoté
git push origin --tags # Pousser tous les tags
