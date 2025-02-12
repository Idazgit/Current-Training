# Inspection des commits

git blame <fichier> # Voir qui a modifié chaque ligne d'un fichier
git blame -L <début>,<fin> <fichier> # Blame sur une plage de lignes spécifique
git show <commit> # Voir les détails d'un commit spécifique
git show <commit>:<fichier> # Voir un fichier à un commit spécifique

# Recherche et historique avancée

git log -S "<texte>" # Rechercher du texte dans l'historique des commits
git log -p <fichier> # Voir l'historique détaillé d'un fichier
git log --follow <fichier> # Suivre l'historique à travers les renommages
git log --graph --oneline # Voir l'historique sous forme de graphe
git log --grep="<pattern>" # Rechercher dans les messages de commit

# Débogage avec bisect

git bisect start # Démarrer une session de recherche binaire
git bisect good <commit> # Marquer un commit comme bon
git bisect bad <commit> # Marquer un commit comme mauvais
git bisect reset # Terminer la session bisect

# Inspection des modifications

git diff --word-diff # Voir les différences mot par mot
git diff --cached # Voir les modifications indexées
git diff HEAD~1 HEAD # Comparer avec le commit précédent
git diff branch1...branch2 # Comparer deux branches

# Récupération et réparation

git fsck # Vérifier l'intégrité du dépôt
git reflog # Voir l'historique des actions Git
git gc # Nettoyer et optimiser le dépôt
git prune # Supprimer les objets inutilisés

# Débogage des branches

git branch --contains <commit> # Trouver les branches contenant un commit
git branch -v # Voir le dernier commit de chaque branche
git branch --merged # Voir les branches fusionnées
git branch --no-merged # Voir les branches non fusionnées

# Débogage des conflits

git status # Voir les fichiers en conflit
git diff --name-only --diff-filter=U # Lister les fichiers en conflit
git checkout --conflict=diff3 <fichier> # Voir plus de contexte dans les conflits
git merge --abort # Annuler une fusion en cours

# Outils avancés

git rev-parse HEAD # Obtenir le hash complet du commit actuel
git rev-list --count HEAD # Compter le nombre de commits
git whatchanged <fichier> # Voir l'historique des modifications d'un fichier
git verify-pack -v .git/objects/pack/\*.idx # Analyser le contenu du pack
