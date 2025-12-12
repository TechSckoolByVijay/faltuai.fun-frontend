import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth.js';
import { CONFIG } from '../config/backend.js';
import ThemeToggle from './ThemeToggle.jsx';

/**
 * Navigation component with authentication support
 */
const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700">
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
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/') 
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
                      isActive('/dashboard') 
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800'
                    }`}
                  >
                    Dashboard
                  </Link>
                  
                  <Link
                    to="/feature1"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/feature1') 
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800'
                    }`}
                  >
                    Feature 1
                  </Link>
                  
                  <Link
                    to="/resume-roast"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/resume-roast') 
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800'
                    }`}
                  >
                    🔥 Resume Roast
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 dark:text-gray-300 text-sm">
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
              <div className="text-gray-500 dark:text-gray-400 text-sm">
                Not authenticated
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;