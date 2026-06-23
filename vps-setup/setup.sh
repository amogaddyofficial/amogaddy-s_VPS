#!/bin/bash
# setup.sh — Configura l'intera VPS CloudBox da zero su Debian/Ubuntu
# Uso: curl -sSL https://raw.../setup.sh | sudo bash
#   oppure: sudo ./setup.sh

set -euo pipefail

echo "========================================"
echo "  CloudBox PaaS — Setup VPS"
echo "========================================"

# ── 1. Dipendenze di sistema ─────────────────────────────────────────────────
apt-get update -qq
apt-get install -y --no-install-recommends \
    curl wget git gcc make libsqlite3-dev \
    nginx certbot python3-certbot-nginx \
    ufw fail2ban

# ── 2. Installa Docker ───────────────────────────────────────────────────────
if ! command -v docker &>/dev/null; then
    curl -fsSL https://get.docker.com | bash
    systemctl enable docker
    systemctl start docker
fi

# Crea rete Docker per le app utente
docker network create cloudbox-user-apps-net 2>/dev/null || true

# ── 3. Struttura directory VPS ───────────────────────────────────────────────
mkdir -p /opt/vigilante/{data,logs,projects}
mkdir -p /opt/vigilante/docker/templates/{python,node,go,html}
mkdir -p /opt/vigilante/frontend

chown -R $(logname 2>/dev/null || echo "root"):docker /opt/vigilante

# ── 4. Copia file del progetto ───────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cp "$SCRIPT_DIR/launch_app.sh"              /opt/vigilante/launch_app.sh
cp "$SCRIPT_DIR/structure.yaml"             /opt/vigilante/structure.yaml
cp "$SCRIPT_DIR/chipping.sh"               /opt/vigilante/chipping.sh
cp "$SCRIPT_DIR/docker/templates/python/Dockerfile" /opt/vigilante/docker/templates/python/
cp "$SCRIPT_DIR/docker/templates/node/Dockerfile"   /opt/vigilante/docker/templates/node/
cp "$SCRIPT_DIR/docker/templates/go/Dockerfile"     /opt/vigilante/docker/templates/go/
cp "$SCRIPT_DIR/docker/templates/html/Dockerfile"   /opt/vigilante/docker/templates/html/

chmod +x /opt/vigilante/launch_app.sh
chmod +x /opt/vigilante/chipping.sh

# ── 5. Compila vigilante.c ───────────────────────────────────────────────────
gcc -O2 -pthread "$SCRIPT_DIR/vigilante.c" -lsqlite3 -o /opt/vigilante/vigilante
echo "[OK] vigilante compilato"

# ── 6. Systemd service per vigilante ────────────────────────────────────────
cat > /etc/systemd/system/vigilante.service << 'EOF'
[Unit]
Description=Vigilante — CloudBox HTTP Backend
After=network.target docker.service
Requires=docker.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/vigilante
ExecStart=/opt/vigilante/vigilante
Restart=always
RestartSec=5
StandardOutput=append:/opt/vigilante/logs/vigilante.log
StandardError=append:/opt/vigilante/logs/vigilante.log

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable vigilante
systemctl start vigilante
echo "[OK] vigilante.service avviato"

# ── 7. Systemd service per ssh_manager ──────────────────────────────────────
python3 -m venv /opt/vigilante/venv
/opt/vigilante/venv/bin/pip install -q --upgrade pip

cp "$SCRIPT_DIR/ssh_manager.py" /opt/vigilante/ssh_manager.py

cat > /etc/systemd/system/ssh-manager.service << 'EOF'
[Unit]
Description=CloudBox SSH Key Manager
After=network.target

[Service]
Type=simple
User=root
ExecStart=/opt/vigilante/venv/bin/python /opt/vigilante/ssh_manager.py
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable ssh-manager
systemctl start ssh-manager
echo "[OK] ssh-manager.service avviato"

# ── 8. Nginx config ──────────────────────────────────────────────────────────
read -p "Inserisci il dominio della VPS (es: vps.amogaddy.it): " VPS_DOMAIN

sed "s/\${VPS_HOST}/$VPS_DOMAIN/g" "$SCRIPT_DIR/nginx.conf" > /etc/nginx/nginx.conf

nginx -t && systemctl reload nginx
echo "[OK] Nginx configurato"

# ── 9. HTTPS con Let's Encrypt ───────────────────────────────────────────────
read -p "Email per Let's Encrypt: " LE_EMAIL
certbot --nginx -d "$VPS_DOMAIN" --non-interactive --agree-tos -m "$LE_EMAIL"
echo "[OK] Certificato SSL ottenuto"

# ── 10. Firewall ─────────────────────────────────────────────────────────────
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
echo "[OK] Firewall configurato"

# ── 11. Cronjob per reset istanze free (ogni 12 ore) ────────────────────────
(crontab -l 2>/dev/null; echo "0 */12 * * * curl -s -X POST http://localhost:8080/command -H 'Content-Type: application/json' -d '{\"action\":\"reset-12\"}'") | crontab -

# Cronjob caveau-check (ogni giorno a mezzanotte)
(crontab -l 2>/dev/null; echo "0 0 * * * curl -s -X POST http://localhost:8080/command -H 'Content-Type: application/json' -d '{\"action\":\"caveau-check\"}'") | crontab -

echo ""
echo "========================================"
echo "  Setup completato!"
echo "  Backend:  http://localhost:8080"
echo "  SSH mgr:  http://localhost:8081"
echo "  Pubblico: https://$VPS_DOMAIN"
echo "========================================"
