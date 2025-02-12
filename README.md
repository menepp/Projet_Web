# ProjetWeb

Notre projet consiste à gérer les compétences d'une entreprise, à la bonne gestion de ces employés et de ces missions. Pour cela, nous avons utilisé Angular, Node.js et une base de données(PostgreSQL).
La communication entre Angular et le serveur Node utilise l'API REST et effectue les échanges sous le format JSON. 
La communication entre Node et la BD se fait sous forme de requête SQL.


Nous avons séparé les fonctionnalitées de l'entreprise en 2 pages :

    -  la page "employés" qui gère le personnel (l'ajout de nouveaux employés, la modification de leur informations, leur suppression)

    - la page "missions" qui s'occupe de créer de nouvelles missions auquelles on attribue une date de début et de fin ainsi que les compétences nécessaires, qu'on peut par la suite modifier mais qui permettent aussi une présélection des employés qui possèdent les compétences nécessaires à la bonne résolution de la mission. Employés et compétences qu'on peut par la suite aussi supprimer.
    Nous pouvons aussi observer le cycle de vie de la mission.


Commandes à utiliser pour lancer le projet : 

    - ng serve
    - node server.js


Exemple API Backend :

    - GET /api/employes        // Récupérer tous les employés
    - POST /api/employes       // Ajouter un employé
    - PUT /api/employes/:id    // Modifier un employé
    - DELETE /api/employes/:id // Supprimer un employé

