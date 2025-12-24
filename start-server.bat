@echo off
echo ========================================
echo Zypher Daily Planning Server - Startup Script
echo ========================================
echo.

echo [1/2] Checking Deno environment...
where deno >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Deno not found, please install Deno first
    echo Download: https://deno.land/
    pause
    exit /b 1
)

echo [2/2] Checking environment variables...
if not defined ANTHROPIC_API_KEY (
    echo Warning: ANTHROPIC_API_KEY environment variable not found
    echo Please ensure .env file exists and contains ANTHROPIC_API_KEY
)

echo.
echo Starting Zypher backend server...
echo.
echo ========================================
echo Server will run at http://localhost:3001
echo.
echo Endpoints:
echo - GET  /health              Health check
echo - POST /api/generate-plan   Generate daily plan
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

deno run --allow-all server.ts
