FROM python:3.11-slim

# Utente non-root per sicurezza
RUN useradd -m -u 1000 app
WORKDIR /home/app

COPY --chown=app:app . .

# Installa dipendenze se requirements.txt esiste
RUN if [ -f requirements.txt ]; then \
      pip install --no-cache-dir -r requirements.txt; \
    fi

USER app

# START_CMD viene iniettato da launch_app.sh come variabile d'ambiente
CMD sh -c "${START_CMD:-python main.py}"
