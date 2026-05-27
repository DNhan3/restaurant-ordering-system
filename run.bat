@echo off
REM Batch helper to start backend (Nest) and frontend (Vite) in separate cmd windows
SET ROOT=%~dp0
START "Backend" cmd /k "cd /d "%ROOT%backend" && npm run start:dev"
START "Frontend" cmd /k "cd /d "%ROOT%frontend" && npm run dev"

echo Launched backend and frontend in new windows.
