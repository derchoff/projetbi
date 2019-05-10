# projetbi
Projet bi miage lyon
## Edition du fichier README.md
Pour éditer ce fichier veuillez vous servir de la documentation GitHub : https://docs.gitlab.com/ee/user/markdown.html
## Technologies Utilisées
### Jobs d'intégration des données dans l'entrepôt
Les jobs d'intégration ont été développés avec __Talend Open Studio Data Community Edition__ .
Il est téléchargeable à cette adresse : https://fr.talend.com/products/data-integration-manuals-release-notes/
### Composants Talend additionnels 
Dans le dossier [components](/TALEND/components/) il y a une liste de composant Additionel qui sont utilisés pour l'intégration depuis des fichiers Excel.
Pour les installer il faut suivre la procédure : https://help.talend.com/reader/2AWmA~w4VvlfP3JC7dTR2w/root
C'est à dire : Menu Windows> Preferences > Talend > Component, dans la fenêtre il faut choisir le chemin vers le dossier "components" du workspace.
### Fichier Excel prêts
Dans le dossier [fichiers excel prêts](/fichiers%20excel%20prêts/) vous trouverez l'ensemble des fichiers Excel prêts à fonctionner avec les jobs Talend.
Il y a une fichier Excel de ventes par mois dans le dossier.
### Entrepôt des données
Le SGBD utilisé est MySQL version 8.
Le script SQL de création de la base de donnée est téléchargeable depuis ce projet GitHub : [MCD](BDD/MCD_2019_04_28.sql).

Le dossier BDD contient un fichier sql pour le [MCD](BDD/MCD_2019_04_28.sql) et un fichier sql [DUMP](BDD/dump_2019_04_28.sql) pour la créatino du schéma + insertion des données 

### Tableau de bord
Le dossier [Tableau](/Tableau/) contient les fichiers des tableau de bord développés avec Tableau software.

### Le webservice pour l'intégration des fichiers Excel
Le dossier [web-service](/web-service/) contient le webservice développé avec netbeans pour la livraison des fichiers Excel.

