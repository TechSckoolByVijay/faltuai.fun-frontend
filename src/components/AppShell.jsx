import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useAuth } from '../auth/useAuth.js';
import { CONFIG } from '../config/backend.js';
import { SIDEBAR_NAV_SECTIONS } from '../config/features.js';
import ThemeToggle from './ThemeToggle.jsx';

const AppShell = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsProfileMenuOpen(false);
  }, [location.pathname]);

  const isRouteActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  const filteredSections = useMemo(() => {
    const isSuperUser = Boolean(user?.is_super_user);
    const normalized = searchText.trim().toLowerCase();

    const roleFilteredSections = SIDEBAR_NAV_SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter((item) => !item.requiresSuperUser || isSuperUser),
    })).filter((section) => section.items.length > 0);

    if (!normalized) {
      return roleFilteredSections;
    }

    return roleFilteredSections.map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        const haystack = `${item.label} ${item.description || ''}`.toLowerCase();
        return haystack.includes(normalized);
      }),
    })).filter((section) => section.items.length > 0);
  }, [searchText, user?.is_super_user]);

  const renderSidebarItems = () =>
    filteredSections.map((section) => (
      <div key={section.key} className="mb-5">
        {!isSidebarCollapsed && (
          <div className="px-3 mb-2 text-[11px] uppercase tracking-wide font-semibold text-gray-500 dark:text-gray-400">
            {section.title}
          </div>
        )}

        <div className="space-y-1">
          {section.items.map((item) => {
            const active = item.path ? isRouteActive(item.path) : false;
            const baseClasses = `w-full rounded-lg transition px-3 py-2 flex items-center gap-3 ${
              active
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/60 dark:text-primary-300'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`;

            const disabledClasses = 'opacity-55 cursor-not-allowed text-gray-500 dark:text-gray-400';

            if (!item.path || item.disabled) {
              return (
                <div key={item.key} className={`${baseClasses} ${disabledClasses}`} title={item.description || item.label}>
                  <span className="text-base min-w-[20px] text-center">{item.icon}</span>
                  {!isSidebarCollapsed && (
                    <div className="text-left">
                      <div className="text-sm font-medium">{item.label}</div>
                      {item.description && <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link key={item.key} to={item.path} className={baseClasses} title={item.description || item.label}>
                <span className="text-base min-w-[20px] text-center">{item.icon}</span>
                {!isSidebarCollapsed && (
                  <div>
                    <div className="text-sm font-medium">{item.label}</div>
                    {item.description && <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    ));

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50">
      <div className="flex h-full">
        <aside
          className={`hidden md:flex md:flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-all duration-200 ${
            isSidebarCollapsed ? 'md:w-20' : 'md:w-80'
          }`}
        >
          <div className="h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4">
            <Link to="/dashboard" className="font-bold text-lg text-primary-600 dark:text-primary-400">
              {isSidebarCollapsed ? 'F' : CONFIG.APP_NAME}
            </Link>
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed((prev) => !prev)}
              className="p-1.5 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle sidebar"
            >
              {isSidebarCollapsed ? '»' : '«'}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3">{renderSidebarItems()}</div>
        </aside>

        {isMobileSidebarOpen && (
          <>
            <div
              className="md:hidden fixed inset-0 z-40 bg-black/50"
              onClick={() => setIsMobileSidebarOpen(false)}
              aria-hidden="true"
            />
            <aside className="md:hidden fixed left-0 top-0 h-full w-80 max-w-[85vw] z-50 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
              <div className="h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4">
                <Link to="/dashboard" className="font-bold text-lg text-primary-600 dark:text-primary-400">
                  {CONFIG.APP_NAME}
                </Link>
                <button
                  type="button"
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1.5 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Close sidebar"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3">{renderSidebarItems()}</div>
            </aside>
          </>
        )}

        <div className="flex-1 min-w-0 flex flex-col">
          <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm flex items-center px-4 sm:px-6 gap-3">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Open sidebar"
            >
              ☰
            </button>

            <Link to="/dashboard" className="font-bold text-primary-600 dark:text-primary-400 hidden sm:inline">
              {CONFIG.APP_NAME}
            </Link>

            <div className="hidden md:flex flex-1 max-w-md">
              <input
                type="text"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search tools..."
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="ml-auto flex items-center gap-3">
              <ThemeToggle />
              <Link
                to="/product-ideas"
                className="inline-flex items-center justify-center px-3 py-2 rounded-md bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium"
                title="Submit product idea"
                aria-label="Submit product idea"
              >
                Submit Idea
              </Link>

              <div className="relative" ref={profileMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200"
                  aria-expanded={isProfileMenuOpen}
                  aria-haspopup="menu"
                >
                  <span className="hidden sm:inline">Welcome, {user?.name || user?.email || 'User'}</span>
                  <span className="sm:hidden">Me</span>
                  <span className="text-xs">▾</span>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg z-30 p-2">
                    <button
                      type="button"
                      onClick={logout}
                      className="w-full text-left px-3 py-2 rounded-md text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AppShell;
