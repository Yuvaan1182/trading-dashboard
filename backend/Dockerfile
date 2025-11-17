# ---------- BUILDER ----------
FROM golang:1.25-alpine AS builder

WORKDIR /app

# Enable Go modules + disable CGO
ENV CGO_ENABLED=0
ENV GOOS=linux
ENV GOARCH=amd64

# Install build tools (optional but keeps consistency)
RUN apk add --no-cache git build-base

# Copy go.mod & go.sum FIRST (cache dependencies)
COPY go.mod go.sum ./

# Download dependencies (cached)
RUN go mod download

# Copy the rest of the source
COPY . .

# Build binary with optimizations
RUN go build -trimpath -ldflags="-s -w" -o backend .

# ---------- FINAL IMAGE ----------
FROM alpine:3.18

RUN apk add --no-cache ca-certificates

WORKDIR /app

# Copy only the built binary
COPY --from=builder /app/backend .

# Non-root user
USER 1000

EXPOSE 8000

CMD ["./backend"]
