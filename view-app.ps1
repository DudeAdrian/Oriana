# Ensure we are in the project root
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $scriptPath

# Check if Docker is running
if (!(docker info 2>$null)) {
    Write-Host "CRITICAL: Docker Desktop is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again." -ForegroundColor Yellow
    pause
    exit
}

# Get Local IP Address
$localIp = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -notlike "169.*" } | Select-Object -First 1).IPAddress
Write-Host "Detected Local IP: $localIp" -ForegroundColor Cyan

# Update Mobile Environment Variable
$envContent = "EXPO_PUBLIC_API_URL=http://$($localIp):5000/api"
Set-Content -Path "apps/mobile/.env" -Value $envContent

Write-Host "`n[1/2] Ensuring Backend is running in background..." -ForegroundColor Yellow
docker-compose up -d server postgres redis

Write-Host "[2/2] Launching Expo Dev Tool..." -ForegroundColor Yellow
Write-Host "Installing dependencies from root..."
npm install --legacy-peer-deps

Set-Location "$scriptPath\apps\mobile"
Write-Host "Ensuring Web Support dependencies..." -ForegroundColor Yellow
npm install react-native-web@~0.18.10 react-dom@18.2.0 @expo/webpack-config@^18.0.1 --legacy-peer-deps

Write-Host "`nOpening Dev Interface in web browser..." -ForegroundColor Green
npx expo start --web