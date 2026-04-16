#!/bin/bash

# Setup Script for TikTok Clone - Australia Deployment
# This script sets up the development environment and AWS resources

set -e

echo "🚀 TikTok Clone - Australia Deployment Setup"
echo "==========================================="

# Check prerequisites
echo "✓ Checking prerequisites..."
command -v node &> /dev/null || { echo "Node.js is required"; exit 1; }
command -v docker &> /dev/null || { echo "Docker is required"; exit 1; }
command -v aws &> /dev/null || { echo "AWS CLI is required for production"; }

# Setup environment
echo "✓ Setting up environment..."
cp apps/server/.env.example apps/server/.env
cp apps/mobile/.env.example apps/mobile/.env

# Install dependencies
echo "✓ Installing dependencies..."
npm install
npm install -w apps/server
npm install -w apps/mobile

# Create Docker network
echo "✓ Creating Docker network..."
docker network create tiktok-net 2>/dev/null || true

# Start Docker services
echo "✓ Starting Docker services..."
docker-compose up -d

# Wait for services to be ready
echo "✓ Waiting for services to be ready..."
sleep 30

# Run Prisma migrations
echo "✓ Running Prisma migrations..."
cd apps/server
npx prisma migrate deploy || npx prisma migrate dev --name init
cd ../..

# Setup MinIO for local S3
echo "✓ Setting up MinIO S3 buckets..."
docker exec tiktok-minio mc alias set myminio http://localhost:9000 minioadmin minioadmin123 || true
docker exec tiktok-minio mc mb myminio/tiktok-clone 2>/dev/null || true
docker exec tiktok-minio mc mb myminio/tiktok-backups-au 2>/dev/null || true

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📍 Service URLs:"
echo "   API Server:        http://localhost:5000"
echo "   PostgreSQL:        localhost:5432"
echo "   Redis:             localhost:6379"
echo "   IPFS Gateway:      http://localhost:8080"
echo "   IPFS API:          http://localhost:5001"
echo "   MinIO Console:     http://localhost:9001"
echo "   MinIO S3:          http://localhost:9000"
echo ""
echo "🚀 Next Steps:"
echo "   1. Start the mobile app: npm run dev:mobile"
echo "   2. Open http://localhost:5000/health to verify API"
echo "   3. Access MinIO console: http://localhost:9001 (admin/admin123)"
echo ""
echo "📚 Useful Commands:"
echo "   - View logs:       docker-compose logs -f server"
echo "   - Stop services:   docker-compose down"
echo "   - Prisma Studio:   cd apps/server && npx prisma studio"
echo ""
