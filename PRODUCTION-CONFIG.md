# Production Configuration Guide

## 🚀 Azure Container App Integration

Your backend is now deployed at:
```
https://faltuai.reddune-c0e74598.centralindia.azurecontainerapps.io/
```

## ✅ Configuration Updates Made

### Frontend Environment Files Updated

**Production Environment** (`.env.production`):
```env
VITE_BACKEND_URL=https://faltuai.reddune-c0e74598.centralindia.azurecontainerapps.io
VITE_APP_NAME=FaltuAI Fun
VITE_DEBUG=false
VITE_BASE_PATH=/
```

**GitHub Pages Environment** (`.env.pages`):
```env
VITE_BACKEND_URL=https://faltuai.reddune-c0e74598.centralindia.azurecontainerapps.io
VITE_APP_NAME=FaltuAI Fun (GitHub Pages)
VITE_DEBUG=false
VITE_DEMO_MODE=false
VITE_BASE_PATH=/faltuai.fun-frontend/
```

### Backend OAuth Redirect URI

The backend now automatically detects production environment and uses:
```
https://faltuai.reddune-c0e74598.centralindia.azurecontainerapps.io/auth/google/callback
```

## 🔧 Required Google OAuth Setup

**IMPORTANT**: Update your Google Cloud Console OAuth configuration:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Edit your **OAuth 2.0 Client ID**
4. Add this authorized redirect URI:
   ```
   https://faltuai.reddune-c0e74598.centralindia.azurecontainerapps.io/auth/google/callback
   ```

## 🌐 Frontend Deployment URLs

### GitHub Pages (Recommended for Demo)
After deployment, your frontend will be available at:
```
https://techsckoolbyvijay.github.io/faltuai.fun-frontend/
```

### Local Development
For local development, keep using:
```
http://localhost:5173
```

## 🔗 OAuth Flow (Production)

1. **User clicks login** → `Container App /auth/google/login`
2. **Backend redirects to Google** → `Google OAuth consent`
3. **Google redirects back** → `Container App /auth/google/callback`
4. **Backend processes & redirects** → `Frontend /#/auth/callback?token=jwt`

## 📱 Testing the Integration

### Test API Connectivity
```bash
# Check if backend is accessible
curl https://faltuai.reddune-c0e74598.centralindia.azurecontainerapps.io/

# Test health endpoint
curl https://faltuai.reddune-c0e74598.centralindia.azurecontainerapps.io/health
```

### Frontend Environment Testing
```bash
# Build with production environment
npm run build

# Or build for GitHub Pages
npm run build:pages
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**: Backend automatically allows frontend domains
2. **OAuth Redirect Mismatch**: Ensure Google Console has correct redirect URI
3. **Environment Variables**: Check that correct `.env` file is being used

### Debug Steps

1. **Check backend logs**:
   ```bash
   az containerapp logs show \
     --name faltuai-backend-app \
     --resource-group faltuai-rg \
     --follow
   ```

2. **Verify OAuth configuration**:
   ```bash
   # Test OAuth initiation
   curl -v https://faltuai.reddune-c0e74598.centralindia.azurecontainerapps.io/auth/google/login
   ```

3. **Check environment detection**:
   Look for backend logs showing which redirect URI is being used

## ✨ Next Steps

1. **Update Google OAuth** with new redirect URI (CRITICAL)
2. **Deploy frontend** to GitHub Pages or your preferred hosting
3. **Test full authentication flow**
4. **Monitor backend logs** for any issues

Your production environment is now configured and ready! 🎉