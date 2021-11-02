# traffic

[![forthebadge](http://forthebadge.com/images/badges/built-with-love.svg)](http://forthebadge.com)  

Le projet tutoré est un simulateur de trafic. Le but de ce projet est de développer un simulateur simplifié de trafic automobile. L’idée du projet est de mettre en pratique la notion d’objets, assez littéralement, sous la forme de voitures. En invoquant le constructeur de voitures avec certaines options, on va créer une multitude de petites voitures virtuelles que l’on va pouvoir piloter en utilisant leurs méthodes, et dont on va observer l’état au travers de leurs attributs. 

![Plan](https://raw.githubusercontent.com/LucasSers/traffic/master/Plan.png)

## Pour commencer

L’application est hébergée dans une page Web statique simple. Ce script initialisera une carte en ligne traditionnelle, centrée sur Rodez, avec le réseau routier. Le script définit des classes Javascript globales qui sont accessibles dans la console Javascript du navigateur.

### Pré-requis

Le projet requiert node.js et un navigateur internet.

### Installation

Il faudra accéder au dossier contenant les packages à installer ``cd frontend``.

Il faudra installer depuis l'internet les modules javascript nécessaires au projet ``npm install``.


## Démarrage

Compilez le projet avec ``npm run build``.

Pour lancer le projet, ouvrez un second terminal, allez dans traffic/frontend également, et entrez la commande ``npm run serve``.

Cela lancera un serveur Web pour servir la page HTML et le module javascript du projet.

La commande serve va vous afficher une URL (par exemple http://127.0.0.1:8000) pour visualiser le projet dans un navigateur.

### Les commandes

Avant de pouvoir entrer des commandes il faut ouvrir la console, la façon d’ouvrir la console diffère selon le navigateur que vous utilisez. Vous pouvez utiliser [ce site](https://www.alsacreations.com/astuce/lire/1436-console-javascript.html) pour trouvez comment ouvrir la console selon votre navigateur.

Chaque adresse sera de la forme : ‘rue ‘ , ’ville’ , ’pays’.

Ajouter une adresse : 
``simulation.addressBook.add(await simulation.addressBook.create(adresse)``


Récupérer une adresse aléatoire : 
``simulation.addressBook.random()``


Prendre un modèle aléatoire :
``simulation.models.random()``


Ajouter un modèle :
``simulation.models.create(model, year, brand, type, mass, length, width, height, brakeMaximumForce, enginMaximumForce)``


Ajouter un véhicule : 
``simulation.collection.create(“id”,”couleur”,”modèle”,”adresse”)``


Afficher toutes les informations sur tous les véhicules :
``simulation.collection.vehicles``


Donner une destination pour un vehicule :
``simulation.collection.vehicles.«id du vehicule».driveTo(adresse)``


Faire accélérer/décélérer un véhicule :
``simulation.collection.vehicles.«id du vehicule».setPedal = «valeur»``



## Fabriqué avec

* [Node.js](/https://nodejs.org) - JavaScript runtime
* [Mapbox](https://www.npmjs.com/package/@mapbox/rollup) - npm module
* [Turf](https://www.npmjs.com/package/@turf/turf) - npm module


## Auteurs

* [IUT de Rodez](https://www.iut-rodez.fr) - 2021
