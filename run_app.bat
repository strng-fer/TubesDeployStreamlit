@echo off
title Company Similarity Engine (FastAPI + React Vite)
echo ========================================================
echo   Starting Company Similarity Engine (FastAPI + Vite)
echo ========================================================
echo.

echo [1/2] Starting FastAPI Backend on http://localhost:8000...
start "FastAPI Backend" cmd /k "python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/2] Starting React Vite Frontend on http://localhost:5173...
cd frontend
start "React Frontend" cmd /k "npm run dev"

echo.
echo ========================================================
echo   Both services are starting!
echo   - Frontend: http://localhost:5173
echo   - Backend:  http://localhost:8000/docs
echo ========================================================
