# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- EXPORT STAGE ----------
FROM alpine:3.18 AS export
WORKDIR /export
COPY --from=builder /app/dist ./dist
