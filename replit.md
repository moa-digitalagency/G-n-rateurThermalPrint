# Générateur d'Images - Application Python Flask

## Vue d'ensemble
Application web moderne et responsive qui permet de créer des images personnalisées de 5.7 cm de largeur avec une hauteur variable selon le contenu. L'utilisateur peut ajouter différents types d'éléments (titres, paragraphes, QR codes, images) empilés verticalement, et générer une image PNG téléchargeable avec bordure pointillée et coins arrondis.

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
- **Génération d'images** : Format 5.7 cm de largeur fixe, hauteur flexible selon le contenu
- **Bordure élégante** : Bordure pointillée avec coins arrondis autour de l'image
- **Disposition verticale** : Les éléments sont empilés de haut en bas
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
- 23 octobre 2025 : Migration vers l'environnement Replit standard avec gunicorn
- 23 octobre 2025 : Modification de l'orientation : largeur fixe 5.7 cm, hauteur flexible
- 23 octobre 2025 : Changement de disposition : éléments empilés verticalement (haut en bas)
- 23 octobre 2025 : Ajout de bordure pointillée avec coins arrondis sur l'image générée
