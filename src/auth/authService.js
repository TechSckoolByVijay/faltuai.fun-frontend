import { API_ENDPOINTS } from '../config/backend.js';

/**
 * Authentication Service
 * Handles all authentication-related operations
 */
export const authService = {
  /**
   * Redirect user to Google OAuth login
   */
  loginWithGoogle() {
    window.location.href = API_ENDPOINTS.AUTH.GOOGLE_LOGIN;
  },

  /**
   * Logout user - clear token and redirect
   */
  logout() {
    localStorage.removeItem('jwt_token');
    window.location.href = '/';
  },

  /**
   * Get stored JWT token
   * @returns {string|null} JWT token or null if not found
   */
  getToken() {
    return localStorage.getItem('jwt_token');
  },

  /**
   * Store JWT token in localStorage
   * @param {string} token - JWT token to store
   */
  setToken(token) {
    localStorage.setItem('jwt_token', token);
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} true if user has valid token
   */
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Simple JWT expiry check (decode payload)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      // If token has exp field, check if expired
      if (payload.exp && payload.exp < currentTime) {
        this.logout();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Invalid token format:', error);
      this.logout();
      return false;
    }
  },

  /**
   * Get user info from JWT token
   * @returns {object|null} User info or null if invalid token
   */
  getUserInfo() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        email: payload.sub,
        name: payload.name,
        // Add more user fields as needed
      };
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  }
};