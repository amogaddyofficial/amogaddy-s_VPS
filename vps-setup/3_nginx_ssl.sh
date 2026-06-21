#!/bin/bash
# ============================================================
# STEP 3 — Configurazione Nginx + SSL Let's Encrypt
# Esegui come root: bash 3_nginx_ssl.sh tuodominio.it
# ============================================================

set -e

DOMAIN="${1:-tuodominio.it}"
EMAIL="btpfab1@gmail.com"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Nginx + SSL per: $DOMAIN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# --- Config Nginx ---
echo "[1/4] Scrittura configurazione Nginx..."
cat > /etc/nginx/sites-available/vigilante << EOF
# ── Redirect HTTP → HTTPS ──
server {
    listen 80;
    server_name $DOMAIN;
    return 301 https://\$host\$request_uri;
}

# ── Server HTTPS principale ──
server {
    listen 443 ssl http2;
    server_name $DOMAIN;

    # Certificati SSL (generati da Certbot)
    ssl_certificate     /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;

    # Protocolli e cipher sicuri
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Header di sicurezza
    add_header X-Frame-Options        "SAMEORIGIN"    always;
    add_header X-Content-Type-Options "nosniff"       always;
    add_header X-XSS-Protection       "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # CORS per GitHub Pages
    add_header Access-Control-Allow-Origin  "https://amogaddyofficial.github.io" always;
    add_header Access-Control-Allow-Methods "GET, POST, OPTIONS"                  always;
    add_header Access-Control-Allow-Headers "Content-Type, Authorization"          always;

    # Rate limiting (zona definita nel blocco http)
    limit_req zone=api_limit burst=20 nodelay;

    # ── Reverse Proxy → Vigilante C (porta 8080) ──
    location /api/ {
        proxy_pass         http://127.0.0.1:8080/;
        proxy_http_version 1.1;
        proxy_set_header   Host              \$host;
        proxy_set_header   X-Real-IP         \$remote_addr;
        proxy_set_header   X-Forwarded-For   \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto \$scheme;
        proxy_read_timeout 30s;
        proxy_connect_timeout 5s;
    }

    # Health check pubblico
    location /health {
        proxy_pass http://127.0.0.1:8080/health;
    }

    # Blocca accesso a file sensibili
    location ~ /\. {
        deny all;
    }

    # Log
    access_log /var/log/nginx/vigilante_access.log;
    error_log  /var/log/nginx/vigilante_error.log;
}
EOF

# --- Rate limiting nel nginx.conf principale ---
echo "[2/4] Aggiunta rate limiting al nginx.conf..."
if ! grep -q "api_limit" /etc/nginx/nginx.conf; then
    sed -i '/http {/a\    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=30r/m;' \
        /etc/nginx/nginx.conf
fi

# --- Attiva il sito ---
ln -sf /etc/nginx/sites-available/vigilante /etc/nginx/sites-enabled/vigilante
nginx -t  # verifica sintassi
systemctl reload nginx
echo "  ✓ Nginx configurato."

# --- Certificato SSL ---
echo "[3/4] Richiesta certificato SSL Let's Encrypt..."
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "$EMAIL"
echo "  ✓ Certificato SSL installato."

# --- Rinnovo automatico ---
echo "[4/4] Configurazione rinnovo automatico SSL..."
(crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet && systemctl reload nginx") | crontab -
echo "  ✓ Rinnovo automatico ogni notte alle 03:00."

echo ""
echo "✓ Nginx + SSL completato!"
echo "  Sito raggiungibile su: https://$DOMAIN"
echo "  API backend: https://$DOMAIN/api/status"
echo "  Prossimo step: bash 4_systemd_service.sh"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
