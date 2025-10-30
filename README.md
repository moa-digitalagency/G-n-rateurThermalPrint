# 🎨 Créateur d'Images Personnalisées

Une application web moderne pour générer des images personnalisées de 5 cm de largeur avec titres, texte, QR codes et images.

[English version below](#english-version)

## 🌟 Fonctionnalités

- ✏️ **Titres personnalisés** - Ajoutez des titres en majuscules avec mise en forme automatique
- 📝 **Paragraphes de texte** - Texte normal ou en gras avec retour à la ligne automatique
- 📱 **QR Codes** - Générez des QR codes à partir d'URLs ou de texte
- 🖼️ **Images** - Ajoutez vos propres images (redimensionnées automatiquement)
- 🎯 **Glisser-déposer** - Réorganisez les éléments par glisser-déposer
- 📱 **Design responsive** - Optimisé pour mobile et desktop
- 🎨 **Design moderne** - Basé sur le système de design myoneart

## 🚀 Installation

### Prérequis

- Python 3.11 ou supérieur
- pip ou uv (gestionnaire de paquets Python)

### Étapes d'installation

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
gunicorn --bind 0.0.0.0:5000 --reuse-port --reload main:app
```

Ou simplement:
```bash
python main.py
```

4. **Accéder à l'application**

Ouvrez votre navigateur à l'adresse: `http://localhost:5000`

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

## 🎨 Spécifications techniques

### Format de sortie
- **Largeur**: 5 cm (≈ 590 pixels à 118 DPI)
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
- **Serveur**: Gunicorn
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
└── requirements.txt    # Dépendances Python
```

## 🎨 Design System

Ce projet utilise le **myoneart Design System** qui propose:
- Palette indigo-purple moderne
- Bordures arrondies généreuses
- Ombres douces et subtiles
- Animations fluides
- Emojis pour l'iconographie
- Style friendly et professionnel

## 📝 Licence

MIT License - Libre d'utilisation et de modification

## 🤝 Contribution

Les contributions sont les bienvenues! N'hésitez pas à ouvrir une issue ou une pull request.

---

# English Version

## 🎨 Custom Image Generator

A modern web application to generate custom 5cm-wide images with titles, text, QR codes, and images.

## 🌟 Features

- ✏️ **Custom Titles** - Add uppercase titles with automatic formatting
- 📝 **Text Paragraphs** - Normal or bold text with automatic line wrapping
- 📱 **QR Codes** - Generate QR codes from URLs or text
- 🖼️ **Images** - Add your own images (automatically resized)
- 🎯 **Drag & Drop** - Reorder elements by dragging
- 📱 **Responsive Design** - Optimized for mobile and desktop
- 🎨 **Modern Design** - Based on myoneart Design System

## 🚀 Installation

### Prerequisites

- Python 3.11 or higher
- pip or uv (Python package manager)

### Installation Steps

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
gunicorn --bind 0.0.0.0:5000 --reuse-port --reload main:app
```

Or simply:
```bash
python main.py
```

4. **Access the application**

Open your browser at: `http://localhost:5000`

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

## 🎨 Technical Specifications

### Output Format
- **Width**: 5 cm (≈ 590 pixels at 118 DPI)
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
- **Server**: Gunicorn
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
└── requirements.txt    # Python dependencies
```

## 🎨 Design System

This project uses the **myoneart Design System** featuring:
- Modern indigo-purple palette
- Generous rounded borders
- Soft and subtle shadows
- Smooth animations
- Emojis for iconography
- Friendly and professional style

## 📝 License

MIT License - Free to use and modify

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or pull request.
