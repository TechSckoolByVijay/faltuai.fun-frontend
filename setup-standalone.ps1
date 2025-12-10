# Setup Frontend as Standalone Repository
# PowerShell version of setup script

Write-Host "🚀 Setting up Frontend as Standalone Repository" -ForegroundColor Green
Write-Host "=" * 50

# Check if we're in the frontend directory
if (!(Test-Path "package.json")) {
    Write-Host "❌ Error: Please run this script from the frontend directory" -ForegroundColor Red
    Write-Host "Usage: cd frontend; .\setup-standalone.ps1"
    exit 1
}

# Variables
$RepoName = "faltuai-frontend"
$GitHubUsername = Read-Host "Enter your GitHub username"

if ([string]::IsNullOrEmpty($GitHubUsername)) {
    Write-Host "❌ GitHub username is required" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📋 Setup Instructions:" -ForegroundColor Yellow
Write-Host "=" * 25

Write-Host ""
Write-Host "1. Create a new repository on GitHub:" -ForegroundColor Cyan
Write-Host "   - Go to https://github.com/new"
Write-Host "   - Repository name: $RepoName (or your preferred name)"
Write-Host "   - Make it public for GitHub Pages"
Write-Host "   - Don't initialize with README (we'll push our own)"

Write-Host ""
Write-Host "2. Copy this frontend directory to a new location:" -ForegroundColor Cyan
Write-Host "   mkdir ..\\$RepoName"
Write-Host "   Copy-Item -Recurse -Path . -Destination ..\\$RepoName\\"
Write-Host "   cd ..\\$RepoName"

Write-Host ""
Write-Host "3. Initialize git and connect to your new repo:" -ForegroundColor Cyan
Write-Host "   git init"
Write-Host "   git add ."
Write-Host "   git commit -m 'Initial frontend setup'"
Write-Host "   git branch -M main"
Write-Host "   git remote add origin https://github.com/$GitHubUsername/$RepoName.git"
Write-Host "   git push -u origin main"

Write-Host ""
Write-Host "4. Enable GitHub Pages:" -ForegroundColor Cyan
Write-Host "   - Go to your repo Settings → Pages"
Write-Host "   - Source: Select 'GitHub Actions'"
Write-Host "   - The workflow will deploy automatically on push"

Write-Host ""
Write-Host "5. Update environment variables:" -ForegroundColor Cyan
Write-Host "   - Edit .env.pages with your backend URL"
Write-Host "   - Edit .env.production for production deployment"

Write-Host ""
Write-Host "✅ Your frontend will be available at:" -ForegroundColor Green
Write-Host "   https://$GitHubUsername.github.io/$RepoName/"

Write-Host ""
Write-Host "📚 For more details, see .github\\DEPLOYMENT.md" -ForegroundColor Blue