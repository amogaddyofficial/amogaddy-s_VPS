#!/bin/bash
# ============================================================
# STEP 4 — Servizio systemd per il Vigilante
# Esegui come root: bash 4_systemd_service.sh
# ============================================================

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Installazione servizio systemd Vigilante"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# --- Scrivi il file .service ---
cat > /etc/systemd/system/vigilante.service << 'EOF'
[Unit]
Description=amogaddy's VPS — Vigilante C Backend
Documentation=https://github.com/amogaddyofficial/amogaddy-s_VPS
After=network.target
Wants=network-online.target

[Service]
Type=simple
User=vigilante
Group=vigilante
WorkingDirectory=/opt/vigilante
ExecStart=/opt/vigilante/bin/vigilante
ExecReload=/bin/kill -HUP $MAINPID

# Riavvio automatico se crasha
Restart=on-failure
RestartSec=5s
StartLimitBurst=5
StartLimitInterval=60s

# Variabili d'ambiente
Environment=DB_PATH=/opt/vigilante/data/vigilante.db
Environment=LOG_PATH=/opt/vigilante/logs/vigilante.log

# Hardening systemd (isolamento processo)
NoNewPrivileges=yes
PrivateTmp=yes
ProtectSystem=strict
ReadWritePaths=/opt/vigilante/data /opt/vigilante/logs

# Limite risorse
LimitNOFILE=65536
MemoryLimit=256M
CPUQuota=50%

# Log a journald
StandardOutput=journal
StandardError=journal
SyslogIdentifier=vigilante

[Install]
WantedBy=multi-user.target
EOF

echo "  ✓ File service scritto."

# --- Ricarica systemd e avvia ---
systemctl daemon-reload
systemctl enable vigilante
systemctl start  vigilante

sleep 2
systemctl status vigilante --no-pager

echo ""
echo "✓ Servizio systemd attivo!"
echo ""
echo "  Comandi utili:"
echo "    systemctl status  vigilante   # stato"
echo "    systemctl restart vigilante   # riavvia"
echo "    journalctl -u vigilante -f    # log in tempo reale"
echo "    curl http://localhost:8080/health  # test locale"
echo ""
echo "  Prossimo step: bash 5_auto_deploy.sh"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
