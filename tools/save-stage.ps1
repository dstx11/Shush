param(
  [Parameter(Mandatory=$false)]
  [string]$Message = ""
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "=== SHUSH AUTO CHECKPOINT ===" -ForegroundColor Cyan

# Ensure script runs from repository root
$repoRoot = git rev-parse --show-toplevel
Set-Location $repoRoot

if ([string]::IsNullOrWhiteSpace($Message)) {
  $Message = "checkpoint $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
}

Write-Host ""
Write-Host "Repository:" $repoRoot
Write-Host "Commit message:" $Message

Write-Host ""
Write-Host "=== Current status ===" -ForegroundColor Cyan
git status --short

Write-Host ""
Write-Host "=== Running validation ===" -ForegroundColor Cyan

$validator = "scripts/validate_shush_static.py"

if (Test-Path $validator) {
  $pythonCmd = $null

  if (Get-Command python -ErrorAction SilentlyContinue) {
    $pythonCmd = "python"
  }
  elseif (Get-Command py -ErrorAction SilentlyContinue) {
    $pythonCmd = "py"
  }

  if ($pythonCmd) {
    & $pythonCmd $validator
    if ($LASTEXITCODE -ne 0) {
      Write-Host ""
      Write-Host "Validation failed. Commit aborted." -ForegroundColor Red
      exit 1
    }
  }
  else {
    Write-Host "Python/py not found. Skipping validator." -ForegroundColor Yellow
  }
}
else {
  Write-Host "Validator not found. Skipping validation." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Checking diff ===" -ForegroundColor Cyan
git diff --stat

Write-Host ""
Write-Host "=== Staging files ===" -ForegroundColor Cyan
git add .

# Check if there is anything staged
git diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
  Write-Host ""
  Write-Host "No changes to commit." -ForegroundColor Yellow
  exit 0
}

Write-Host ""
Write-Host "=== Creating commit ===" -ForegroundColor Cyan
git commit -m $Message

Write-Host ""
Write-Host "=== Done ===" -ForegroundColor Green
git status --short
git log --oneline --max-count=3
