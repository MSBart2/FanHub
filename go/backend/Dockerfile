# Build stage
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copy go mod files
COPY go.mod ./
# COPY go.sum ./  # Intentional bug: commented out, might cause issues

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
# Intentional bug: No CGO_ENABLED=0, may cause portability issues
RUN go build -o main .

# Run stage
FROM alpine:latest

WORKDIR /root/

# Intentional bug: Running as root user (security issue)
# Should use: RUN addgroup -g 1000 appuser && adduser -D -u 1000 -G appuser appuser

# Copy binary from builder
COPY --from=builder /app/main .

# Intentional bug: No healthcheck defined

EXPOSE 8090

# Intentional bug: No signal handling for graceful shutdown
CMD ["./main"]
