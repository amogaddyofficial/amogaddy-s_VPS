#!/bin/bash
# ============================================================
# STEP 1 — Setup base VPS (Ubuntu 22.04)
# Esegui come root: bash 1_setup_base.sh
# ============================================================

set -e  # interrompi se un comando fallisce

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  amogaddy's VPS — Setup Base"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# --- 1. Aggiorna il sistema ---
echo "[1/7] Aggiornamento pacchetti..."
apt update && apt upgrade -y

# --- 2. Pacchetti essenziali ---
echo "[2/7] Installazione pacchetti essenziali..."
apt install -y \
  build-essential \   # gcc, make
  git \               # sincronizzazione codice
  curl wget \
  nginx \             # reverse proxy
  certbot python3-certbot-nginx \  # certificati SSL
  ufw \               # firewall
  fail2ban \          # anti brute-force
  sqlite3 \           # database leggero
  libsqlite3-dev \    # header C per SQLite
  systemd \           # gestore servizi
  htop \              # monitoraggio risorse
  jq                  # parsing JSON da bash

# --- 3. Crea utente non-root per il servizio ---
echo "[3/7] Creazione utente 'vigilante'..."
id -u vigilante &>/dev/null || useradd -m -s /bin/bash vigilante
echo "  Utente 'vigilante' pronto."

# --- 4. Directory di lavoro ---
echo "[4/7] Creazione directory progetto..."
mkdir -p /opt/vigilante/{src,bin,logs,data}
chown -R vigilante:vigilante /opt/vigilante

# --- 5. Clona il repository ---
echo "[5/7] Clona repository GitHub..."
# Sostituisci con il tuo URL se il backend è in un repo separato
REPO_URL="https://github.com/amogaddyofficial/amogaddy-s_VPS.git"
if [ ! -d "/opt/vigilante/repo" ]; then
  git clone "$REPO_URL" /opt/vigilante/repo
  chown -R vigilante:vigilante /opt/vigilante/repo
else
  echo "  Repository già presente, skip."
fi

# --- 6. UFW Firewall ---
echo "[6/7] Configurazione firewall UFW..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP (redirect a HTTPS)
ufw allow 443/tcp   # HTTPS
ufw --force enable
ufw status verbose

# --- 7. fail2ban ---
echo "[7/7] Configurazione fail2ban..."
systemctl enable fail2ban
systemctl start fail2ban
echo "  fail2ban attivo."

echo ""
echo "✓ Setup base completato!"
echo "  Prossimo step: bash 2_compilare_vigilante.sh"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
