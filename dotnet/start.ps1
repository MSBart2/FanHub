# FanHub .NET — start backend + frontend
# Works on Windows PowerShell 5+ and PowerShell Core (pwsh)
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

# ── Backend ───────────────────────────────────────────────────────────────────
Write-Host "▶ Starting backend (http://localhost:5265)..." -ForegroundColor Green
$backendCmd = @"
cd '$root\Backend'
dotnet restore --nologo -q
if (-not (dotnet ef --version 2>`$null)) {
    Write-Host '  Installing dotnet-ef tool...'
    dotnet tool install --global dotnet-ef
}
dotnet ef database update
dotnet run
"@
Start-Process pwsh -ArgumentList "-NoExit", "-Command", $backendCmd

# ── Wait for backend ──────────────────────────────────────────────────────────
Write-Host "  Waiting for backend to be ready..." -ForegroundColor Yellow
$ready = $false
for ($i = 0; $i -lt 30; $i++) {
    try {
        $null = Invoke-WebRequest -Uri "http://localhost:5265/api/shows" -UseBasicParsing -ErrorAction Stop
        Write-Host "  ✓ Backend ready" -ForegroundColor Green
        $ready = $true
        break
    }
    catch {
        Start-Sleep -Seconds 1
    }
}
if (-not $ready) { Write-Host "  ⚠ Backend may still be starting — check the other window" -ForegroundColor Yellow }

# ── Frontend ──────────────────────────────────────────────────────────────────
Write-Host "▶ Starting frontend (http://localhost:3000)..." -ForegroundColor Green
Set-Location "$root\Frontend"
dotnet restore --nologo -q
dotnet run
