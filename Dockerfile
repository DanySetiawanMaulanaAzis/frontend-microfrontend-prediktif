# Module-federation remote (smart_tablev1). Runs `ng serve` (dev server), not a
# production build - the shell loads http://<host>:4300/remoteEntry.js in the browser.
FROM node:22-bookworm-slim

WORKDIR /app

# Install dependencies against the lockfile first for layer caching.
COPY package.json package-lock.json ./
RUN npm ci

# App source (node_modules / .angular excluded via .dockerignore).
COPY . .
RUN chmod +x docker-entrypoint.sh

# Browser-facing URL of the smart_table backend API. Overridden by compose.
ENV API_URL=http://localhost:5135/api \
    NODE_OPTIONS=--max-old-space-size=4096

EXPOSE 4300
ENTRYPOINT ["./docker-entrypoint.sh"]
