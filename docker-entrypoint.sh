#!/bin/sh
# Regenerate the Angular dev environment from container env vars, then serve.
set -e

: "${API_URL:=http://localhost:5135/api}"

ENV_FILE="src/environments/environment.development.ts"
cat > "$ENV_FILE" <<EOF
export const environment = {
    production: false,
    apiUrl: '${API_URL}'
};
EOF
echo "[entrypoint] ${ENV_FILE}: apiUrl=${API_URL}"

# --live-reload/--watch off: source is baked into the image, and the dev server's
# live-reload WebSocket doesn't survive Docker Desktop's Windows port proxy
# (every reconnect triggers a full page reload).
exec npx ng serve --host 0.0.0.0 --port 4300 --configuration development \
  --live-reload false --watch false
