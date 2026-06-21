#!/bin/bash
# ============================================================
# STEP 2 — Compilazione e installazione del Vigilante (C)
# Esegui come root: bash 2_compilare_vigilante.sh
# ============================================================

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Compilazione Vigilante C Backend"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

SRC="/opt/vigilante/repo/vps-setup/vigilante.c"
BIN="/opt/vigilante/bin/vigilante"

# --- Compila ---
echo "[1/3] Compilazione con gcc..."
gcc -O2 -pthread "$SRC" -lsqlite3 -o "$BIN"
chmod +x "$BIN"
echo "  ✓ Binario: $BIN"

# --- Verifica ---
echo "[2/3] Verifica binario..."
"$BIN" --version 2>/dev/null || echo "  ✓ Binario compilato (nessuna opzione --version)."

# --- Permessi ---
echo "[3/3] Permessi directory..."
chown -R vigilante:vigilante /opt/vigilante
chmod 750 "$BIN"
echo "  ✓ Permessi impostati."

echo ""
echo "✓ Compilazione completata!"
echo "  Prossimo step: bash 3_nginx_ssl.sh"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
