#!/bin/bash

#########################################################################
# Script de déploiement VPS complet pour Générateur d'Étiquettes
# Déploiement automatisé avec Nginx + Gunicorn + Systemd
# Supporte Ubuntu 20.04+ et Debian 10+
#########################################################################

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
APP_NAME="label-generator"
APP_DIR="/var/www/${APP_NAME}"
APP_USER="${APP_NAME}"
DOMAIN="${DOMAIN:-_}"
PORT=8000
WORKERS=4

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Déploiement VPS - ${APP_NAME}${NC}"
echo -e "${GREEN}========================================${NC}"

# Vérification root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Ce script doit être exécuté en tant que root${NC}"
    exit 1
fi

# Mise à jour du système
echo -e "\n${YELLOW}[1/8] Mise à jour du système...${NC}"
apt-get update
apt-get upgrade -y

# Installation des dépendances système
echo -e "\n${YELLOW}[2/8] Installation des dépendances...${NC}"
apt-get install -y \
    python3.11 \
    python3.11-venv \
    python3-pip \
    nginx \
    git \
    build-essential \
    libpq-dev \
    python3-dev \
    libjpeg-dev \
    zlib1g-dev

# Création de l'utilisateur système
echo -e "\n${YELLOW}[3/8] Création de l'utilisateur système...${NC}"
if ! id -u ${APP_USER} > /dev/null 2>&1; then
    useradd -m -s /bin/bash ${APP_USER}
    echo -e "${GREEN}Utilisateur ${APP_USER} créé${NC}"
else
    echo -e "${GREEN}Utilisateur ${APP_USER} existe déjà${NC}"
fi

# Création du répertoire de l'application
echo -e "\n${YELLOW}[4/8] Configuration du répertoire de l'application...${NC}"
mkdir -p ${APP_DIR}
cd ${APP_DIR}

# Copier les fichiers de l'application
if [ -d "/tmp/${APP_NAME}" ]; then
    cp -r /tmp/${APP_NAME}/* ${APP_DIR}/
else
    echo -e "${YELLOW}Veuillez copier les fichiers de votre application dans ${APP_DIR}${NC}"
    echo "Vous pouvez utiliser: scp -r ./* user@server:/tmp/${APP_NAME}/"
    read -p "Appuyez sur Entrée une fois les fichiers copiés..."
fi

# Installation de l'environnement virtuel Python
echo -e "\n${YELLOW}[5/8] Installation de l'environnement Python...${NC}"
python3.11 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
deactivate

# Permissions
chown -R ${APP_USER}:${APP_USER} ${APP_DIR}
chmod -R 755 ${APP_DIR}

# Configuration Systemd
echo -e "\n${YELLOW}[6/8] Configuration du service systemd...${NC}"
cat > /etc/systemd/system/${APP_NAME}.service << EOF
[Unit]
Description=Générateur d'Étiquettes - Gunicorn daemon
After=network.target

[Service]
User=${APP_USER}
Group=${APP_USER}
WorkingDirectory=${APP_DIR}
Environment="PATH=${APP_DIR}/venv/bin"
ExecStart=${APP_DIR}/venv/bin/gunicorn \\
    --bind 127.0.0.1:${PORT} \\
    --workers ${WORKERS} \\
    --timeout 120 \\
    --access-logfile ${APP_DIR}/access.log \\
    --error-logfile ${APP_DIR}/error.log \\
    --log-level info \\
    main:app

Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Démarrage du service
systemctl daemon-reload
systemctl enable ${APP_NAME}
systemctl start ${APP_NAME}

echo -e "${GREEN}Service ${APP_NAME} démarré${NC}"

# Configuration Nginx
echo -e "\n${YELLOW}[7/8] Configuration de Nginx...${NC}"

# Suppression de la configuration par défaut
rm -f /etc/nginx/sites-enabled/default

# Création de la configuration Nginx
cat > /etc/nginx/sites-available/${APP_NAME} << EOF
server {
    listen 80;
    server_name ${DOMAIN};

    client_max_body_size 10M;

    access_log /var/log/nginx/${APP_NAME}-access.log;
    error_log /var/log/nginx/${APP_NAME}-error.log;

    location / {
        proxy_pass http://127.0.0.1:${PORT};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location /static {
        alias ${APP_DIR}/static;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
}
EOF

# Activation de la configuration
ln -sf /etc/nginx/sites-available/${APP_NAME} /etc/nginx/sites-enabled/

# Test de la configuration Nginx
nginx -t

# Redémarrage Nginx
systemctl restart nginx
systemctl enable nginx

echo -e "${GREEN}Nginx configuré et démarré${NC}"

# Configuration du pare-feu (optionnel)
echo -e "\n${YELLOW}[8/8] Configuration du pare-feu...${NC}"
read -p "Voulez-vous configurer le pare-feu UFW? (o/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Oo]$ ]]; then
    apt-get install -y ufw
    ufw default deny incoming
    ufw default allow outgoing
    ufw allow ssh
    ufw allow 'Nginx Full'
    echo "y" | ufw enable
    echo -e "${GREEN}Pare-feu configuré${NC}"
fi

# Résumé de l'installation
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}   Déploiement terminé avec succès!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "\nInformations de déploiement:"
echo -e "  - Application: ${APP_NAME}"
echo -e "  - Répertoire: ${APP_DIR}"
echo -e "  - Utilisateur: ${APP_USER}"
echo -e "  - Port interne: ${PORT}"
echo -e "  - Workers Gunicorn: ${WORKERS}"
echo -e "  - Domain: ${DOMAIN}"
echo -e "\nCommandes utiles:"
echo -e "  - Voir les logs: sudo journalctl -u ${APP_NAME} -f"
echo -e "  - Redémarrer l'app: sudo systemctl restart ${APP_NAME}"
echo -e "  - Statut: sudo systemctl status ${APP_NAME}"
echo -e "  - Redémarrer Nginx: sudo systemctl restart nginx"
echo -e "\nAccès à l'application:"
if [ "${DOMAIN}" = "_" ]; then
    echo -e "  - http://$(curl -s ifconfig.me 2>/dev/null || echo 'VOTRE_IP')"
else
    echo -e "  - http://${DOMAIN}"
fi
echo -e "\n${YELLOW}Note: Pour configurer HTTPS avec Let's Encrypt:${NC}"
echo -e "  sudo apt-get install certbot python3-certbot-nginx"
echo -e "  sudo certbot --nginx -d ${DOMAIN}"
echo -e "\n${GREEN}========================================${NC}"
