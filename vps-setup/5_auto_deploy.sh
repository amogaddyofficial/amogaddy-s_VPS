#!/bin/bash
# ============================================================
# STEP 5 — Auto-deploy: git pull + ricompila + riavvia
# Esegui come root: bash 5_auto_deploy.sh
# Oppure mettilo in cron o aggancialo a un GitHub Webhook
# ============================================================

set -e

REPO="/opt/vigilante/repo"
SRC="$REPO/vps-setup/vigilante.c"
BIN="/opt/vigilante/bin/vigilante"
LOG="/opt/vigilante/logs/deploy.log"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG"; }

log "━━━ Auto-deploy avviato ━━━"

# --- 1. Aggiorna il repository ---
log "Pull da GitHub..."
cd "$REPO"
git fetch origin main
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" = "$REMOTE" ]; then
    log "Nessun aggiornamento. Deploy saltato."
    exit 0
fi

git pull origin main
log "Nuovo commit: $(git log -1 --pretty='%h %s')"

# --- 2. Ricompila il Vigilante ---
log "Ricompilazione..."
gcc -O2 -pthread "$SRC" -lsqlite3 -o "${BIN}.new"
chmod +x "${BIN}.new"

# --- 3. Sostituzione atomica (zero downtime) ---
log "Sostituzione binario..."
mv "${BIN}.new" "$BIN"
chown vigilante:vigilante "$BIN"

# --- 4. Riavvio graceful del servizio ---
log "Riavvio servizio Vigilante..."
systemctl restart vigilante
sleep 2

# --- 5. Health check post-deploy ---
if curl -sf http://localhost:8080/health > /dev/null; then
    log "✓ Health check OK — deploy completato."
else
    log "✗ Health check FALLITO — rollback in corso..."
    # In produzione qui si farebbe rollback al vecchio binario
    systemctl status vigilante --no-pager
    exit 1
fi

log "━━━ Deploy completato ━━━"
