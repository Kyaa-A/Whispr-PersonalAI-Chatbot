# Whispr Personal AI Chatbot Launcher
Write-Host "Starting Whispr Personal AI Chatbot..." -ForegroundColor Green

# Set location to script directory
Set-Location $PSScriptRoot

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "Warning: .env file not found!" -ForegroundColor Red
    Write-Host "Please make sure you have your .env file with GOOGLE_API_KEY" -ForegroundColor Red
}

# Start the application
Write-Host "Launching Whispr..." -ForegroundColor Green
npm start 