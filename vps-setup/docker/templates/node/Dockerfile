FROM node:20-alpine

RUN addgroup -S app && adduser -S app -G app
WORKDIR /home/app

COPY --chown=app:app package*.json ./
RUN if [ -f package.json ]; then npm install --omit=dev --no-audit; fi

COPY --chown=app:app . .

USER app

CMD sh -c "${START_CMD:-node index.js}"
