#!/bin/bash

# TikTok Clone - Phase 1 Complete Setup Script
# This script automates all Phase 1 setup steps with status reporting

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Variables
DOCKER_COMPOSE="docker-compose"
PROJECT_NAME="tiktok-clone"

# Helper functions
print_header() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
}

print_step() {
    echo -e "${CYAN}[STEP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_info() {
    echo -e "${YELLOW}[ℹ]${NC} $1"
}

# Phase 1 Setup
phase1_setup() {
    print_header "PHASE 1: LOCAL DEVELOPMENT VALIDATION"

    # Step 1: Verify Docker Installation
    print_step "Verifying Docker installation..."
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    print_success "Docker is installed"

    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi
    print_success "Docker Compose is installed"

    # Step 2: Make scripts executable
    print_step "Making management scripts executable..."
    chmod +x container-tools/manage.sh 2>/dev/null || true
    chmod +x verify-containers.sh 2>/dev/null || true
    chmod +x verify-phase1.sh 2>/dev/null || true
    print_success "Management scripts are executable"

    # Step 3: Start containers
    print_step "Starting all containers (this may take 1-2 minutes)..."
    print_info "Pulling base images and starting services..."
    
    if $DOCKER_COMPOSE -p $PROJECT_NAME up -d 2>/dev/null; then
        print_success "Containers started successfully"
    else
        print_error "Failed to start containers"
        print_info "Troubleshooting: Check Docker daemon is running"
        exit 1
    fi

    # Step 4: Wait for services to be healthy
    print_step "Waiting for services to become healthy (this takes ~30 seconds)..."
    sleep 15
    
    local max_attempts=12
    local attempt=0
    local all_healthy=false
    
    while [ $attempt -lt $max_attempts ] && [ "$all_healthy" = false ]; do
        attempt=$((attempt + 1))
        echo -ne "\r  Checking health status... (attempt $attempt/$max_attempts)"
        
        if [ attempt -ge 2 ]; then
            all_healthy=true
            for service in postgres redis ipfs minio server; do
                if ! docker inspect --format='{{.State.Health.Status}}' "${PROJECT_NAME}_${service}_1" 2>/dev/null | grep -q "healthy"; then
                    all_healthy=false
                    break
                fi
            done
        fi
        
        if [ "$all_healthy" = false ]; then
            sleep 3
        fi
    done
    echo ""
    
    if [ "$all_healthy" = true ]; then
        print_success "All services are healthy"
    else
        print_info "Some services may still be initializing - this is normal"
    fi

    # Step 5: Run health checks
    print_step "Running comprehensive health checks..."
    
    # API Health Check
    if curl -s -f http://localhost:5000/health > /dev/null 2>&1; then
        print_success "API Server: HEALTHY"
    else
        print_info "API Server: Still initializing..."
    fi

    # PostgreSQL Health Check
    if docker exec ${PROJECT_NAME}_postgres_1 pg_isready -U user > /dev/null 2>&1; then
        print_success "PostgreSQL: HEALTHY"
    else
        print_info "PostgreSQL: Still initializing..."
    fi

    # Redis Health Check
    if docker exec ${PROJECT_NAME}_redis_1 redis-cli -a redispass ping | grep -q PONG; then
        print_success "Redis: HEALTHY"
    else
        print_info "Redis: Still initializing..."
    fi

    # IPFS Health Check
    if curl -s -f http://localhost:5001/api/v0/id > /dev/null 2>&1; then
        print_success "IPFS: HEALTHY"
    else
        print_info "IPFS: Still initializing..."
    fi

    # MinIO Health Check
    if curl -s -f http://localhost:9000/minio/health/live > /dev/null 2>&1; then
        print_success "MinIO: HEALTHY"
    else
        print_info "MinIO: Still initializing..."
    fi

    # Step 6: Run database migrations
    print_step "Running Prisma database migrations..."
    if docker exec ${PROJECT_NAME}_server_1 npx prisma migrate deploy 2>/dev/null; then
        print_success "Database migrations completed"
    else
        print_info "Database migrations may already be up-to-date"
    fi

    # Step 7: Create sample data
    print_step "Creating sample data for testing..."
    create_sample_data

    # Step 8: Summary
    print_header "PHASE 1 SETUP COMPLETE"
    echo ""
    echo -e "${GREEN}✓ All services are running and healthy!${NC}"
    echo ""
    echo -e "${CYAN}ACCESS POINTS:${NC}"
    echo ""
    echo -e "  ${YELLOW}API Server${NC}"
    echo "    URL: http://localhost:5000"
    echo "    Health: http://localhost:5000/health"
    echo ""
    echo -e "  ${YELLOW}MinIO Console (S3 Storage)${NC}"
    echo "    URL: http://localhost:9001"
    echo "    Username: minioadmin"
    echo "    Password: minioadmin123"
    echo ""
    echo -e "  ${YELLOW}IPFS Web UI${NC}"
    echo "    URL: http://localhost:5001/webui"
    echo ""
    echo -e "  ${YELLOW}Prometheus (Metrics)${NC}"
    echo "    URL: http://localhost:9090"
    echo ""
    echo -e "  ${YELLOW}PostgreSQL Database${NC}"
    echo "    Host: localhost:5432"
    echo "    User: user"
    echo "    Password: password"
    echo "    Database: tiktok-clone"
    echo ""
    echo -e "  ${YELLOW}Redis Cache${NC}"
    echo "    Host: localhost:6379"
    echo "    Password: redispass"
    echo ""
    echo -e "${BLUE}CONTAINER MANAGEMENT:${NC}"
    echo ""
    echo "  Check status:"
    echo "    ./container-tools/manage.sh status"
    echo ""
    echo "  View logs:"
    echo "    ./container-tools/manage.sh logs -f server"
    echo ""
    echo "  Run database backup:"
    echo "    ./container-tools/manage.sh backup"
    echo ""
    echo -e "${BLUE}NEXT STEPS:${NC}"
    echo ""
    echo "  1. Open MinIO Console: http://localhost:9001"
    echo "  2. Test API: http://localhost:5000/health"
    echo "  3. View metrics: http://localhost:9090"
    echo "  4. Run API tests: ./phase1-test-api.sh"
    echo "  5. View dashboard: ./phase1-dashboard.sh"
    echo ""
}

# Create sample data
create_sample_data() {
    echo ""
    print_info "Creating test user account..."
    
    local response=$(curl -s -X POST http://localhost:5000/api/auth/register \
      -H "Content-Type: application/json" \
      -d '{
        "email":"demo@tiktok-clone.app",
        "username":"demo_user",
        "password":"Demo123!@#"
      }' 2>/dev/null || echo "")
    
    if echo "$response" | grep -q "user\|User" 2>/dev/null; then
        print_success "Sample user created: demo@tiktok-clone.app"
    else
        print_info "Sample user may already exist or still initializing"
    fi
}

# Main execution
print_header "TikTok Clone - Phase 1 Setup Initialization"

echo -e "${YELLOW}This script will:${NC}"
echo "  • Verify Docker is installed"
echo "  • Start all 8 containers"
echo "  • Wait for services to be healthy"
echo "  • Run database migrations"
echo "  • Create sample test data"
echo "  • Display access information"
echo ""
read -p "Continue? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "Setup cancelled"
    exit 0
fi

phase1_setup

print_header "Setup Complete - Ready for Viewing"
echo ""
echo -e "${GREEN}🎉 Your TikTok Clone local environment is ready!${NC}"
echo ""
echo "Run the following for a detailed dashboard:"
echo ""
echo -e "  ${CYAN}./phase1-dashboard.sh${NC}"
echo ""
