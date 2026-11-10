# EventSphere Development Server Launcher
$env:PATH = "C:\Users\sanchitha\OneDrive\Documents\projects\_tools\node-v20.18.0-win-x64;" + $env:PATH
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " EventSphere Development Server (Node.js $($(& node -v)), npm $($(& npm -v)))" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
Set-Location -Path $PSScriptRoot
npm run dev
