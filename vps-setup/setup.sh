#!/bin/bash
# setup.sh — Bootstrap completo VPS CloudBox (Ubuntu 22.04)
# Uso dalla VPS appena creata:
#
#   git clone https://github.com/amogaddyofficial/amogaddy-s_VPS.git
#   cd amogaddy-s_VPS
#   sudo bash vps-setup/setup.sh

set -euo pipefail

# ── Colori per output leggibile ──────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
ok()   { echo -e "${GREEN}[OK]${NC} $1"; }
info() { echo -e "${YELLOW}[..] $1${NC}"; }
err()  { echo -e "${RED}[ERR]${NC} $1"; exit 1; }

echo "========================================"
echo "  CloudBox PaaS — Setup VPS"
echo "  Ubuntu 22.04 | utente: ubuntu"
echo "========================================"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

# ── 1. Aggiornamento sistema ─────────────────────────────────────────────────
info "Aggiornamento pacchetti..."
apt-get update -qq
DEBIAN_FRONTEND=noninteractive apt-get upgrade -y -qq
apt-get install -y --no-install-recommends \
    curl wget git \
    gcc make libsqlite3-dev \
    python3 python3-venv \
    nginx certbot python3-certbot-nginx \
    ufw fail2ban netfilter-persistent \
    2>/dev/null
ok "Pacchetti installati"

# ── 2. Docker ────────────────────────────────────────────────────────────────
if ! command -v docker &>/dev/null; then
    info "Installazione Docker..."
    curl -fsSL https://get.docker.com | bash -s -- --quiet
    systemctl enable docker --quiet
    systemctl start docker
    usermod -aG docker ubuntu
    ok "Docker installato"
else
    ok "Docker già presente ($(docker --version | cut -d' ' -f3 | tr -d ','))"
fi

docker network create cloudbox-user-apps-net 2>/dev/null && ok "Rete Docker creata" || true

# ── 3. Struttura directory ───────────────────────────────────────────────────
info "Creazione struttura /opt/vigilante..."
mkdir -p /opt/vigilante/{data,logs,projects}
mkdir -p /opt/vigilante/docker/templates/{python,node,go,html}
mkdir -p /opt/vigilante/frontend
chown -R ubuntu:ubuntu /opt/vigilante
ok "Directory create"

# ── 4. Copia file backend ────────────────────────────────────────────────────
info "Copia file di configurazione..."
cp "$SCRIPT_DIR/launch_app.sh"                              /opt/vigilante/launch_app.sh
cp "$SCRIPT_DIR/chipping.sh"                                /opt/vigilante/chipping.sh
cp "$SCRIPT_DIR/structure.yaml"                             /opt/vigilante/structure.yaml
cp "$SCRIPT_DIR/ssh_manager.py"                             /opt/vigilante/ssh_manager.py
cp "$SCRIPT_DIR/docker/templates/python/Dockerfile"        /opt/vigilante/docker/templates/python/
cp "$SCRIPT_DIR/docker/templates/node/Dockerfile"          /opt/vigilante/docker/templates/node/
cp "$SCRIPT_DIR/docker/templates/go/Dockerfile"            /opt/vigilante/docker/templates/go/
cp "$SCRIPT_DIR/docker/templates/html/Dockerfile"          /opt/vigilante/docker/templates/html/
chmod +x /opt/vigilante/launch_app.sh /opt/vigilante/chipping.sh
ok "File copiati"

# ── 5. Compila vigilante.c ───────────────────────────────────────────────────
info "Compilazione vigilante.c..."
gcc -O2 -pthread "$SCRIPT_DIR/vigilante.c" -lsqlite3 -o /opt/vigilante/vigilante \
    || err "Compilazione fallita. Controlla che libsqlite3-dev sia installato."
ok "vigilante compilato"

# ── 6. Systemd: vigilante ────────────────────────────────────────────────────
info "Configurazione servizio vigilante..."
cat > /etc/systemd/system/vigilante.service << 'EOF'
[Unit]
Description=Vigilante — CloudBox HTTP Backend
After=network.target docker.service
Wants=docker.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/vigilante
ExecStart=/opt/vigilante/vigilante
Restart=always
RestartSec=5
StandardOutput=append:/opt/vigilante/logs/vigilante.log
StandardError=append:/opt/vigilante/logs/vigilante.log
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable vigilante --quiet
systemctl restart vigilante
ok "vigilante.service avviato"

# ── 7. Systemd: ssh_manager ──────────────────────────────────────────────────
info "Configurazione ssh_manager..."
python3 -m venv /opt/vigilante/venv --quiet
/opt/vigilante/venv/bin/pip install --upgrade pip -q

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
systemctl enable ssh-manager --quiet
systemctl restart ssh-manager
ok "ssh-manager.service avviato"

# ── 8. Nginx ─────────────────────────────────────────────────────────────────
info "Configurazione Nginx..."

# Config base senza dominio (HTTP only, aggiornabile dopo con dominio)
cat > /etc/nginx/sites-available/cloudbox << 'EOF'
server {
    listen 80 default_server;
    server_name _;

    location /api/ {
        rewrite ^/api/(.*)$ /$1 break;
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header X-Real-IP $remote_addr;
        client_max_body_size 50M;
    }

    location /ssh/ {
        rewrite ^/ssh/(.*)$ /$1 break;
        proxy_pass http://127.0.0.1:8081;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        root /opt/vigilante/frontend;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
EOF

ln -sf /etc/nginx/sites-available/cloudbox /etc/nginx/sites-enabled/cloudbox
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
ok "Nginx configurato (HTTP)"

# ── 9. Firewall ──────────────────────────────────────────────────────────────
info "Configurazione firewall..."
ufw --force reset > /dev/null 2>&1
ufw default deny incoming > /dev/null
ufw default allow outgoing > /dev/null
ufw allow 22/tcp   > /dev/null   # SSH
ufw allow 80/tcp   > /dev/null   # HTTP
ufw allow 443/tcp  > /dev/null   # HTTPS
ufw allow 8080/tcp > /dev/null   # vigilante (temporaneo per test)
ufw --force enable > /dev/null
ok "Firewall attivo (22, 80, 443, 8080)"

# ── 10. Cronjob automatici ───────────────────────────────────────────────────
info "Configurazione cronjob..."
(crontab -l 2>/dev/null | grep -v "vigilante-cron"; \
 echo "0 */12 * * * curl -s -X POST http://localhost:8080/command -H 'Content-Type: application/json' -d '{\"action\":\"reset-12\"}' > /dev/null"; \
 echo "0 0 * * *   curl -s -X POST http://localhost:8080/command -H 'Content-Type: application/json' -d '{\"action\":\"caveau-check\"}' > /dev/null"; \
 echo "0 3 * * *   /opt/vigilante/chipping.sh /opt/vigilante/projects > /opt/vigilante/logs/chipping.log 2>&1") | crontab -
ok "Cronjob impostati (reset-12, caveau-check, chipping notturno)"

# ── 11. Verifica finale ──────────────────────────────────────────────────────
echo ""
echo "========================================"
echo -e "${GREEN}  Setup completato!${NC}"
echo "========================================"
echo ""
echo "  Servizi attivi:"
systemctl is-active vigilante   && echo "  ✓ vigilante   → http://$(hostname -I | awk '{print $1}'):8080"
systemctl is-active ssh-manager && echo "  ✓ ssh-manager → http://localhost:8081"
systemctl is-active nginx       && echo "  ✓ nginx       → http://$(hostname -I | awk '{print $1}')"
echo ""
echo "  Health check:"
sleep 2
curl -s http://localhost:8080/health || echo "  (vigilante non ancora pronto, attendi 5s e riprova)"
echo ""
echo "  Per abilitare HTTPS con un dominio:"
echo "  sudo certbot --nginx -d TUO-DOMINIO.com -m TUA-EMAIL"
echo "========================================"
