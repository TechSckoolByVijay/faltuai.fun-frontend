// Backend configuration - reads from environment variable
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// API endpoints configuration
export const API_ENDPOINTS = {
  AUTH: {
    GOOGLE_LOGIN: `${BACKEND_URL}/auth/google/login`,
    LOGOUT: `${BACKEND_URL}/auth/logout`,
  },
  FEATURE1: {
    HELLO: `${BACKEND_URL}/feature1/hello`,
  },
  RESUME_ROAST: {
    STYLES: `${BACKEND_URL}/api/v1/resume-roast/styles`,
    ROAST_TEXT: `${BACKEND_URL}/api/v1/resume-roast/roast-text`,
    UPLOAD_AND_ROAST: `${BACKEND_URL}/api/v1/resume-roast/upload-and-roast`,
    EXTRACT_TEXT: `${BACKEND_URL}/api/v1/resume-roast/extract-text`,
    DEMO: `${BACKEND_URL}/api/v1/resume-roast/demo`,
  },
  NEWSLETTER: {
    SUBSCRIBE: `${BACKEND_URL}/api/v1/newsletter/subscribe`,
    UNSUBSCRIBE: `${BACKEND_URL}/api/v1/newsletter/unsubscribe`,
    CHECK_STATUS: `${BACKEND_URL}/api/v1/newsletter/check`,
    STATS: `${BACKEND_URL}/api/v1/newsletter/stats`,
  }
};

// Default configuration
export const CONFIG = {
  APP_NAME: 'FaltooAI',
  TAGLINE: 'Small Extras. Big Productivity.',
  DESCRIPTION: 'Because a Little Extra Creates Big Value',
  VERSION: '1.0.0',
  ENVIRONMENT: import.meta.env.MODE || 'development',
  BACKEND_URL: BACKEND_URL
};