# Secure-Salma.ps1 - Script simplifié de sécurisation
Write-Host "=== SÉCURISATION PROJET SALMA ===" -ForegroundColor Green
Write-Host "Début : $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Gray

# 1. Vérifier qu'on est dans un dépôt Git
if (-not (Test-Path ".git")) {
    Write-Host "❌ ERREUR : Pas dans un dépôt Git" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dépôt Git détecté" -ForegroundColor Green

# 2. Scanner les secrets rapidement
Write-Host "`n🔍 SCAN RAPIDE DES SECRETS" -ForegroundColor Cyan
Write-Host "------------------------" -ForegroundColor Cyan

$secretsFound = $false
$patterns = @("password", "secret", "token", "api_key")

foreach ($pattern in $patterns) {
    $results = git log -p --all --full-history | Select-String -Pattern $pattern -CaseSensitive:$false -ErrorAction SilentlyContinue
    if ($results) {
        Write-Host "⚠️  '$pattern' trouvé dans l'historique" -ForegroundColor Yellow
        $secretsFound = $true
    }
}

if (-not $secretsFound) {
    Write-Host "✅ Aucun secret évident trouvé" -ForegroundColor Green
}

# 3. Créer les fichiers essentiels
Write-Host "`n📄 CRÉATION DES FICHIERS ESSENTIELS" -ForegroundColor Cyan
Write-Host "--------------------------------" -ForegroundColor Cyan

# .gitignore
if (-not (Test-Path ".gitignore")) {
    @"
# Exclusion des fichiers sensibles
.env
.env.local
node_modules/
__pycache__/
*.pyc
*.db
*.sqlite3
*.key
*.pem
.vscode/
.idea/
.DS_Store
npm-debug.log*
"@ | Out-File .gitignore -Encoding UTF8
    Write-Host "✅ .gitignore créé" -ForegroundColor Green
} else {
    Write-Host "✅ .gitignore déjà présent" -ForegroundColor Green
}

# SECURITY.md
if (-not (Test-Path "SECURITY.md")) {
    @"
# Politique de Sécurité
Contact en cas de faille : [votre-email]
Ne jamais commettre de secrets.
"@ | Out-File SECURITY.md -Encoding UTF8
    Write-Host "✅ SECURITY.md créé" -ForegroundColor Green
} else {
    Write-Host "✅ SECURITY.md déjà présent" -ForegroundColor Green
}

# 4. Vérifier les fichiers sensibles actuels
Write-Host "`n📁 VÉRIFICATION DES FICHIERS SENSIBLES" -ForegroundColor Cyan
$sensitive = Get-ChildItem -Recurse -Include "*.env", "*.key", "*.pem" -ErrorAction SilentlyContinue
if ($sensitive) {
    Write-Host "⚠️  Fichiers à vérifier :" -ForegroundColor Yellow
    $sensitive | ForEach-Object { Write-Host "   - $($_.Name)" }
} else {
    Write-Host "✅ Aucun fichier .env, .key, .pem trouvé" -ForegroundColor Green
}

# 5. Instructions GitHub
Write-Host "`n🌐 ACTIONS SUR GITHUB À FAIRE :" -ForegroundColor Magenta
Write-Host "   1. Aller sur : https://github.com/SalmaAissi/Malick/settings/branches" -ForegroundColor White
Write-Host "   2. Cliquer 'Add branch protection rule'" -ForegroundColor White
Write-Host "   3. Appliquer à 'main'" -ForegroundColor White
Write-Host "   4. Cochez :" -ForegroundColor White
Write-Host "      - Require pull request before merging" -ForegroundColor White
Write-Host "      - Require approvals (1 minimum)" -ForegroundColor White
Write-Host "      - Include administrators" -ForegroundColor White
Write-Host "   5. Cliquer 'Create'" -ForegroundColor White

Write-Host "`n⏱️  Script terminé à $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Green
Write-Host "📋 Exécutez 'git status' pour voir les changements" -ForegroundColor Cyan
