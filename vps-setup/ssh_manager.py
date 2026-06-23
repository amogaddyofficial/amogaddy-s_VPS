#!/usr/bin/env python3
"""
ssh_manager.py — Gestione centralizzata chiavi SSH per amogaddy's VPS
Espone una mini-API HTTP (porta 8081) chiamata dal frontend della dashboard.

Endpoint:
  GET  /keys          → lista chiavi in authorized_keys
  POST /keys          → aggiunge una chiave (body JSON: {"name": "...", "key": "ssh-rsa ..."})
  DELETE /keys/<id>   → rimuove la chiave con quell'indice
  GET  /vscode-config → scarica il file SSH config per VS Code Remote SSH
"""

import json
import os
import re
import hashlib
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse

AUTHORIZED_KEYS = os.path.expanduser("~/.ssh/authorized_keys")
VSCODE_HOST     = os.environ.get("VPS_HOST", "vps.amogaddy.it")
VSCODE_USER     = os.environ.get("VPS_USER", "app")
VSCODE_PORT     = int(os.environ.get("VPS_SSH_PORT", "22"))

# Garantisce che il file esista
os.makedirs(os.path.dirname(AUTHORIZED_KEYS), exist_ok=True)
if not os.path.exists(AUTHORIZED_KEYS):
    open(AUTHORIZED_KEYS, "a").close()
    os.chmod(AUTHORIZED_KEYS, 0o600)


def read_keys():
    """Ritorna lista di dict {id, name, key, fingerprint}."""
    keys = []
    with open(AUTHORIZED_KEYS) as f:
        for i, line in enumerate(f):
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            parts = line.split()
            if len(parts) < 2:
                continue
            comment = parts[2] if len(parts) > 2 else f"chiave-{i}"
            fp = hashlib.md5(parts[1].encode()).hexdigest()[:8]
            keys.append({"id": i, "name": comment, "key": line, "fingerprint": fp})
    return keys


def write_keys(keys):
    """Sovrascrive authorized_keys con la lista fornita."""
    with open(AUTHORIZED_KEYS, "w") as f:
        for k in keys:
            f.write(k["key"].strip() + "\n")
    os.chmod(AUTHORIZED_KEYS, 0o600)


def add_key(name: str, pub_key: str) -> bool:
    """Aggiunge una chiave validando il formato. Ritorna False se già presente."""
    if not re.match(r"^(ssh-rsa|ssh-ed25519|ecdsa-sha2-nistp256)\s+\S+", pub_key.strip()):
        raise ValueError("Formato chiave non valido")

    with open(AUTHORIZED_KEYS) as f:
        existing = f.read()
    key_part = pub_key.strip().split()[1]
    if key_part in existing:
        return False  # già presente

    # Aggiunge comment con il nome se mancante
    parts = pub_key.strip().split()
    if len(parts) == 2:
        pub_key = f"{pub_key.strip()} {name}"

    with open(AUTHORIZED_KEYS, "a") as f:
        f.write(pub_key.strip() + "\n")
    os.chmod(AUTHORIZED_KEYS, 0o600)
    return True


def remove_key(key_id: int):
    """Rimuove la chiave all'indice key_id (0-based sulle righe valide)."""
    keys = read_keys()
    if key_id < 0 or key_id >= len(keys):
        raise IndexError("ID chiave non valido")
    keys.pop(key_id)
    write_keys(keys)


def vscode_config():
    """Genera il blocco SSH config per VS Code Remote SSH."""
    keys = read_keys()
    identity_lines = ""
    if keys:
        identity_lines = "  IdentityFile ~/.ssh/id_ed25519\n"

    return (
        f"# Aggiungere a ~/.ssh/config\n\n"
        f"Host amogaddy-vps\n"
        f"  HostName {VSCODE_HOST}\n"
        f"  User {VSCODE_USER}\n"
        f"  Port {VSCODE_PORT}\n"
        f"{identity_lines}"
        f"  ServerAliveInterval 60\n"
        f"  ServerAliveCountMax 3\n"
    )


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        pass  # silenzia il log HTTP di default

    def _json(self, code, data):
        body = json.dumps(data).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", len(body))
        self.end_headers()
        self.wfile.write(body)

    def _text(self, code, text):
        body = text.encode()
        self.send_response(code)
        self.send_header("Content-Type", "text/plain")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Disposition", 'attachment; filename="ssh_config"')
        self.send_header("Content-Length", len(body))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/keys":
            self._json(200, {"keys": read_keys()})
        elif parsed.path == "/vscode-config":
            self._text(200, vscode_config())
        else:
            self._json(404, {"error": "not found"})

    def do_POST(self):
        if self.path != "/keys":
            self._json(404, {"error": "not found"})
            return
        length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(length))
        try:
            added = add_key(body["name"], body["key"])
            self._json(200, {"ok": True, "added": added})
        except (ValueError, KeyError) as e:
            self._json(400, {"error": str(e)})

    def do_DELETE(self):
        parts = self.path.strip("/").split("/")
        if len(parts) != 2 or parts[0] != "keys":
            self._json(404, {"error": "not found"})
            return
        try:
            remove_key(int(parts[1]))
            self._json(200, {"ok": True})
        except (IndexError, ValueError) as e:
            self._json(400, {"error": str(e)})


if __name__ == "__main__":
    server = HTTPServer(("127.0.0.1", 8081), Handler)
    print(f"ssh_manager in ascolto su 127.0.0.1:8081")
    print(f"authorized_keys: {AUTHORIZED_KEYS}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
