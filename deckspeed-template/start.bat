@echo off
echo ========================================
echo Daily Planning Assistant - Startup Script
echo ========================================
echo.

echo [1/3] Checking Node.js environment...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js not found, please install Node.js first
    echo Download: https://nodejs.org/
    pause
    exit /b 1
)

echo [2/3] Checking dependencies...
if not exist "node_modules\" (
    echo First run, installing dependencies...
    echo This may take a few minutes, please be patient...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo Error: Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo Dependencies already installed
)

echo.
echo [3/3] Starting React development server...
echo.
echo ========================================
echo Application will open at http://localhost:3000
echo.
echo Important Notes:
echo - Frontend runs on port 3000
echo - Backend API service required on port 3001
echo - Press Ctrl+C to stop the server
echo ========================================
echo.

call npm start
