================================================================================
  amogaddy's VPS — GUIDA SETUP VPS COMPLETA
  Backend C + Nginx + systemd + SSL + Auto-deploy
================================================================================

PREREQUISITI
─────────────
- VPS Ubuntu 22.04 LTS (Scaleway, DigitalOcean, ecc.)
- Accesso root via SSH
- Un dominio puntato all'IP della VPS (es. api.tuodominio.it)
- Repository clonato in /opt/vigilante/repo/

ORDINE DI ESECUZIONE
─────────────────────
Esegui gli script nell'ordine numerato, tutti come root:

  1. bash 1_setup_base.sh
     → Aggiorna il sistema, installa pacchetti (gcc, nginx, certbot, ufw, fail2ban)
     → Crea utente 'vigilante', directory /opt/vigilante/
     → Clona il repository da GitHub
     → Configura UFW (apre solo porte 22, 80, 443)
     → Avvia fail2ban

  2. bash 2_compilare_vigilante.sh
     → Compila vigilante.c con gcc -O2 -pthread -lsqlite3
     → Produce il binario /opt/vigilante/bin/vigilante

  3. bash 3_nginx_ssl.sh tuodominio.it
     → Scrive la config Nginx con reverse proxy verso porta 8080
     → Rate limiting: 30 req/minuto per IP
     → Header CORS per GitHub Pages
     → Richiede certificato SSL gratuito da Let's Encrypt (Certbot)
     → Configura rinnovo automatico ogni notte alle 03:00

  4. bash 4_systemd_service.sh
     → Installa vigilante come servizio systemd
     → Riavvio automatico in caso di crash
     → Hardening: PrivateTmp, ProtectSystem, MemoryLimit 256MB

  5. bash 5_auto_deploy.sh
     → Confronta commit locale con GitHub
     → Se ci sono novità: git pull → ricompila → sostituzione atomica → riavvio
     → Health check post-deploy con rollback automatico

  6. bash 6_cron_jobs.sh --install
     → Installa i cron job automatici:
       • 12:00 IT ogni giorno  → reset istanze gratuite + controllo Caveau
       • 03:00 ogni domenica   → bilanciamento nodi (solo piano FREE)
       • ogni 6 ore            → controllo Caveau (inattività > 3gg)
       • ogni 5 minuti         → controllo aggiornamenti GitHub

ARCHITETTURA FINALE
────────────────────

  Internet
     │
     ▼
  ┌──────────────────────────────────────────┐
  │  Nginx (porta 443 HTTPS)                 │
  │  - Termina SSL (Let's Encrypt)           │
  │  - Rate limiting 30 req/min per IP       │
  │  - Header sicurezza (HSTS, X-Frame...)   │
  │  - CORS per GitHub Pages                 │
  └──────────────┬───────────────────────────┘
                 │ proxy_pass (solo /api/)
                 ▼
  ┌──────────────────────────────────────────┐
  │  Vigilante (C, porta 8080 localhost)     │
  │  - Server HTTP multi-thread (pthreads)   │
  │  - Rate limiting per IP (in memoria)     │
  │  - API: /status /instances /logs         │
  │  - API: POST /command (create,reset...)  │
  │  - Database SQLite in /opt/vigilante/    │
  └──────────────────────────────────────────┘
                 │
                 ▼
  ┌──────────────────────────────────────────┐
  │  SQLite (/opt/vigilante/data/            │
  │  vigilante.db)                           │
  │  - Tabella logs (timestamp, livello, msg)│
  │  - Tabella instances (id, piano, stato,  │
  │    nodo, runtime, wallet, last_seen)     │
  └──────────────────────────────────────────┘

API DISPONIBILI
────────────────

  GET  https://tuodominio.it/api/health
       → {"status":"ok","service":"vigilante"}

  GET  https://tuodominio.it/api/status
       → {"cpu_pct":12.3,"ram_total_mb":2048,"ram_used_mb":512,
          "uptime_h":72,"uptime_m":15,
          "instances":{"running":3,"sleeping":1,"caveau":0}}

  GET  https://tuodominio.it/api/instances
       → {"instances":[{"id":"app-A1B2C3","plan":"free","status":"running",
          "node":"free-node-gcp-1","runtime":"Python 3.11",...}]}

  GET  https://tuodominio.it/api/logs?limit=50
       → {"logs":[{"ts":"2024-01-15 12:00:00","level":"INFO","msg":"..."}]}

  POST https://tuodominio.it/api/command
       Body: {"action":"create-free"}
       → {"ok":true,"id":"app-A1B2C3","node":"free-node-gcp-2","runtime":"Node.js 20"}

       Body: {"action":"reset-12"}
       → {"ok":true,"action":"reset-12"}

       Body: {"action":"balance-cron"}
       → {"ok":true,"action":"balance-cron"}

       Body: {"action":"caveau-check"}
       → {"ok":true,"action":"caveau-check"}

SICUREZZA
──────────

  UFW (Firewall):
    - Blocca tutto in ingresso tranne porte 22, 80, 443
    - Comandi: ufw status verbose

  fail2ban:
    - Ban automatico dopo tentativi SSH falliti
    - Log: /var/log/fail2ban.log
    - Comandi: fail2ban-client status sshd

  Nginx rate limiting:
    - 30 richieste/minuto per IP sulla zona api_limit
    - Risponde 429 se superato

  Vigilante rate limiting (in C):
    - Aggiuntivo: 30 req/60s per IP direttamente nel processo
    - In memoria (si azzera al riavvio)

  systemd hardening:
    - NoNewPrivileges=yes
    - PrivateTmp=yes
    - ProtectSystem=strict
    - MemoryLimit=256M, CPUQuota=50%

MONITORAGGIO
─────────────

  # Stato servizio
  systemctl status vigilante

  # Log in tempo reale
  journalctl -u vigilante -f

  # Log Nginx
  tail -f /var/log/nginx/vigilante_access.log

  # Log cron jobs
  tail -f /opt/vigilante/logs/cron.log

  # Log deploy
  tail -f /opt/vigilante/logs/deploy.log

  # Risorse sistema
  htop

  # Test API locale
  curl http://localhost:8080/health
  curl http://localhost:8080/status

================================================================================
