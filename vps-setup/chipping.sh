#!/bin/bash
# chipping.sh — Rimuove file inutili dal container dopo ogni build
# Uso: ./chipping.sh <percorso-progetto>  (default: directory corrente)
# Risparmia spazio disco eliminando documentazione, cache, test e source-map.

set -euo pipefail

PROJECT_DIR="${1:-.}"
LOG_BEFORE=$(du -sh "$PROJECT_DIR" 2>/dev/null | cut -f1)

echo "[chipping] Avvio pulizia in: $PROJECT_DIR"
echo "[chipping] Dimensione prima: $LOG_BEFORE"

# ── Cartelle da eliminare completamente ──────────────────────────────────────
DIRS_TO_REMOVE=(
    "__pycache__"
    ".pytest_cache"
    ".mypy_cache"
    "htmlcov"
    ".coverage"
    "node_modules/.cache"
    ".next/cache"
    "dist/.map"
    ".turbo"
    ".nuxt"
)

for dir in "${DIRS_TO_REMOVE[@]}"; do
    find "$PROJECT_DIR" -type d -name "$dir" -prune -exec rm -rf {} + 2>/dev/null || true
done

# ── Cartelle di test (solo se non nella root del progetto — preserva struttura) ──
for test_dir in test tests spec __tests__ cypress e2e; do
    find "$PROJECT_DIR" -mindepth 2 -type d -name "$test_dir" -prune -exec rm -rf {} + 2>/dev/null || true
done

# ── File inutili per estensione ──────────────────────────────────────────────
find "$PROJECT_DIR" \( \
    -name "*.map"          -o \
    -name "*.test.js"      -o \
    -name "*.spec.js"      -o \
    -name "*.test.ts"      -o \
    -name "*.spec.ts"      -o \
    -name "*.test.py"      -o \
    -name "*.pyc"          -o \
    -name "*.pyo"          -o \
    -name ".DS_Store"      -o \
    -name "Thumbs.db"      -o \
    -name "*.log"          -o \
    -name "*.tmp"          -o \
    -name ".env.example"   -o \
    -name ".env.sample"    -o \
    -name "CHANGELOG.md"   -o \
    -name "CONTRIBUTING.md" -o \
    -name "CODE_OF_CONDUCT.md" \
\) -not -path "*/node_modules/*" -delete 2>/dev/null || true

# ── Rimuove file README.md nelle sottocartelle (mantiene solo root) ──────────
find "$PROJECT_DIR" -mindepth 2 -name "README.md" -delete 2>/dev/null || true

# ── Rimuove documentazione interna di node_modules ──────────────────────────
if [ -d "$PROJECT_DIR/node_modules" ]; then
    find "$PROJECT_DIR/node_modules" \( \
        -name "*.md"  -o \
        -name "*.txt" -o \
        -name "test"  -o \
        -name "tests" -o \
        -name "docs"  \
    \) -maxdepth 3 -exec rm -rf {} + 2>/dev/null || true
fi

LOG_AFTER=$(du -sh "$PROJECT_DIR" 2>/dev/null | cut -f1)
echo "[chipping] Dimensione dopo: $LOG_AFTER"
echo "[chipping] Pulizia completata."
