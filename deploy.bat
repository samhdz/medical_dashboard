@echo off
echo ==========================================
echo Medical Studies Dashboard - Deployment
echo ==========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo X Python is not installed. Please install Python 3.11 or higher.
    exit /b 1
)

REM Check Python version
for /f "tokens=2" %%v in ('python --version 2^>^&1') do set PYTHON_VERSION=%%v
echo + Detected Python %PYTHON_VERSION%

REM Warn about Python 3.13 compatibility issues
echo %PYTHON_VERSION% | findstr "3.13" >nul
if not errorlevel 1 (
    echo ! WARNING: Python 3.13 detected. Some packages may have build issues.
    echo ! For best compatibility, consider using Python 3.11 or 3.12.
    echo.
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

REM Install dependencies using virtual environment
echo Installing Python dependencies...
if exist "venv\Scripts\python.exe" (
    echo   Upgrading pip...
    venv\Scripts\python.exe -m pip install --upgrade pip
    echo   Installing core dependencies...
    venv\Scripts\python.exe -m pip install -r requirements.txt
    if errorlevel 1 (
        echo   Core installation failed, trying with binary preference...
        venv\Scripts\python.exe -m pip install --prefer-binary -r requirements.txt
        if errorlevel 1 (
            echo.
            echo X Core dependency installation failed. Common solutions:
            echo   - Use Python 3.11 or 3.12 instead of 3.13
            echo   - Install Microsoft Visual C++ Build Tools
            pause
            exit /b 1
        )
    )
) else if exist "venv\bin\python.exe" (
    echo   Upgrading pip...
    venv\bin\python.exe -m pip install --upgrade pip
    echo   Installing core dependencies...
    venv\bin\python.exe -m pip install -r requirements.txt
    if errorlevel 1 (
        echo   Core installation failed, trying with binary preference...
        venv\bin\python.exe -m pip install --prefer-binary -r requirements.txt
        if errorlevel 1 (
            echo.
            echo X Core dependency installation failed. Common solutions:
            echo   - Use Python 3.11 or 3.12 instead of 3.13
            echo   - Install Microsoft Visual C++ Build Tools
            pause
            exit /b 1
        )
    )
) else (
    echo X Virtual environment Python executable not found!
    exit /b 1
)

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
if exist "venv\Scripts\python.exe" (
    start "Backend - FastAPI" cmd /k "venv\Scripts\python.exe -m uvicorn main:app --reload"
) else if exist "venv\bin\python.exe" (
    start "Backend - FastAPI" cmd /k "venv\bin\python.exe -m uvicorn main:app --reload"
) else (
    echo X Virtual environment Python executable not found!
    exit /b 1
)
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
