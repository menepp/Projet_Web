# ProjetWeb

Notre projet consiste à gérer les compétences d'une entreprise, à la bonne gestion de ces employés et de ces missions.
Pour cela, nous avons utilisé Angular, Node.js et une base de données(PostgreSQL).
La communication entre Angular et le serveur Node utilise l'API REST et effectue les échanges sous le format JSON.
La communication entre Node et la BD se fait sous forme de requêtes SQL.

Nous avons séparé les fonctionnalitées de l'entreprise en 4 pages :

    -  la page "employés" qui gère le personnel (l'ajout de nouveaux employés, la modification de leur informations, 
    leur suppression)

    - la page "missions" qui s'occupe de créer de nouvelles missions auquelles on attribue une date 
    de début et de fin ainsi que les compétences nécessaires, qu'on peut par la suite modifier mais qui 
    permettent aussi une présélection des employés qui possèdent les compétences nécessaires à la bonne 
    résolution de la mission. Employés et compétences qu'on peut par la suite aussi supprimer.
    Nous pouvons aussi observer le cycle de vie de la mission.
    
    -  la page "dashboard" permet de rescenser les données sur les employés 
    et les compétences par mission. Elle n'est accessible que par les utilisateurs de type 'RH'. 
  
    - la page "salon" est un chat reliant les employés et RH d'une même entreprise.

Commandes à utiliser pour lancer le projet :

    - ng serve
    - node server.js

Exemple API Backend pour les employés:

    - GET /api/employes        // Récupérer tous les employés
    - POST /api/employes       // Ajouter un employé
    - PUT /api/employes/:id    // Modifier un employé
    - DELETE /api/employes/:id // Supprimer un employé

# Liste des composants et services

Composants visuels présents dans la plupart des pages :

    - Header : Logo et nom du site avec bouton de déconnexion
    - Footer : Lien vers une doc du site
    - Menu : Partie gauche de l'application pour les utilisateurs RH, permet de naviger entre les pages
    - Search-bar : composant utilisé dans employés et mission pour faire des recherches 

Page accueil :

    - Composant visuel avec un acces aux différentes pages

Page connexion :

    - Connexion avec des identifiants de la BD
    - Service auth.guard et auth.service pour gérer l'authentification des utilisateurs et leur droits d'accès

Page dashboard :

    - 2 graphiques utilisant char.js pour visualiser les données du site

Page employés :

    - Composant ajouter : ajouter un employé à la BD
    - Composant Cadre-employe : objet graphique pour représenter les employés dans l'interface
    - Le composant employé fait appel à l'interface EmployeInscription
    - Service pour l'API REST avec l'ajout, la suppression, la modification et l'affichage des employés

Page missions :

    - Composant carte-mission : template pour afficher les informations des missions
    - Composant creer-mission : creer une mission
    - Composant historique mission : affiche les missions dont la date de fin est passée
    - Service pour l'API REST avec l'ajout, la suppression, la modification et l'affichage 
    des missions ainsi que la gestion des employés sur les missions

Page salon :

    - Composant utilisant les interfaces blog et message pour que les employés d'une entreprise discutent
    - Service blog pour acceder au bon chat en fonction de l'entreprise

