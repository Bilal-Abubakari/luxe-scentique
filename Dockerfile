# ─── Stage 1: Install dependencies ───────────────────────────────────────────
FROM node:24-alpine AS deps
WORKDIR /app
# Copy manifests and Prisma schema first (layer-cache friendly)
COPY package*.json ./
COPY apps/api/prisma ./apps/api/prisma
# Install ALL deps (skip postinstall — prisma generate runs in builder stage)
RUN npm ci --ignore-scripts
# ─── Stage 2: Build the API ───────────────────────────────────────────────────
FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generate Prisma client for linux-musl
# A dummy .env is required because Prisma 5.x WASM config validation reads dotenv, not process.env
# It makes no real connection — DATABASE_URL is only used at runtime
RUN echo "DATABASE_URL=postgresql://user:pass@localhost:5432/db" > .env \
    && npx prisma generate --schema=apps/api/prisma/schema.prisma \
    && rm .env
# Build the NestJS API bundle
RUN npx nx build api --configuration=production
# ─── Stage 3: Production runtime ─────────────────────────────────────────────
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Copy the bundled app
COPY --from=builder /app/dist/apps/api ./dist/apps/api
# Copy node_modules (includes the generated .prisma/client binaries)
COPY --from=builder /app/node_modules ./node_modules
# Copy Prisma schema + migrations (needed by migrate deploy at startup)
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
# Copy root package.json (needed for the start:prod script)
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
# 1. Apply any pending migrations safely
# 2. Start the app
CMD ["sh", "-c", "npx prisma migrate deploy --schema=apps/api/prisma/schema.prisma && node dist/apps/api/main.js"]
