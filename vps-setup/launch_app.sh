#!/bin/bash
# launch_app.sh — Crea e avvia un container Docker per un'app utente
# Chiamato da vigilante.c via popen()
#
# Uso: ./launch_app.sh <instance_id> <runtime> <start_cmd>
# Output su stdout: container_id (SHA256 corto) oppure stringa vuota se errore

set -euo pipefail

INSTANCE_ID="$1"
RUNTIME="$2"
START_CMD="${3:-}"

PROJECTS_ROOT="/opt/vigilante/projects"
TEMPLATES_ROOT="/opt/vigilante/docker/templates"
PROJECT_DIR="$PROJECTS_ROOT/$INSTANCE_ID"

# ── Selezione template ───────────────────────────────────────────────────────
case "$RUNTIME" in
  python*|Python*)  TEMPLATE="python" ;;
  node*|Node*)      TEMPLATE="node"   ;;
  go*|Go*)          TEMPLATE="go"     ;;
  html*|HTML*)      TEMPLATE="html"   ;;
  *)
    echo "ERRORE: runtime sconosciuto '$RUNTIME'" >&2
    exit 1
    ;;
esac

# ── Crea la directory del progetto se non esiste ─────────────────────────────
mkdir -p "$PROJECT_DIR"

# ── Copia il Dockerfile template (non sovrascrivere se l'utente ne ha già uno) ─
if [ ! -f "$PROJECT_DIR/Dockerfile" ]; then
  cp "$TEMPLATES_ROOT/$TEMPLATE/Dockerfile" "$PROJECT_DIR/Dockerfile"
fi

# ── Build dell'immagine Docker ───────────────────────────────────────────────
IMAGE_NAME="cloudbox-$INSTANCE_ID"

docker build \
  --quiet \
  --tag "$IMAGE_NAME" \
  "$PROJECT_DIR" 2>/dev/null

# ── Avvio del container con limiti di risorse del piano FREE ─────────────────
CONTAINER_ID=$(docker run \
  --detach \
  --name "$IMAGE_NAME" \
  --restart unless-stopped \
  --memory="256m" \
  --memory-swap="256m" \
  --cpus="0.1" \
  --pids-limit=50 \
  --network cloudbox-user-apps-net \
  --read-only \
  --tmpfs /tmp:size=10m \
  --env "START_CMD=${START_CMD}" \
  --label "cloudbox.instance=${INSTANCE_ID}" \
  --label "cloudbox.runtime=${TEMPLATE}" \
  "$IMAGE_NAME" 2>/dev/null)

# Stampa solo i primi 12 caratteri dell'ID (formato Docker corto)
echo "${CONTAINER_ID:0:12}"
