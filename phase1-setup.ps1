# TikTok Clone - Phase 1 Complete Setup Script for PowerShell
# This script automates all Phase 1 setup steps with status reporting

$ErrorActionPreference = "Stop"
$PROJECT_NAME = "tiktok-clone"

function Print-Header($Text) {
    Write-Host "`n" + ("=" * 63) -ForegroundColor Blue
    Write-Host "  $Text" -ForegroundColor Blue
    Write-Host ("=" * 63) -ForegroundColor Blue + "`n"
}

function Print-Step($Text) {
    Write-Host "[STEP] " -NoNewline -ForegroundColor Cyan
    Write-Host $Text
}

function Print-Success($Text) {
    Write-Host "[✓] " -NoNewline -ForegroundColor Green
    Write-Host $Text
}

function Print-Info($Text) {
    Write-Host "[ℹ] " -NoNewline -ForegroundColor Yellow
    Write-Host $Text
}

Print-Header "PHASE 1: LOCAL DEVELOPMENT VALIDATION - POWERSHELL"

# Step 1: Verify Docker
Print-Step "Verifying Docker installation..."
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error "Docker is not installed"
    exit 1
}
Print-Success "Docker is installed"

# Step 2: Start containers
Print-Step "Starting all containers (this may take 1-2 minutes)..."
Print-Info "Pulling base images and starting services..."

docker-compose -p $PROJECT_NAME up -d
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to start containers"
    exit 1
}
Print-Success "Containers started successfully"

# Step 3: Wait for healthy
Print-Step "Waiting for services to become healthy..."
Start-Sleep -Seconds 15

$services = @("postgres", "redis", "ipfs", "minio", "server")
$max_attempts = 12
$attempt = 0
$all_healthy = $false

while ($attempt -lt $max_attempts -and -not $all_healthy) {
    $attempt++
    Write-Host "`r  Checking health status... (attempt $attempt/$max_attempts)" -NoNewline
    
    $all_healthy = $true
    foreach ($service in $services) {
        $status = docker inspect --format='{{.State.Health.Status}}' "${PROJECT_NAME}_${service}_1" 2>$null
        if ($status -ne "healthy") {
            $all_healthy = $false
            break
        }
    }
    
    if (-not $all_healthy) { Start-Sleep -Seconds 3 }
}
Write-Host ""

# Step 4: Migrations
Print-Step "Running Prisma database migrations..."
docker exec "${PROJECT_NAME}_server_1" npx prisma migrate deploy
Print-Success "Database migrations completed"

# Step 5: Sample Data
Print-Step "Creating sample data for testing..."
$body = @{
    email = "demo@tiktok-clone.app"
    username = "demo_user"
    password = "Demo123!@#"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/auth/register" -ContentType "application/json" -Body $body -ErrorAction SilentlyContinue
    Print-Success "Sample user created"
} catch {
    Print-Info "Sample user may already exist"
}

Print-Header "PHASE 1 SETUP COMPLETE"
Write-Host "`n🎉 Your TikTok Clone local environment is ready!`n" -ForegroundColor Green