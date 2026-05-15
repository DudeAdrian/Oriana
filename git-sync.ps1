# Ensure we are in the project root
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $scriptPath

Write-Host "Starting Git Alignment..." -ForegroundColor Cyan

# Initialize Git if not present
if (!(Test-Path ".git")) {
    Write-Host "Initializing new Git repository..." -ForegroundColor Yellow
    git init
}

# Add all files
Write-Host "Staging files..."
git add .

# Commit changes
Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "Phase 1: Local Development & Validation Complete - TikTok Clone Build"

Write-Host "`nReady to Push!" -ForegroundColor Green
Write-Host "If you have a remote URL, run: git remote add origin <URL>"
Write-Host "Then run: git push -u origin main"

Write-Host "`nAlignment Complete. All local changes are now tracked." -ForegroundColor Cyan
pause