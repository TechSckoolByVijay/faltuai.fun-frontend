import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth.js';
import { CONFIG } from '../config/backend.js';
import { FEATURE_NAV_ITEMS } from '../config/features.js';
import ThemeToggle from './ThemeToggle.jsx';

/**
 * Navigation component with authentication support
 */
const Navbar = () => {
  const { isAuthenticated, user, logout, login } = useAuth();
  const location = useLocation();
  const [isFeaturesMenuOpen, setIsFeaturesMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const featuresMenuRef = useRef(null);

  const isExactActive = (path) => location.pathname === path;
  const isSectionActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);
  const isAnyFeatureActive = FEATURE_NAV_ITEMS.some((feature) => isSectionActive(feature.path));

  useEffect(() => {
    setIsFeaturesMenuOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (featuresMenuRef.current && !featuresMenuRef.current.contains(event.target)) {
        setIsFeaturesMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main nav */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-xl font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              {CONFIG.APP_NAME}
            </Link>
            
            {/* Main navigation links */}
            <div className="ml-10 hidden md:flex items-baseline space-x-2">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isExactActive('/') 
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                Home
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isExactActive('/dashboard') 
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800'
                    }`}
                  >
                    Dashboard
                  </Link>

                  <div className="relative" ref={featuresMenuRef}>
                    <button
                      type="button"
                      onClick={() => setIsFeaturesMenuOpen((prev) => !prev)}
                      className={`px-3 py-2 rounded-md text-sm font-medium inline-flex items-center gap-2 ${
                        isAnyFeatureActive
                          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span>Features</span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                        {FEATURE_NAV_ITEMS.length}
                      </span>
                      <span className="text-xs">▾</span>
                    </button>

                    {isFeaturesMenuOpen && (
                      <div className="absolute left-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 py-2">
                        {FEATURE_NAV_ITEMS.map((feature) => (
                          <Link
                            key={feature.key}
                            to={feature.path}
                            className={`block px-4 py-3 border-l-2 ${
                              isSectionActive(feature.path)
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                                : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                          >
                            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {feature.icon} {feature.label}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {feature.description}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle navigation menu"
            >
              <span>{isMobileMenuOpen ? '✕' : '☰'}</span>
            </button>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="hidden sm:inline text-gray-700 dark:text-gray-300 text-sm">
                  Welcome, {user?.name || user?.email || 'User'}
                </span>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={login}
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
              >
                Login
              </button>
            )}
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                isExactActive('/')
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Home
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className={`block px-3 py-2 rounded-md text-sm font-medium ${
                    isExactActive('/dashboard')
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  Dashboard
                </Link>

                <div className="px-3 pt-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Features
                </div>

                {FEATURE_NAV_ITEMS.map((feature) => (
                  <Link
                    key={feature.key}
                    to={feature.path}
                    className={`block px-3 py-2 rounded-md text-sm ${
                      isSectionActive(feature.path)
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {feature.icon} {feature.label}
                  </Link>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;