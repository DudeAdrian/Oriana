@echo off
cd /d "%~dp0"
echo Setting up App Dev Tool...

REM Get Local IP Address
for /f "tokens=4" %%a in ('route print ^| findstr 0.0.0.0 ^| findstr /v "127.0.0.1"') do set LOCAL_IP=%%a
set LOCAL_IP=%LOCAL_IP: =%

echo Detected Local IP: %LOCAL_IP%

REM Update Mobile Environment Variable
echo EXPO_PUBLIC_API_URL=http://%LOCAL_IP%:5000/api > apps\mobile\.env

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker Desktop is not running!
    pause
    exit /b
)

echo.
echo [1/2] Ensuring Backend is running in background...
docker-compose up -d server postgres redis

echo.
echo [2/2] Launching Expo Dev Tool...
npm install --legacy-peer-deps
cd /d "%~dp0apps\mobile"
npm install react-native-web@~0.18.10 react-dom@18.2.0 @expo/webpack-config@^18.0.1 --legacy-peer-deps
npx expo start --web