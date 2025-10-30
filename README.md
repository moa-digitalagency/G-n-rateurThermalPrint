# 🖨️ Générateur d'Étiquettes Thermiques

Une application web moderne pour créer des étiquettes personnalisées pour imprimantes thermiques Bluetooth 5.8 cm.

[English version below](#english-version)

## 🌟 Fonctionnalités

- ✏️ **Titres personnalisés** - Ajoutez des titres en majuscules avec mise en forme automatique
- 📝 **Paragraphes de texte** - Texte normal ou en gras avec retour à la ligne automatique
- 📱 **QR Codes** - Générez des QR codes à partir d'URLs ou de texte
- 🖼️ **Images** - Ajoutez vos propres images (redimensionnées automatiquement)
- ➖ **Lignes horizontales** - Séparez les sections avec des lignes
- ⬜ **Espaces vides** - Ajoutez de l'espacement vertical personnalisable
- 📊 **Codes-barres** - Générez des codes-barres Code128
- 🎯 **Glisser-déposer** - Réorganisez les éléments par glisser-déposer
- 📱 **Design responsive** - Optimisé pour mobile et desktop
- 🎨 **Design moderne** - Basé sur le système de design myoneart

## 🚀 Installation

### Prérequis

- Python 3.11 ou supérieur
- pip ou uv (gestionnaire de paquets Python)

### Installation Locale

1. **Cloner le projet**
```bash
git clone <url-du-repo>
cd <nom-du-projet>
```

2. **Installer les dépendances**

Avec uv (recommandé sur Replit):
```bash
uv sync
```

Ou avec pip:
```bash
pip install -r requirements.txt
```

3. **Lancer l'application**

En développement:
```bash
python main.py
```

L'application sera accessible sur `http://localhost:5000`

### Déploiement sur VPS (Production)

Pour déployer sur un serveur VPS avec Nginx, utilisez le script automatisé :

```bash
chmod +x deploy_vps.sh
sudo ./deploy_vps.sh
```

Ce script va :
- Installer Python 3.11, Nginx, et toutes les dépendances
- Configurer Gunicorn comme serveur WSGI
- Configurer Nginx comme reverse proxy
- Créer un service systemd pour le démarrage automatique
- Configurer le pare-feu (optionnel)

## 📖 Utilisation

1. **Sélectionnez un type d'élément** dans le menu déroulant
2. **Cliquez sur "Ajouter élément"** pour l'ajouter à votre composition
3. **Remplissez le contenu** de chaque élément
4. **Réorganisez** en glissant-déposant les éléments (icône ⋮⋮)
5. **Cliquez sur "Générer l'image"** pour télécharger le résultat

### Types d'éléments disponibles

- **📌 Titre** - Texte en majuscules, grande taille (48px)
- **📄 Paragraphe** - Texte normal (28px) avec option en gras
- **📱 QR Code** - Code QR de 4 cm × 4 cm
- **🖼️ Image** - Image personnalisée (max 5 MB)
- **➖ Ligne horizontale** - Séparateur visuel (3px d'épaisseur)
- **⬜ Espace vide** - Espacement vertical (10-200px)
- **📊 Code-barres** - Code-barres Code128 (numérique uniquement)

## 🎨 Spécifications techniques

### Format de sortie
- **Largeur**: 5.8 cm (≈ 685 pixels à 118 DPI)
- **Hauteur**: Calculée automatiquement selon le contenu
- **Format**: PNG haute qualité (300 DPI)
- **Bordure**: Pointillés arrondis avec coins arrondis

### Polices utilisées
- **Titre**: DejaVu Sans Bold 48px
- **Texte**: DejaVu Sans 28px (normal ou gras)

### Espacement
- **Padding**: 50px autour du contenu
- **Espacement entre éléments**: 50px
- **Marge de bordure**: 20px

## 🛠️ Technologies utilisées

- **Backend**: Flask (Python)
- **Génération d'images**: Pillow (PIL)
- **QR Codes**: qrcode
- **Codes-barres**: python-barcode
- **Serveur**: Gunicorn (production), Flask dev server (développement)
- **Frontend**: HTML, CSS, JavaScript vanilla

## 📁 Structure du projet

```
.
├── app.py              # Application Flask principale
├── main.py             # Point d'entrée
├── static/
│   ├── style.css       # Styles (myoneart Design System)
│   └── script.js       # Interactions JavaScript
├── templates/
│   └── index.html      # Interface utilisateur
├── pyproject.toml      # Configuration uv/Python
├── requirements.txt    # Dépendances Python
└── deploy_vps.sh       # Script de déploiement VPS
```

## 🎨 Design System

Ce projet utilise le **myoneart Design System** qui propose:
- Palette indigo-purple moderne
- Bordures arrondies généreuses
- Ombres douces et subtiles
- Animations fluides
- Emojis pour l'iconographie
- Style friendly et professionnel

## 🔧 Configuration Production

### Nginx

Le script de déploiement configure automatiquement Nginx. Configuration manuelle si nécessaire:

```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Gunicorn

```bash
gunicorn --bind 127.0.0.1:8000 --workers 4 --timeout 120 main:app
```

### Systemd Service

Le service systemd est créé automatiquement par le script de déploiement:

```bash
sudo systemctl start label-generator
sudo systemctl enable label-generator
sudo systemctl status label-generator
```

## 📝 Licence

MIT License - Libre d'utilisation et de modification

## 🤝 Contribution

Les contributions sont les bienvenues! N'hésitez pas à ouvrir une issue ou une pull request.

---

# English Version

## 🖨️ Thermal Label Generator

A modern web application to create custom labels for 5.8 cm Bluetooth thermal printers.

## 🌟 Features

- ✏️ **Custom Titles** - Add uppercase titles with automatic formatting
- 📝 **Text Paragraphs** - Normal or bold text with automatic line wrapping
- 📱 **QR Codes** - Generate QR codes from URLs or text
- 🖼️ **Images** - Add your own images (automatically resized)
- ➖ **Horizontal Lines** - Separate sections with lines
- ⬜ **Empty Spaces** - Add customizable vertical spacing
- 📊 **Barcodes** - Generate Code128 barcodes
- 🎯 **Drag & Drop** - Reorder elements by dragging
- 📱 **Responsive Design** - Optimized for mobile and desktop
- 🎨 **Modern Design** - Based on myoneart Design System

## 🚀 Installation

### Prerequisites

- Python 3.11 or higher
- pip or uv (Python package manager)

### Local Installation

1. **Clone the project**
```bash
git clone <repo-url>
cd <project-name>
```

2. **Install dependencies**

With uv (recommended on Replit):
```bash
uv sync
```

Or with pip:
```bash
pip install -r requirements.txt
```

3. **Run the application**

In development:
```bash
python main.py
```

The application will be accessible at `http://localhost:5000`

### VPS Deployment (Production)

To deploy on a VPS server with Nginx, use the automated script:

```bash
chmod +x deploy_vps.sh
sudo ./deploy_vps.sh
```

This script will:
- Install Python 3.11, Nginx, and all dependencies
- Configure Gunicorn as WSGI server
- Configure Nginx as reverse proxy
- Create systemd service for automatic startup
- Configure firewall (optional)

## 📖 Usage

1. **Select an element type** from the dropdown menu
2. **Click "Add Element"** to add it to your composition
3. **Fill in the content** for each element
4. **Reorder** by dragging and dropping elements (⋮⋮ icon)
5. **Click "Generate Image"** to download the result

### Available Element Types

- **📌 Title** - Uppercase text, large size (48px)
- **📄 Paragraph** - Normal text (28px) with bold option
- **📱 QR Code** - 4 cm × 4 cm QR code
- **🖼️ Image** - Custom image (max 5 MB)
- **➖ Horizontal Line** - Visual separator (3px thick)
- **⬜ Empty Space** - Vertical spacing (10-200px)
- **📊 Barcode** - Code128 barcode (numeric only)

## 🎨 Technical Specifications

### Output Format
- **Width**: 5.8 cm (≈ 685 pixels at 118 DPI)
- **Height**: Automatically calculated based on content
- **Format**: High-quality PNG (300 DPI)
- **Border**: Dashed rounded border with rounded corners

### Fonts Used
- **Title**: DejaVu Sans Bold 48px
- **Text**: DejaVu Sans 28px (normal or bold)

### Spacing
- **Padding**: 50px around content
- **Element spacing**: 50px
- **Border margin**: 20px

## 🛠️ Technologies Used

- **Backend**: Flask (Python)
- **Image Generation**: Pillow (PIL)
- **QR Codes**: qrcode
- **Barcodes**: python-barcode
- **Server**: Gunicorn (production), Flask dev server (development)
- **Frontend**: HTML, CSS, vanilla JavaScript

## 📁 Project Structure

```
.
├── app.py              # Main Flask application
├── main.py             # Entry point
├── static/
│   ├── style.css       # Styles (myoneart Design System)
│   └── script.js       # JavaScript interactions
├── templates/
│   └── index.html      # User interface
├── pyproject.toml      # uv/Python configuration
├── requirements.txt    # Python dependencies
└── deploy_vps.sh       # VPS deployment script
```

## 🎨 Design System

This project uses the **myoneart Design System** featuring:
- Modern indigo-purple palette
- Generous rounded borders
- Soft and subtle shadows
- Smooth animations
- Emojis for iconography
- Friendly and professional style

## 🔧 Production Configuration

### Nginx

The deployment script automatically configures Nginx. Manual configuration if needed:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Gunicorn

```bash
gunicorn --bind 127.0.0.1:8000 --workers 4 --timeout 120 main:app
```

### Systemd Service

The systemd service is automatically created by the deployment script:

```bash
sudo systemctl start label-generator
sudo systemctl enable label-generator
sudo systemctl status label-generator
```

## 📝 License

MIT License - Free to use and modify

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or pull request.
