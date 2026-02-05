# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Run stage
FROM node:18-alpine

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy build from builder
COPY --from=builder /app/build ./build

# Intentional bug: No non-root user
# Should use: USER node

EXPOSE 3003

# Intentional bug: Using serve in production without proper config
CMD ["serve", "-s", "build", "-l", "3003"]
