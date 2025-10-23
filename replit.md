# Générateur d'Images - Application Python Flask

## Vue d'ensemble
Application web moderne et responsive qui permet de créer des images personnalisées de 5.8 cm de hauteur avec une largeur variable selon le contenu. L'utilisateur peut ajouter différents types d'éléments (titres, paragraphes, QR codes, images) et générer une image PNG téléchargeable.

## Fonctionnalités
- **Interface responsive** : Design mobile-first 100% responsive avec design sobre
- **Design moderne** : Boutons avec contours (outlined), zone de prévisualisation avec bordure en pointillés et coins arrondis
- **Système d'ajout flexible** : 
  - Menu déroulant pour sélectionner le type d'élément
  - Ajout d'éléments dans n'importe quel ordre
  - Interface accessible avec labels et attributs ARIA
- **Ajout d'éléments multiples** :
  - Titres en gras
  - Paragraphes (avec option gras/normal)
  - QR codes générés à partir d'URLs
  - Images téléversées
- **Génération d'images** : Format 5.8 cm de hauteur, largeur automatique
- **Téléchargement automatique** : L'image générée se télécharge immédiatement

## Architecture du projet
```
.
├── app.py                  # Backend Flask avec génération d'images
├── templates/
│   └── index.html         # Interface utilisateur HTML
├── static/
│   ├── style.css          # Styles modernes et responsive
│   └── script.js          # Logique côté client
├── .gitignore             # Fichiers ignorés par Git
└── replit.md              # Documentation du projet
```

## Technologies utilisées
- **Backend** : Flask (Python 3.11)
- **Génération d'images** : Pillow
- **QR Codes** : qrcode
- **Frontend** : HTML5, CSS3, JavaScript vanilla

## Configuration
Le serveur Flask écoute sur `0.0.0.0:5000` pour permettre l'accès via Replit.

## Dernières modifications
- 23 octobre 2025 : Création initiale du projet avec toutes les fonctionnalités
- 23 octobre 2025 : Refonte du design avec boutons outlined (style sobre)
- 23 octobre 2025 : Ajout de bordure en pointillés avec coins arrondis pour la zone de prévisualisation
- 23 octobre 2025 : Implémentation d'un système de sélection par menu déroulant pour l'ajout d'éléments
- 23 octobre 2025 : Amélioration de l'accessibilité avec labels et attributs ARIA
