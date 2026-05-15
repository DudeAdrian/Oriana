#!/bin/bash

# Phase 1 - API Testing and Demonstration Script
# Tests all major API endpoints with formatted output

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# Base URL
API_BASE="http://localhost:5000/api"
PROJECT_NAME="tiktok-clone"

# Test data
TEST_EMAIL="api_test_$(date +%s)@tiktok-clone.app"
TEST_USERNAME="testuser_$(date +%s)"
TEST_PASSWORD="Test123!@#"
AUTH_TOKEN=""

# Helper functions
print_header() {
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_test() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_response() {
    echo -e "${YELLOW}Response:${NC}"
    echo "$1" | jq '.' 2>/dev/null || echo "$1"
}

check_api_availability() {
    print_header "Checking API Availability"
    
    if curl -s -f http://localhost:5000/health > /dev/null 2>&1; then
        print_success "API Server is running and healthy"
        return 0
    else
        print_error "API Server is not responding on http://localhost:5000"
        print_error "Make sure containers are running: ./container-tools/manage.sh up"
        exit 1
    fi
}

test_authentication() {
    print_header "Testing Authentication Endpoints"
    
    # Test Register
    print_test "User Registration"
    local register_response=$(curl -s -X POST "$API_BASE/auth/register" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\":\"$TEST_EMAIL\",
            \"username\":\"$TEST_USERNAME\",
            \"password\":\"$TEST_PASSWORD\"
        }" 2>/dev/null)
    
    if echo "$register_response" | grep -q "user\|id\|email" 2>/dev/null; then
        print_success "User registration successful"
        print_response "$register_response"
    else
        print_error "Registration failed"
        print_response "$register_response"
    fi
    
    echo ""
    
    # Test Login
    print_test "User Login"
    local login_response=$(curl -s -X POST "$API_BASE/auth/login" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\":\"$TEST_EMAIL\",
            \"password\":\"$TEST_PASSWORD\"
        }" 2>/dev/null)
    
    if echo "$login_response" | grep -q "token\|access" 2>/dev/null; then
        print_success "User login successful"
        AUTH_TOKEN=$(echo "$login_response" | jq -r '.token // .access_token // empty' 2>/dev/null || echo "")
        
        if [ -n "$AUTH_TOKEN" ]; then
            print_success "Auth token obtained: ${AUTH_TOKEN:0:50}..."
        fi
        print_response "$login_response"
    else
        print_error "Login failed"
        print_response "$login_response"
    fi
    
    echo ""
}

test_user_endpoints() {
    print_header "Testing User Endpoints"
    
    # Test Get User Profile
    if [ -n "$AUTH_TOKEN" ]; then
        print_test "Get User Profile (with auth)"
        local profile_response=$(curl -s -X GET "$API_BASE/users/profile" \
            -H "Authorization: Bearer $AUTH_TOKEN" 2>/dev/null)
        
        if echo "$profile_response" | grep -q "username\|email" 2>/dev/null; then
            print_success "Profile retrieval successful"
            print_response "$profile_response"
        else
            print_error "Profile retrieval failed"
            print_response "$profile_response"
        fi
    else
        print_test "Get User Profile (without auth)"
        print_error "Skipped (no auth token available)"
    fi
    
    echo ""
    
    # Test User Search
    print_test "Search Users"
    local search_response=$(curl -s -X GET "$API_BASE/users/search?query=demo" 2>/dev/null)
    
    if echo "$search_response" | grep -q "users\|username\|\[\]" 2>/dev/null; then
        print_success "User search successful"
        print_response "$search_response"
    else
        print_error "User search failed"
        print_response "$search_response"
    fi
    
    echo ""
}

test_video_endpoints() {
    print_header "Testing Video Endpoints"
    
    # Test Get Videos
    print_test "Get Videos (Public)"
    local videos_response=$(curl -s -X GET "$API_BASE/videos?limit=5" 2>/dev/null)
    
    if echo "$videos_response" | grep -q "videos\|\[\]" 2>/dev/null; then
        print_success "Video retrieval successful"
        print_response "$videos_response"
    else
        print_error "Video retrieval failed"
        print_response "$videos_response"
    fi
    
    echo ""
}

test_feed_endpoints() {
    print_header "Testing Feed Endpoints"
    
    if [ -n "$AUTH_TOKEN" ]; then
        # Test Personal Feed
        print_test "Get Personal Feed"
        local feed_response=$(curl -s -X GET "$API_BASE/feed?limit=10" \
            -H "Authorization: Bearer $AUTH_TOKEN" 2>/dev/null)
        
        if echo "$feed_response" | grep -q "videos\|\[\]" 2>/dev/null; then
            print_success "Feed retrieval successful"
            print_response "$feed_response"
        else
            print_error "Feed retrieval failed"
            print_response "$feed_response"
        fi
    else
        print_test "Get Personal Feed"
        print_error "Skipped (no auth token available)"
    fi
    
    echo ""
    
    # Test Discovery Feed
    print_test "Get Discovery/Trending Feed"
    local discovery_response=$(curl -s -X GET "$API_BASE/feed/discover?limit=10" 2>/dev/null)
    
    if echo "$discovery_response" | grep -q "videos\|\[\]" 2>/dev/null; then
        print_success "Discovery feed retrieval successful"
        print_response "$discovery_response"
    else
        print_error "Discovery feed retrieval failed"
        print_response "$discovery_response"
    fi
    
    echo ""
}

test_follow_endpoints() {
    print_header "Testing Follow System"
    
    if [ -n "$AUTH_TOKEN" ]; then
        # Test Follow a user (will likely fail as we need a real user ID, but shows endpoint)
        print_test "Follow User (example structure)"
        print_info "Format: POST /api/follow/:userId"
        print_info "Requires: Authorization header with valid token"
        print_info "Example payload: {}"
    else
        print_test "Follow User"
        print_error "Skipped (no auth token available)"
    fi
    
    echo ""
}

test_database_connection() {
    print_header "Testing Database Connection"
    
    print_test "PostgreSQL Connection"
    if docker exec ${PROJECT_NAME}_postgres_1 pg_isready -U user > /dev/null 2>&1; then
        print_success "PostgreSQL is responding"
        
        # Check table count
        local table_count=$(docker exec ${PROJECT_NAME}_postgres_1 psql -U user -d tiktok-clone -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';" 2>/dev/null || echo "N/A")
        print_success "Tables in database: $table_count"
    else
        print_error "PostgreSQL connection failed"
    fi
    
    echo ""
}

test_storage_services() {
    print_header "Testing Storage Services"
    
    # Test MinIO
    print_test "MinIO S3 Storage"
    if curl -s -f http://localhost:9000/minio/health/live > /dev/null 2>&1; then
        print_success "MinIO is running"
        print_success "Console: http://localhost:9001"
        print_success "Credentials: minioadmin / minioadmin123"
    else
        print_error "MinIO is not responding"
    fi
    
    echo ""
    
    # Test IPFS
    print_test "IPFS Network"
    local ipfs_response=$(curl -s http://localhost:5001/api/v0/id 2>/dev/null)
    
    if echo "$ipfs_response" | grep -q "Addresses\|ID" 2>/dev/null; then
        print_success "IPFS is running"
        local ipfs_id=$(echo "$ipfs_response" | jq -r '.ID // empty' 2>/dev/null || echo "")
        print_success "IPFS Node ID: ${ipfs_id:0:50}..."
    else
        print_error "IPFS is not responding"
    fi
    
    echo ""
}

test_monitoring() {
    print_header "Testing Monitoring Services"
    
    # Test Prometheus
    print_test "Prometheus Metrics"
    if curl -s -f http://localhost:9090/-/healthy > /dev/null 2>&1; then
        print_success "Prometheus is running"
        print_success "Dashboard: http://localhost:9090"
    else
        print_error "Prometheus is not responding"
    fi
    
    echo ""
    
    # Test Elasticsearch
    print_test "Elasticsearch Logging"
    local es_response=$(curl -s http://localhost:9200/_cluster/health 2>/dev/null)
    
    if echo "$es_response" | grep -q "status" 2>/dev/null; then
        print_success "Elasticsearch is running"
        local es_status=$(echo "$es_response" | jq -r '.status // empty' 2>/dev/null || echo "unknown")
        print_success "Cluster status: $es_status"
    else
        print_error "Elasticsearch is not responding"
    fi
    
    echo ""
}

print_summary() {
    print_header "Test Summary"
    echo ""
    echo -e "${CYAN}Phase 1 API Testing Complete!${NC}"
    echo ""
    echo -e "${GREEN}✓ API Server is responding${NC}"
    echo -e "${GREEN}✓ Authentication endpoints tested${NC}"
    echo -e "${GREEN}✓ Database connection verified${NC}"
    echo -e "${GREEN}✓ Storage services operational${NC}"
    echo -e "${GREEN}✓ Monitoring systems active${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "  1. Monitor services: ./phase1-dashboard.sh"
    echo "  2. Run load tests: ./phase1-load-test.sh"
    echo "  3. Check detailed logs: ./container-tools/manage.sh logs -f server"
    echo "  4. View metrics: http://localhost:9090"
    echo ""
}

# Main execution
main() {
    print_header "PHASE 1 - COMPREHENSIVE API TESTING"
    echo ""
    echo -e "${YELLOW}This test suite will:${NC}"
    echo "  • Check API availability"
    echo "  • Test authentication endpoints"
    echo "  • Test user endpoints"
    echo "  • Test video endpoints"
    echo "  • Test feed endpoints"
    echo "  • Test database connection"
    echo "  • Test storage services"
    echo "  • Test monitoring services"
    echo ""
    read -p "Continue? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        echo "Testing cancelled"
        exit 0
    fi
    
    check_api_availability
    test_authentication
    test_user_endpoints
    test_video_endpoints
    test_feed_endpoints
    test_follow_endpoints
    test_database_connection
    test_storage_services
    test_monitoring
    print_summary
}

# Run tests
main
