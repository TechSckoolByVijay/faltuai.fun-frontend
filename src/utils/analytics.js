// Lightweight Google Analytics helper wrapper
// Always use gtag('event', ...) as required
import { authService } from '../auth/authService.js';

const DEFAULT_MEASUREMENT_ID = 'G-45JJDT6CZR';

function _getUserId() {
  try {
    const info = authService.getUserInfo();
    if (info && info.email) return info.email;
  } catch (e) {
    // ignore
  }

  // fallback to stored value if app sets it elsewhere
  try {
    return window.__APP_USER_ID || localStorage.getItem('user_id') || null;
  } catch (e) {
    return null;
  }
}

function _sendEvent(eventName, payload = {}) {
  try {
    // ensure common props
    const userId = payload.user_id || _getUserId();
    const data = {
      ...payload,
      user_id: userId || undefined,
      timestamp: new Date().toISOString(),
    };

    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, data);
    } else {
      // non-blocking fallback: ensure dataLayer exists and push an event for later processing
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: eventName, ...data });
    }
  } catch (e) {
    // never throw from analytics
    // console.debug('analytics error', e);
  }
}

// Public API
export function trackEvent(eventName, params = {}, opts = {}) {
  // optional dedupe: if opts.onceKey set, avoid duplicate sends in same session
  try {
    if (opts.onceKey) {
      const key = `ga_once_${opts.onceKey}`;
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    }

    _sendEvent(eventName, params);
  } catch (e) {
    // swallow
  }
}

export function trackFeatureOpened(feature_name, extra = {}, opts = {}) {
  trackEvent('feature_opened', { feature_name, ...extra }, opts);
}

export function trackFeatureCompleted(feature_name, extra = {}, opts = {}) {
  trackEvent('feature_completed', { feature_name, ...extra }, opts);
}

export function trackFeatureFailed(feature_name, extra = {}, opts = {}) {
  trackEvent('feature_failed', { feature_name, ...extra }, opts);
}

export function trackAiOutputGenerated(feature_name, extra = {}, opts = {}) {
  trackEvent('ai_output_generated', { feature_name, ...extra }, opts);
}

export function trackUserEngaged(feature_name, extra = {}, opts = {}) {
  trackEvent('user_engaged', { feature_name, ...extra }, opts);
}

// Optional initializer to expose measurement id (index.html includes gtag script already)
export function initAnalytics(measurementId = DEFAULT_MEASUREMENT_ID) {
  if (typeof window === 'undefined') return;
  window.__GA_MEASUREMENT_ID = measurementId;
}

export default {
  trackEvent,
  trackFeatureOpened,
  trackFeatureCompleted,
  trackFeatureFailed,
  trackAiOutputGenerated,
  trackUserEngaged,
  initAnalytics,
};
