# Dev-server image for the `smart_tablev1` module-federation remote.
FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci || npm install

COPY . .

EXPOSE 4300

# angular.json pins host: localhost for serve - override so the container port is reachable.
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--port", "4300"]
