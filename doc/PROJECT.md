---
title: Simulateur de trafic
subtitle: Projet tuteuré I.U.T. de Rodez, INFO1S2 2020-2021
author: Sujet proposé par Johnny Accot
date: \today{}
lang: fr-FR
documentclass: scrartcl
abstract: Le but de ce projet est de développer un simulateur simplifié de trafic automobile. Il s'agit d'un projet orienté Web, en « javascript orienté objets », avec un soupçon de 3D. Il offre une initiation à la cartographie, à la simulation « temps réel » et à la programmation asynchrone, et pourrait intéresser les étudiants qui envisagent une carrière dans le développement d'applications Web/mobiles ou cartographiques, ou de jeux vidéos. Il est adapté à un groupe de 3 à 5 étudiants curieux et motivés dont au moins un aurait une petite expérience de javascript ou de python, ou qui auraient un fort désir d'apprendre des technologies Web modernes.
header-includes:
  - \usepackage{subcaption}
  - \usepackage{graphicx}
...

# Présentation

L'idée du projet est de mettre en pratique la notion d'objets, assez littéralement, sous la forme de voitures. En invoquant le constructeur de voitures avec certaines options, on va créer une multitude de petites voitures virtuelles que l'on va pouvoir piloter en utilisant leurs méthodes, et dont on va observer l'état au travers de leurs attributs.

Pour que ce soit plus réaliste, nous placerons ces voitures sur une carte réelle et leur ferons suivre des itinéraires similaires à ceux fournis par les système de navigation embarqués. Les points de départ et d'arrivée seront des adresses réelles.

Les voitures auront un comportement simplifié mais réaliste dans leur dynamique. On pourra les faire accélérer ou décélérer, et elles auront une inertie : si l'on pause la simulation à un moment, toutes les voitures vont décélérer jusqu'à s'arrêter ; si on la redémarre, les voitures accéléreront jusqu'à atteindre leur vitesse limite.

On réfléchira enfin aux stratégies anti-collision. Par exemple, si l'on arrête un véhicule sur une route, ceux qui le suivent devraient ralentir puis s'arrêter naturellement, et l'on verrait se former un embouteillage. Si l'on fait repartir le véhicule de tête, tous les véhicules qui suivent devraient repartir. Si deux véhicules vont se croiser à une intersection et se percuter, on pourrait aussi simuler la priorité à droite : le véhicule qui n'a pas la priorité s'arrêterait, laisserait passer le véhicule prioritaire, puis repartirait.

Le projet pourrait être poursuivi de plusieurs manières : une voiture rapide pourrait dépasser une voiture plus lente si personne ne vient en face ; une voiture pourrait faire une sortie de route si elle prend un virage trop vite ; on pourrait mettre en place un système de feux de circulation ou utiliser les indications de vitesse présentes dans les cartes libres, créer des profils de conducteurs prudents ou dangereux, ou avoir des modèles 3D réalistes pour les voitures, etc. Néanmoins, si l'on parvient à implémenter une gestion même minimale de l'anti-collision, ce serait déjà très satisfaisant pour un projet de première année.

# Application à développer

L'application sera hébergée dans une page Web statique simple (qui sera fournie aux étudiants) qui chargera un unique module Javascript (écrit par les étudiants) et l'exécutera. Ce script initialisera une carte en ligne traditionnelle, centrée sur Rodez, avec le réseau routier.

Le script définira des classes Javascript globales qui seront accessibles dans la console Javascript du navigateur. S'il est possible d'ajouter un panneau dans la page avec la liste des voitures existantes et leur état actuel, c'est dans la console que les voitures seront construites et pilotées en utilisant leurs méthodes.

On gérera un carnet d'adresses réelles (numéro et nom de rue, code postal, ville, pays) qui seront résolues en utilisant un service en ligne pour obtenir une latitude et une longitude. On utilisera également un service en ligne pour trouver une trajectoire effective entre deux coordonnées terrestres.

Une voiture aura une géométrie parallélépipédique et une couleur fixes, une certaine cylindrée (qui déterminera sa vitesse maximale et ses accélérations), une adresse de départ et une orientation initiale. Les étudiants pourront proposer d'autres propriétés qui leur semblent pertinentes. Une fois créée et localisée, la voiture apparaîtra sur la carte sous la forme d'un parallélépipède dans sa couleur réelle et orientée correctement. Elle est ajoutée alors à la collection de voitures gérées par le simulateur et commencera à se déplacer si la simulation est active.

À chaque moment, on pourra commander à une voiture de changer de destination et de se rendre à une certaine adresse ou coordonnée. Elle calculera alors sa nouvelle trajectoire (qui pourra être affichée sur la carte dans la même couleur qu'elle) et s'engagera sur cette route. Si elle est à l'arrêt, elle démarrera et prendra la route indiquée ; si elle est déjà en route, elle abandonnera sa trajectoire actuelle et se dirigera vers la nouvelle destination.

On doit pouvoir contrôler la vitesse d'une voiture en appliquant une décélération ou une accélération ponctuelle ou pendant un certain temps, tout en ne dépassant pas la vitesse limite du véhicule, ni sa capacité d'accélération. À tout moment, on doit pouvoir avoir accès à la vitesse actuelle du véhicule, son accélération, sa destination, et autres propriétés que les étudiants trouveront utiles. Toute initiative pour améliorer le réalisme de la simulation, comme ralentir dans les courbes, sera appréciée.

Les étudiants seront assistés dans la mise en place de la carte ainsi que pour les fonctions de résolution d'adresses et de routes. La figure \ref{fig:screenshots} montre deux captures d'écran d'une maquette du projet avec une seule voiture. Noter que la 3D est purement décorative ici ; les algorithmes seront effectivement en 2D.

\begin{figure}
\centering
\begin{subfigure}{.5\textwidth}
  \centering
  \includegraphics[width=6cm]{traffic.png}
  \caption{Sans bâtiments}
\end{subfigure}%
\begin{subfigure}{.5\textwidth}
  \centering
  \includegraphics[width=6cm]{traffic3d.png}
  \caption{Avec un rendu 3D des bâtiments}
\end{subfigure}
\caption{Exemple de trajectoire pour une voiture}
\label{fig:screenshots}
\end{figure}

# Travail à réaliser

Il faudra :

- établir un cahier des charges précis ;
- réaliser un diagramme de cas d'utilisation UML ;
- faire une description écrite des cas d’utilisation ;
- réaliser la conception de l'application en utilisant notamment un diagramme de classes UML ;
- développer l'application comme un module Javascript orienté objet (ECMA2021+, compatible avec Chrome 86+), ainsi que des programmes de tests unitaires les plus complets possible ;
- réaliser des tests d'intégration.

# Documents à rendre

À l'issue du projet, un dossier technique devra être rendu. Il comportera :

- le cahier des charges, les documents d'analyse, les spécifications détaillées ;
- un document de conception intégrant le diagramme de classes et des explications pour les éléments les plus complexes ;
- la répartition des tâches au sein de l'équipe ;
- la liste des objectifs atteints et non atteints ;
- un dossier de tests comportant :
  - le code source des programmes écrits pour réaliser les tests unitaires ;
  - le résultat de l'exécution de ces programmes : des copies d'écran et des explications ;
  - les scénarios de tests (avec les résultats) effectués pour tester globalement l'application ;
  - des exemples de code source bien écrit et commenté, avec des explications rédigées en plus des commentaires présents dans le code. Il ne faut pas insérer dans le dossier la totalité du code source, mais seulement une vingtaine de pages. Il vous appartient de sélectionner le code source le plus pertinent ;
- un manuel utilisateur ;
- un bilan.

La qualité de la rédaction (clarté, précision, mise en forme, orthographe) sera prise en compte dans l'évaluation du projet, ainsi que la rédaction éventuelle des commentaires et l'utilisation de variables en anglais.

# Documents numériques à déposer sur le serveur

- tout le code source du projet, y compris les programmes de test ;
- un exécutable de l'application ;
- un fichier au format `pdf` correspondant au dossier décrit dans la section précédente.

# Bonus

Si le projet est suffisamment bien réalisé, il serait possible de le mettre en démonstration sur un serveur public de l'IUT pour qu'il soit consultable sur l'internet, de mettre le code source dans un dépôt logiciel en ligne pour qu'il puisse être amélioré au fil du temps, et d'en créer un paquetage Linux.
