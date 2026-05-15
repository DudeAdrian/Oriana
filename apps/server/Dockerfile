# Multi-stage build for production optimization
FROM node:18-slim AS builder

WORKDIR /build

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev for Prisma generation)
RUN npm install --legacy-peer-deps

# Copy application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Production stage
FROM node:18-slim

LABEL maintainer="TikTok Clone Team"
LABEL description="TikTok Clone Backend Server - Production Image"

WORKDIR /app

# Install runtime dependencies (curl for healthchecks, aws-cli for backup)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user for security
RUN groupadd -g 1001 nodejs && \
    useradd -u 1001 -g nodejs nodejs

# Copy from builder
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/prisma ./prisma
COPY --from=builder /build/package*.json ./
COPY --chown=nodejs:nodejs . .

# Remove Prisma binaries compiled for Alpine and regenerate for Debian glibc
RUN rm -rf node_modules/.prisma && npm rebuild --verbose 2>&1 | tail -20

# Set environment
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=1024"

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=10s --timeout=5s --retries=5 --start-period=15s \
    CMD curl -f http://localhost:5000/health || exit 1

# Run as non-root user
USER nodejs

# Start application
CMD ["node", "src/index.js"]
