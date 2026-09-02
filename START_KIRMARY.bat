@echo off
cd /d "%~dp0"
if not exist package.json (
  echo ERROR: package.json was not found in this folder.
  pause
  exit /b 1
)
if not exist node_modules (
  echo Installing project packages...
  call npm install
  if errorlevel 1 (
    echo npm install failed. Check your internet connection and Node.js installation.
    pause
    exit /b 1
  )
)
start "" cmd /c "timeout /t 4 /nobreak >nul & start http://localhost:3000"
echo Starting KIRMARY website...
call npm run dev
pause
