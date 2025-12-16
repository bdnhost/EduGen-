@echo off
echo Starting EduGen...
echo.

REM Start server in new window
echo Starting Server...
start "EduGen Server" cmd /k "npm --prefix server start"

REM Wait 3 seconds
timeout /t 3 /nobreak >nul

REM Start client in new window
echo Starting Client...
start "EduGen Client" cmd /k "npm run dev"

REM Wait 10 seconds
timeout /t 10 /nobreak >nul

REM Open browser
start http://localhost:3000

echo.
echo Done! Two windows opened:
echo   1. EduGen Server (backend)
echo   2. EduGen Client (frontend)
echo.
echo Browser opening at http://localhost:3000
echo.
pause
