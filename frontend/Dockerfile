# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install deps
RUN npm ci

# Copy entire frontend source
COPY . .

# Build Vite output -> /app/dist
RUN npm run build

# ---------- EXPORT STAGE ----------
# This stage exposes dist/ so docker-compose can mount it
FROM alpine:3.18 AS export

WORKDIR /app

# Copy built dist folder from builder
COPY --from=builder /app/dist ./dist

# Nothing runs here – only used to export dist folder
