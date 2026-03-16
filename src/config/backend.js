// Backend configuration - reads from environment variable
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// API endpoints configuration
export const API_ENDPOINTS = {
  AUTH: {
    GOOGLE_LOGIN: `${BACKEND_URL}/auth/google/login`,
    LOGOUT: `${BACKEND_URL}/auth/logout`,
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
  },
  SKILL_ASSESSMENT: {
    START: `${BACKEND_URL}/api/v1/skill-assessment/start`,
    SUBMIT: (assessmentId) => `${BACKEND_URL}/api/v1/skill-assessment/assessment/${assessmentId}/submit`,
    LEARNING_PLAN: (assessmentId) => `${BACKEND_URL}/api/v1/skill-assessment/assessment/${assessmentId}/learning-plan`,
    DASHBOARD: (assessmentId) => `${BACKEND_URL}/api/v1/skill-assessment/assessment/${assessmentId}/dashboard`,
    EXPORT_PDF: (assessmentId) => `${BACKEND_URL}/api/v1/skill-assessment/assessment/${assessmentId}/export/pdf`,
    LIST_ASSESSMENTS: `${BACKEND_URL}/api/v1/skill-assessment/assessments`,
  },
  CRINGE_METER: {
    ANALYZE: `${BACKEND_URL}/api/v1/cringe/analyze`,
  },
  EMAIL_SMOOTHENER: {
    SMOOTHEN: `${BACKEND_URL}/api/v1/email-smoothener/smoothen`,
  },
  IDEA_SPARK: {
    GENERATE: `${BACKEND_URL}/api/v1/idea-spark/generate`,
  },
  NAME_CRAFT: {
    GENERATE: `${BACKEND_URL}/api/v1/name-craft/generate`,
  },
  PRODUCT_IDEAS: {
    SUBMIT: `${BACKEND_URL}/api/v1/product-ideas/submit`,
    ADMIN_LIST: `${BACKEND_URL}/api/v1/product-ideas/admin`,
    ADMIN_UPDATE: (ideaId) => `${BACKEND_URL}/api/v1/product-ideas/admin/${ideaId}`,
    ADMIN_DELETE: (ideaId) => `${BACKEND_URL}/api/v1/product-ideas/admin/${ideaId}`,
    ADMIN_EXPORT_CSV: `${BACKEND_URL}/api/v1/product-ideas/admin/export/csv`,
  },
  ADMIN: {
    OVERVIEW: `${BACKEND_URL}/api/v1/admin/analytics/overview`,
    FEATURE_USERS: (featureKey) => `${BACKEND_URL}/api/v1/admin/analytics/features/${featureKey}/users`,
    FEATURE_QUESTIONS: (featureKey) => `${BACKEND_URL}/api/v1/admin/analytics/features/${featureKey}/questions`,
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