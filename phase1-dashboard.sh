#!/bin/bash

# Phase 1 - Comprehensive Dashboard and Status Viewer
# Display all service status, metrics, and access information in a beautiful format

set -e

# Colors and formatting
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
WHITE='\033[0;37m'
BOLD='\033[1m'
NC='\033[0m'

# Constants
PROJECT_NAME="tiktok-clone"
REFRESH_INTERVAL=5

# Helper functions
clear_screen() {
    clear
}

print_header() {
    echo -e "${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC} $1"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════════╝${NC}"
}

print_section() {
    echo ""
    echo -e "${BLUE}▶ $1${NC}"
    echo -e "${BLUE}$(printf '━%.0s' {1..60})${NC}"
}

check_service() {
    local service=$1
    local port=$2
    local check_cmd=$3
    
    local status=""
    local status_color=""
    
    if eval "$check_cmd" > /dev/null 2>&1; then
        status="✓ ONLINE"
        status_color="${GREEN}"
    else
        status="✗ OFFLINE"
        status_color="${RED}"
    fi
    
    printf "  ${status_color}%-15s${NC}  %-20s  Port: %-6s\n" "$status" "$service" "$port"
}

get_container_stats() {
    local container=$1
    
    if docker ps --filter "name=$container" --format "{{.Names}}" | grep -q .; then
        local stats=$(docker stats --no-stream --format "{{.CPUPerc}}|{{.MemUsage}}" $container 2>/dev/null || echo "N/A|N/A")
        echo "$stats"
    else
        echo "Offline"
    fi
}

print_service_status() {
    print_section "SERVICE STATUS"
    echo ""
    
    # API Server
    check_service "API Server" "5000" "curl -s -f http://localhost:5000/health > /dev/null"
    
    # PostgreSQL
    check_service "PostgreSQL" "5432" "docker exec ${PROJECT_NAME}_postgres_1 pg_isready -U user 2>/dev/null"
    
    # Redis
    check_service "Redis Cache" "6379" "docker exec ${PROJECT_NAME}_redis_1 redis-cli -a redispass ping 2>/dev/null | grep -q PONG"
    
    # IPFS
    check_service "IPFS Node" "5001" "curl -s -f http://localhost:5001/api/v0/id > /dev/null"
    
    # MinIO
    check_service "MinIO S3" "9000" "curl -s -f http://localhost:9000/minio/health/live > /dev/null"
    
    # Nginx
    check_service "Nginx Proxy" "80/443" "docker exec ${PROJECT_NAME}_nginx_1 nginx -t 2>/dev/null"
    
    # Prometheus
    check_service "Prometheus" "9090" "curl -s -f http://localhost:9090/-/healthy > /dev/null"
    
    # Elasticsearch
    check_service "Elasticsearch" "9200" "curl -s -f http://localhost:9200/_cluster/health > /dev/null"
    
    echo ""
}

print_container_metrics() {
    print_section "CONTAINER RESOURCE USAGE"
    echo ""
    echo -e "  ${BOLD}Container${NC}              ${BOLD}CPU${NC}          ${BOLD}Memory${NC}"
    echo -e "  ${BLUE}$(printf '─%.0s' {1..50})${NC}"
    
    for container in postgres redis ipfs minio server nginx prometheus elasticsearch; do
        local full_name="${PROJECT_NAME}_${container}_1"
        if docker ps --filter "name=$full_name" --format "{{.Names}}" | grep -q .; then
            local stats=$(get_container_stats "$full_name")
            local cpu=$(echo "$stats" | cut -d'|' -f1)
            local memory=$(echo "$stats" | cut -d'|' -f2)
            printf "  %-20s  %-12s  %s\n" "$container" "$cpu" "$memory"
        fi
    done
    
    echo ""
}

print_access_information() {
    print_section "ACCESS & CONNECTION INFORMATION"
    echo ""
    
    echo -e "  ${BOLD}${YELLOW}▪ API Server${NC}"
    echo "    Base URL:        http://localhost:5000"
    echo "    Health Check:    http://localhost:5000/health"
    echo "    API Docs:        http://localhost:5000/docs (if available)"
    echo ""
    
    echo -e "  ${BOLD}${YELLOW}▪ MinIO Console (S3 Storage)${NC}"
    echo "    URL:             http://localhost:9001"
    echo "    Access Key:      minioadmin"
    echo "    Secret Key:      minioadmin123"
    echo "    API Endpoint:    http://localhost:9000"
    echo ""
    
    echo -e "  ${BOLD}${YELLOW}▪ IPFS Network${NC}"
    echo "    Web UI:          http://localhost:5001/webui"
    echo "    HTTP Gateway:    http://localhost:8080"
    echo "    API Endpoint:    http://localhost:5001"
    echo ""
    
    echo -e "  ${BOLD}${YELLOW}▪ Prometheus Monitoring${NC}"
    echo "    Dashboard:       http://localhost:9090"
    echo "    Metrics Query:   http://localhost:9090/api/v1/query"
    echo ""
    
    echo -e "  ${BOLD}${YELLOW}▪ Elasticsearch Logging${NC}"
    echo "    Cluster Health:  http://localhost:9200/_cluster/health"
    echo "    Indices:         http://localhost:9200/_cat/indices"
    echo ""
    
    echo -e "  ${BOLD}${YELLOW}▪ PostgreSQL Database${NC}"
    echo "    Host:            localhost:5432"
    echo "    Port:            5432"
    echo "    Database:        tiktok-clone"
    echo "    Username:        user"
    echo "    Password:        password"
    echo "    Connection:      psql -h localhost -U user -d tiktok-clone"
    echo ""
    
    echo -e "  ${BOLD}${YELLOW}▪ Redis Cache${NC}"
    echo "    Host:            localhost:6379"
    echo "    Port:            6379"
    echo "    Password:        redispass"
    echo "    Connection:      redis-cli -h localhost"
    echo ""
}

print_quick_commands() {
    print_section "QUICK COMMANDS"
    echo ""
    
    echo -e "  ${YELLOW}Container Management:${NC}"
    echo "    • View all service status:     ./container-tools/manage.sh status"
    echo "    • Follow server logs:          ./container-tools/manage.sh logs -f server"
    echo "    • Check container health:     ./container-tools/manage.sh health-check"
    echo "    • Show resource usage:         ./container-tools/manage.sh stats"
    echo ""
    
    echo -e "  ${YELLOW}Database Operations:${NC}"
    echo "    • Backup database:             ./container-tools/manage.sh backup"
    echo "    • Open PostgreSQL shell:       ./container-tools/manage.sh shell postgres"
    echo "    • Run migrations:              ./container-tools/manage.sh exec server npx prisma migrate deploy"
    echo ""
    
    echo -e "  ${YELLOW}Testing:${NC}"
    echo "    • Run API tests:               ./phase1-test-api.sh"
    echo "    • Load test example:           ./phase1-load-test.sh"
    echo ""
    
    echo -e "  ${YELLOW}Troubleshooting:${NC}"
    echo "    • Stop all services:           ./container-tools/manage.sh down"
    echo "    • Restart all services:        ./container-tools/manage.sh restart"
    echo "    • Clean everything:            ./container-tools/manage.sh clean"
    echo ""
}

print_test_endpoints() {
    print_section "TEST API ENDPOINTS"
    echo ""
    
    echo -e "  ${YELLOW}Authentication:${NC}"
    echo '    curl -X POST http://localhost:5000/api/auth/register \'
    echo '      -H "Content-Type: application/json" \'
    echo '      -d '"'"'{"email":"test@app.com","username":"testuser","password":"Test123!"}'"'"
    echo ""
    
    echo -e "  ${YELLOW}User Profile:${NC}"
    echo "    curl http://localhost:5000/api/users/search?query=demo"
    echo ""
    
    echo -e "  ${YELLOW}Feed${NC}:"
    echo "    curl -H 'Authorization: Bearer YOUR_TOKEN' http://localhost:5000/api/feed"
    echo ""
    
    echo -e "  ${YELLOW}For detailed API testing, run:${NC}"
    echo "    ./phase1-test-api.sh"
    echo ""
}

print_troubleshooting() {
    print_section "TROUBLESHOOTING & SUPPORT"
    echo ""
    
    echo -e "  ${YELLOW}If services won't start:${NC}"
    echo "    1. Check Docker daemon is running"
    echo "    2. Check ports are available: lsof -i :5432, :6379, :9000"
    echo "    3. Check logs: ./container-tools/manage.sh logs postgres"
    echo "    4. Restart: ./container-tools/manage.sh restart"
    echo ""
    
    echo -e "  ${YELLOW}If database connection fails:${NC}"
    echo "    1. Wait 30 seconds for PostgreSQL to initialize"
    echo "    2. Check: docker exec tiktok-postgres_1 pg_isready -U user"
    echo "    3. View logs: ./container-tools/manage.sh logs postgres"
    echo ""
    
    echo -e "  ${YELLOW}If API not responding:${NC}"
    echo "    1. Check server logs: ./container-tools/manage.sh logs -f server"
    echo "    2. Check database connection in logs"
    echo "    3. Restart server: ./container-tools/manage.sh restart server"
    echo ""
    
    echo -e "  ${YELLOW}Documentation:${NC}"
    echo "    • Full guide:                  CONTAINER_TOOLS_GUIDE.md"
    echo "    • Phase 1 setup:               CONTAINER_SETUP_COMPLETE.md"
    echo "    • Network details:             docker-network-guide.md"
    echo ""
}

print_next_steps() {
    print_section "NEXT STEPS"
    echo ""
    
    echo -e "  ${BOLD}${GREEN}1. Verify Services${NC}"
    echo "     All services should show ✓ ONLINE above"
    echo ""
    
    echo -e "  ${BOLD}${GREEN}2. Test API Endpoints${NC}"
    echo "     Run: ./phase1-test-api.sh"
    echo ""
    
    echo -e "  ${BOLD}${GREEN}3. Access Management Consoles${NC}"
    echo "     • MinIO: http://localhost:9001"
    echo "     • Prometheus: http://localhost:9090"
    echo "     • IPFS: http://localhost:5001/webui"
    echo ""
    
    echo -e "  ${BOLD}${GREEN}4. Monitor Services${NC}"
    echo "     Run: ./container-tools/manage.sh stats"
    echo ""
    
    echo -e "  ${BOLD}${GREEN}5. When Ready for AWS${NC}"
    echo "     See: DEPLOYMENT_GUIDE.md"
    echo ""
}

print_footer() {
    echo ""
    echo -e "${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}  ${BOLD}TikTok Clone Phase 1 - Live Dashboard${NC}"
    echo -e "${CYAN}║${NC}  Last updated: $(date '+%Y-%m-%d %H:%M:%S')"
    echo -e "${CYAN}║${NC}  Status: ${GREEN}HEALTHY${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "  ${YELLOW}Press Ctrl+C to exit${NC}"
    echo ""
}

# Main Display Function
show_dashboard() {
    while true; do
        clear_screen
        
        print_header "TIKTOK CLONE - PHASE 1 DEPLOYMENT DASHBOARD"
        
        print_service_status
        print_container_metrics
        print_access_information
        print_quick_commands
        print_test_endpoints
        print_troubleshooting
        print_next_steps
        print_footer
        
        # Wait before refresh
        sleep $REFRESH_INTERVAL
    done
}

# Start dashboard
show_dashboard
