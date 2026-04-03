# ─── Stage 1: Builder ───────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files from the backend directory
COPY backend/package*.json ./
RUN npm ci

# Copy backend source and compile
COPY backend/ .
RUN npm run build

# ─── Stage 2: Production Image ──────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Install only production dependencies
COPY backend/package*.json ./
RUN npm ci --production && npm cache clean --force

# Copy compiled output from builder stage
COPY --from=builder /app/dist ./dist

# nest-cli.json is needed at runtime
COPY backend/nest-cli.json ./

# Render.com auto-injects PORT
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:${PORT:-4000}/health || exit 1

CMD ["node", "dist/main"]
