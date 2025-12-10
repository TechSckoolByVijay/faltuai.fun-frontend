import { useState, useEffect } from 'react';
import { authService } from './authService.js';

/**
 * Custom React hook for authentication state management
 * @returns {object} Authentication state and methods
 */
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    setLoading(true);
    
    const authenticated = authService.isAuthenticated();
    setIsAuthenticated(authenticated);
    
    if (authenticated) {
      const userInfo = authService.getUserInfo();
      setUser(userInfo);
    } else {
      setUser(null);
    }
    
    setLoading(false);
  };

  const login = () => {
    authService.loginWithGoogle();
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleTokenReceived = (token) => {
    authService.setToken(token);
    checkAuthStatus();
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    checkAuthStatus,
    handleTokenReceived
  };
};