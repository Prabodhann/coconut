# ─── Stage 1: Builder ───────────────────────────────────────────────
# Installs ALL deps (including devDeps like @nestjs/cli, typescript)
# Compiles TypeScript → dist/
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first — Docker caches this layer separately
# so npm ci only re-runs when package.json actually changes
COPY package*.json ./
RUN npm ci

# Copy rest of source and compile
COPY . .
RUN npm run build

# ─── Stage 2: Production Image ──────────────────────────────────────
# Starts fresh — no devDependencies, no TypeScript source
# Result: ~180 MB image instead of ~600 MB
FROM node:20-alpine AS production

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy compiled output from builder stage
COPY --from=builder /app/dist ./dist

# nest-cli.json is referenced at runtime by some NestJS internals
COPY nest-cli.json ./

# Render.com automatically injects PORT — your main.ts already reads it ✅
# process.env.PORT || 4000
EXPOSE 4000

# Health check — Render pings this to confirm container is ready
# Waits 30s before first check (NestJS + Mongoose connection takes a moment)
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:${PORT:-4000}/health || exit 1

CMD ["node", "dist/main"]
