# Stage 1: Build the Astro application

FROM node:22-bookworm-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx astro build --config astro.config.ssr.mjs

# Stage 2: Run the Astro server

FROM node:22-bookworm-slim AS runtime

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321
ARG HEALTH_CHECK_FAIL=false
ENV HEALTH_CHECK_FAIL=${HEALTH_CHECK_FAIL}

WORKDIR /app

COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/package.json ./package.json

USER node

EXPOSE 4321

CMD ["node", "./dist/server/entry.mjs"]
