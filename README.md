# Amogaddy's VPS Control Panel ![Beta](https://img.shields.io/badge/status-beta-orange) ![License](https://img.shields.io/badge/license-MIT-blue)

> Pannello di controllo leggero, **bit-level**, per gestire VPS e bot senza pannelli pesanti.  
> Live su **[BDEVS](https://bdevs.it/plugins/amogaddys-vps-beta)** · Frontend su **[GitHub Pages](https://amogaddyofficial.github.io/amogaddy-s_VPS/)**

---

## Cos'è

Amogaddy's VPS Control Panel è un pannello di gestione minimalista costruito per sviluppatori che vogliono **controllo totale** sulla propria infrastruttura senza installare pannelli pesanti come cPanel o Plesk.

| Caratteristica | Dettaglio |
|---|---|
| Frontend | React + Tailwind CSS, deploy su GitHub Pages |
| Backend | C puro (`vigilante.c`) + SQLite, gira sulla VPS |
| Orchestrazione | Docker + Docker Compose per isolamento dei progetti |
| SSH Management | API Python per gestire `authorized_keys` |
| Auto-ottimizzazione | **Chipping Engine** integrato |

---

## Architettura

```
[Browser]
    │
    ▼
[GitHub Pages]          ← Dashboard React (pubblica, zero costi)
    │  fetch API
    ▼
[VPS — Nginx :443]      ← Reverse proxy HTTPS
    │
    ├── /api/  →  vigilante  :8080   (backend C + SQLite)
    └── /ssh/  →  ssh_manager:8081   (gestione chiavi SSH)
                      │
                      ▼
               [Docker Engine]
               ├── container: bot-discord-xyz
               ├── container: api-node-abc
               └── container: app-python-def
```

Il **frontend** (dashboard, UI) vive su GitHub Pages ed è completamente statico — nessun server da mantenere.  
Il **backend** gira sulla tua VPS e gestisce i container Docker in tempo reale tramite API REST.

---

## Chipping Engine

Il **Chipping** è il modulo di auto-ottimizzazione che viene eseguito automaticamente dopo ogni deploy.

Elimina in modo chirurgico tutto ciò che non serve in produzione:

- `__pycache__/`, `.pytest_cache/`, `node_modules/.cache/`
- File `*.map`, `*.test.js`, `*.spec.py`
- Documentazione interna (`CHANGELOG.md`, `CONTRIBUTING.md`)
- File di log temporanei e `.env.example`

**Perché è utile?**  
Su VPS con storage limitato (come le istanze Always Free) ogni megabyte conta. Il Chipping può ridurre la dimensione di un container del 30-60% rispetto a un deploy grezzo, migliorando anche i tempi di avvio.

```bash
# Eseguito automaticamente, oppure manualmente:
./vps-setup/chipping.sh /opt/vigilante/projects/mio-bot
# [chipping] Dimensione prima: 48M
# [chipping] Dimensione dopo:  19M
```

---

## Quick Start

### Prerequisiti
- VPS Linux (Ubuntu 22.04+ consigliato) con accesso SSH
- Docker installato sulla VPS

### 1. Clona il repository sulla VPS

```bash
git clone https://github.com/amogaddyofficial/amogaddy-s_VPS.git
cd amogaddy-s_VPS
```

### 2. Lancia il setup automatico

```bash
sudo bash vps-setup/setup.sh
# Installa Docker, compila vigilante.c, configura Nginx e systemd
```

### 3. Collega la dashboard

Apri la dashboard su [GitHub Pages](https://amogaddyofficial.github.io/amogaddy-s_VPS/) e inserisci l'IP della tua VPS nella configurazione — la dashboard si collegherà automaticamente alle API.

### 4. Deploya la tua prima app

Dalla dashboard, clicca **"Lancia Applicazione"**, scegli il runtime (Python, Node.js, Go o HTML) e carica i file. Il pannello rileva automaticamente le dipendenze e crea un container Docker isolato.

---

## API Endpoints

| Metodo | Endpoint | Descrizione |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/status` | CPU, RAM, uptime, istanze attive |
| `GET` | `/api/instances` | Lista container in esecuzione |
| `POST` | `/api/deploy` | Crea e avvia un nuovo container |
| `POST` | `/api/container-stop` | Ferma un container |
| `GET` | `/api/container-logs?id=` | Log in tempo reale di un container |
| `GET` | `/ssh/keys` | Lista chiavi SSH autorizzate |
| `POST` | `/ssh/keys` | Aggiunge una chiave pubblica |

---

## Stack Tecnologico

```
Frontend    React 18 · Tailwind CSS · Vite · Lucide Icons
Backend     C (gcc) · SQLite3 · pthreads · Docker CLI
Proxy       Nginx · Let's Encrypt (Certbot)
SSH Mgr     Python 3.11 · stdlib only
Deploy      Docker · Docker Compose · systemd
```

---

## Prova il progetto

Il pannello è listato ufficialmente su **BDEVS**:

**[→ bdevs.it/plugins/amogaddys-vps-beta](https://bdevs.it/plugins/amogaddys-vps-beta)**

Hai testato il pannello? Lascia un **feedback sulla pagina BDEVS** — ogni segnalazione aiuta a migliorare la beta.

---

## Licenza

MIT © [amogaddyofficial](https://github.com/amogaddyofficial)
