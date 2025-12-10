#!/bin/bash
# Setup script to extract frontend as standalone repository for GitHub Pages deployment

echo "🚀 Setting up Frontend as Standalone Repository"
echo "=============================================="

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the frontend directory"
    echo "Usage: cd frontend && bash setup-standalone.sh"
    exit 1
fi

# Variables
REPO_NAME="faltuai-frontend"
GITHUB_USERNAME=""

# Get GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ GitHub username is required"
    exit 1
fi

echo ""
echo "📋 Setup Instructions:"
echo "====================="
echo ""
echo "1. Create a new repository on GitHub:"
echo "   - Go to https://github.com/new"
echo "   - Repository name: $REPO_NAME (or your preferred name)"
echo "   - Make it public for GitHub Pages"
echo "   - Don't initialize with README (we'll push our own)"
echo ""
echo "2. Copy this frontend directory to a new location:"
echo "   mkdir ../$REPO_NAME"
echo "   cp -r . ../$REPO_NAME/"
echo "   cd ../$REPO_NAME"
echo ""
echo "3. Initialize git and connect to your new repo:"
echo "   git init"
echo "   git add ."
echo "   git commit -m \"Initial frontend setup\""
echo "   git branch -M main"
echo "   git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
echo "   git push -u origin main"
echo ""
echo "4. Enable GitHub Pages:"
echo "   - Go to your repo Settings → Pages"
echo "   - Source: Select 'GitHub Actions'"
echo "   - The workflow will deploy automatically on push"
echo ""
echo "5. Update environment variables:"
echo "   - Edit .env.pages with your backend URL"
echo "   - Edit .env.production for production deployment"
echo ""
echo "✅ Your frontend will be available at:"
echo "   https://$GITHUB_USERNAME.github.io/$REPO_NAME/"
echo ""
echo "📚 For more details, see .github/DEPLOYMENT.md"