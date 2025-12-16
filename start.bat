@echo off
echo.
echo ===============================================
echo   EduGen - Professional Guide Generator
echo ===============================================
echo.

REM Check if .env.local exists
if not exist ".env.local" (
    echo ERROR: .env.local not found!
    echo.
    echo Please create .env.local file with your API keys.
    echo You can copy .env.local.example and edit it:
    echo.
    echo    copy .env.local.example .env.local
    echo.
    echo Then edit .env.local and add your API keys.
    echo.
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing client dependencies...
    echo.
    call npm install
    echo.
)

REM Check if server/node_modules exists
if not exist "server\node_modules" (
    echo Installing server dependencies...
    echo.
    cd server
    call npm install
    cd ..
    echo.
)

echo [1/2] Starting Backend Server...
start "EduGen Server" cmd /k "cd server && npm start"

echo       Waiting for server to start...
timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend Client...
start "EduGen Client" cmd /k "npm run dev"

echo.
echo ===============================================
echo   EduGen is starting!
echo ===============================================
echo   Server:  http://localhost:5000
echo   Client:  http://localhost:3000
echo ===============================================
echo.
echo   Wait for both windows to finish loading
echo   Then the browser will open automatically...
echo.

timeout /t 10 /nobreak >nul

start http://localhost:3000

echo.
echo   Browser opened! You can close this window now.
echo.
timeout /t 3 /nobreak >nul
