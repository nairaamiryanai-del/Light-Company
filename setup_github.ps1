$ErrorActionPreference = "Continue"

Write-Host "Step 1: Initializing Git..."
if (-not (Test-Path ".git")) {
    git init
} else {
    Write-Host "Git already initialized."
}

Write-Host "`nStep 2: Configuring Git Identity (Local)..."
# Setting local config for this repository to allow commit
git config user.email "naira@example.com"
git config user.name "Naira"

Write-Host "`nStep 3: Checking status..."
git status

Write-Host "`nStep 4: Adding all files..."
git add .

Write-Host "`nStep 5: Committing files..."
# Try to commit, ignore error if nothing to commit (but show output)
git commit -m "Initial commit of Light Company project"

Write-Host "`nStep 6: Setting branch to main..."
git branch -M main

Write-Host "`nStep 7: Configuring remote repository..."
# Remove origin if it exists to avoid errors, then re-add
git remote remove origin 2>$null
git remote add origin https://github.com/nairaamiryanai-del/Light-Company.git

Write-Host "`nStep 8: Pushing to GitHub..."
git push -u origin main

Write-Host "`nDone!"
