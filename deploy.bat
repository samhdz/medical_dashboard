@echo off
echo ==========================================
echo Medical Studies Dashboard - Deployment
echo ==========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo X Python is not installed. Please install Python 3.9 or higher.
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo X Node.js is not installed. Please install Node.js 16 or higher.
    exit /b 1
)

echo + Python and Node.js detected
echo.

REM Backend setup
echo Setting up backend...
cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing Python dependencies...
pip install -r requirements.txt

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
)

cd ..

REM Frontend setup
echo.
echo Setting up frontend...
cd frontend

REM Install dependencies
echo Installing Node.js dependencies...
call npm install

cd ..

REM Start services
echo.
echo ==========================================
echo Starting services...
echo ==========================================
echo.

REM Start backend
echo Starting backend on http://localhost:8000...
cd backend
call venv\Scripts\activate.bat
start "Backend - FastAPI" cmd /k "uvicorn main:app --reload"
cd ..

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
echo Starting frontend on http://localhost:5173...
cd frontend
start "Frontend - React" cmd /k "npm run dev"
cd ..

echo.
echo ==========================================
echo Deployment complete!
echo ==========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/docs
echo.
echo Two new windows have been opened for backend and frontend.
echo Close those windows to stop the services.
echo.
pause
