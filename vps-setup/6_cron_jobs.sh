#!/bin/bash
# ============================================================
# STEP 6 — Cron jobs: reset 12:00, balance domenicale, caveau
# Esegui come root: bash 6_cron_jobs.sh
# ============================================================

set -e

API="http://localhost:8080"
LOG="/opt/vigilante/logs/cron.log"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG"; }

# --- Funzione chiamata API ---
call_api() {
    local action="$1"
    local result
    result=$(curl -sf -X POST "$API/command" \
        -H "Content-Type: application/json" \
        -d "{\"action\":\"$action\"}" 2>&1)
    if [ $? -eq 0 ]; then
        log "✓ $action: $result"
    else
        log "✗ $action FALLITO: $result"
    fi
}

# Determina quale azione eseguire
case "${1:-}" in
    reset-12)
        log "=== Reset 12:00 IT ==="
        call_api "reset-12"
        call_api "caveau-check"
        ;;
    balance-cron)
        log "=== Balance Cron domenicale 03:00 ==="
        call_api "balance-cron"
        ;;
    caveau-check)
        log "=== Controllo Caveau ==="
        call_api "caveau-check"
        ;;
    *)
        echo "Uso: bash 6_cron_jobs.sh [reset-12|balance-cron|caveau-check]"
        exit 1
        ;;
esac

# ============================================================
# Per installare i cron automaticamente, esegui:
#   bash 6_cron_jobs.sh --install
# ============================================================
if [ "${1:-}" = "--install" ]; then
    SCRIPT="$(realpath "$0")"

    (crontab -l 2>/dev/null; cat << CRON
# amogaddy's VPS — Cron Jobs automatici

# Reset giornaliero alle 12:00 ora italiana (11:00 UTC in estate, 12:00 in inverno)
0 11 * * * bash $SCRIPT reset-12

# Bilanciamento nodi ogni domenica alle 03:00
0 3 * * 0 bash $SCRIPT balance-cron

# Controllo Caveau ogni 6 ore
0 */6 * * * bash $SCRIPT caveau-check

# Auto-deploy dal repository ogni 5 minuti
*/5 * * * * bash /opt/vigilante/repo/vps-setup/5_auto_deploy.sh >> /opt/vigilante/logs/deploy.log 2>&1
CRON
    ) | crontab -

    echo "✓ Cron jobs installati:"
    crontab -l
fi
