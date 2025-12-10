# GitHub Pages Deployment

This document explains how the React frontend is automatically deployed to GitHub Pages.

## Repository Setup

This frontend is designed to be deployed as a **standalone repository** on GitHub Pages.

### Setup Instructions

1. **Create a new repository** for the frontend:
   ```bash
   # Create new repo on GitHub: your-username/faltuai-frontend
   git clone https://github.com/your-username/faltuai-frontend.git
   cd faltuai-frontend
   ```

2. **Copy frontend files**:
   ```bash
   # Copy all files from the original frontend/ directory
   cp -r /path/to/original/frontend/* .
   cp -r /path/to/original/frontend/.* .
   ```

3. **Push to new repository**:
   ```bash
   git add .
   git commit -m "Initial frontend setup"
   git push origin main
   ```

## Automatic Deployment

### Workflow Details

- **Trigger**: Push to `main` branch
- **Build Tool**: Vite
- **Node Version**: 18.x
- **Output**: Static files deployed to GitHub Pages

### Environment Configuration

- **Development** (`.env.development`): Local development
- **Production** (`.env.production`): Production deployment
- **GitHub Pages** (`.env.pages`): Demo deployment

### Enable GitHub Pages

1. Go to repository **Settings → Pages**
2. Source: Select "GitHub Actions"
3. The workflow will automatically deploy on push

### Manual Deployment

- Go to **Actions** tab in GitHub
- Select "Deploy React App to GitHub Pages"
- Click "Run workflow"

## Access

Once deployed, the frontend will be available at:
`https://your-username.github.io/repository-name/`

## Backend Configuration

Update `.env.pages` with your backend URL:
```bash
# For production backend
VITE_BACKEND_URL=https://your-backend-domain.com

# For local development (demo mode)
VITE_BACKEND_URL=http://localhost:8000
```

## Notes

- Deployment only occurs on `main` branch pushes
- The workflow includes both build and deploy jobs
- Pages environment requires specific GitHub permissions
- SPA routing is handled via `404.html` redirect