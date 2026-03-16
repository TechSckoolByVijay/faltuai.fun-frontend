import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth.js';
import { CONFIG } from '../config/backend.js';
import { SIDEBAR_NAV_SECTIONS } from '../config/features.js';
import NewsletterSubscription from '../components/NewsletterSubscription.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';

const TOOL_ACCENTS = {
  'skill-assessment': {
    iconBg: 'from-blue-500 to-indigo-500',
    button: 'bg-blue-600 hover:bg-blue-700',
    cta: 'Start Assessment',
  },
  'email-smoothener': {
    iconBg: 'from-emerald-500 to-teal-500',
    button: 'bg-emerald-600 hover:bg-emerald-700',
    cta: 'Smoothen Email',
  },
  'resume-roast': {
    iconBg: 'from-red-500 to-orange-500',
    button: 'bg-red-500 hover:bg-red-600',
    cta: 'Roast Resume',
  },
  'cringe-meter': {
    iconBg: 'from-purple-500 to-pink-500',
    button: 'bg-purple-600 hover:bg-purple-700',
    cta: 'Analyze Post',
  },
  'idea-spark': {
    iconBg: 'from-amber-400 to-yellow-500',
    button: 'bg-blue-600 hover:bg-blue-700',
    cta: 'Spark Ideas',
  },
  'name-craft': {
    iconBg: 'from-indigo-500 to-sky-500',
    button: 'bg-primary-500 hover:bg-primary-600',
    cta: 'Craft Names',
  },
};

const LANDING_TOOL_KEYS = new Set([
  'skill-assessment',
  'email-smoothener',
  'resume-roast',
  'cringe-meter',
  'idea-spark',
  'name-craft',
]);

/**
 * Landing Page - FaltooAI Brand Experience
 */
const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login, user } = useAuth();
  const tools = SIDEBAR_NAV_SECTIONS
    .flatMap((section) => section.items)
    .filter((item) => item.path && LANDING_TOOL_KEYS.has(item.key))
    .map((item) => ({
      ...item,
      ...(TOOL_ACCENTS[item.key] || {}),
    }));

  const handleToolAccess = (path) => {
    if (isAuthenticated) {
      navigate(path);
      return;
    }

    login(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-950 dark:to-gray-900">
      <div className="fixed top-4 right-4 z-30">
        <ThemeToggle className="shadow-md border border-gray-200 dark:border-gray-700" />
      </div>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">
              Small Extras.
            </span>
            <br />
            <span className="text-gray-900 dark:text-gray-100">Big Productivity.</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto font-medium">
            Because a Little Extra Creates Big Value.
          </p>

          {/* Short blurb */}
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-4xl mx-auto">
            FaltooAI finds value in the extra — tiny automations, playful tools, and clever micro-features that save time and spark creativity.
          </p>

          {/* Primary CTAs */}
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center mb-16">
            <a 
              href="#tools" 
              className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition duration-300 transform hover:scale-105 shadow-lg"
              aria-label="Browse Productivity Tools"
            >
              Browse Productivity Tools →
            </a>
            <a 
              href="#about" 
              className="inline-block bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-primary-600 dark:text-primary-400 border-2 border-primary-500 font-bold py-4 px-8 rounded-lg text-lg transition duration-300"
              aria-label="Read About Our Approach"
            >
              Read About Our Approach →
            </a>
          </div>

          {/* Auth Section */}
          {!isAuthenticated ? (
            <div className="mb-16">
              <button
                onClick={() => login()}
                className="bg-gradient-to-r from-accent-500 to-primary-500 hover:from-accent-400 hover:to-primary-400 text-white font-bold py-3 px-8 rounded-xl text-base transition duration-300 shadow-xl ring-4 ring-accent-300/40 dark:ring-accent-800/40 hover:scale-105 animate-pulse"
              >
                🚀 Login with Google
              </button>
              <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm">
                Sign in to access personalized tools and save your work
              </p>
            </div>
          ) : (
            <div className="mb-16">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Welcome back, {user?.name || user?.email}! 👋
              </h2>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/dashboard"
                  className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                >
                  Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Newsletter Subscription Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <NewsletterSubscription variant="hero" />
      </section>

      {/* Product Ideas Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6 sm:p-8 text-center">
          <div className="text-4xl mb-3">🚀</div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Got a Product Idea?</h3>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-5">
            Help shape FaltuAI.fun by suggesting the next tool or feature you'd love to use.
          </p>
          <Link
            to="/product-ideas"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-3 rounded-lg transition duration-200"
          >
            Submit Product Idea →
          </Link>
        </div>
      </section>

      {/* What FaltooAI Stands For Section */}
      <section id="about" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            What FaltooAI Stands For
          </h2>
          <div className="prose prose-lg dark:prose-invert mx-auto text-left max-w-4xl">
            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              FaltooAI celebrates the idea that what seems small, insignificant, or "faltoo" often carries unexpected value.
              Our mission is to discover that "extra bit" — a quirky idea, a tiny automation, a playful tool — and turn it into meaningful productivity for everyday creators, developers, students, and entrepreneurs.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              We build simple, fun, and surprisingly useful AI-driven experiences that save time, spark creativity, and turn ordinary moments into opportunities for skill, learning, and growth.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-0 leading-relaxed font-medium">
              At FaltooAI, nothing is truly faltoo.<br />
              If it adds value, solves a problem, entertains, or improves your day even a little — it matters.
            </p>
          </div>
        </div>
      </section>

      {/* Productivity Tools Section */}
      <section id="tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Productivity Tools
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore every live tool available right now. Sign in first if needed, then jump straight into the feature.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <div key={tool.key} className="faltoo-card p-6 hover:shadow-lg transition-all duration-200 group">
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.iconBg} text-2xl mb-4 shadow-md`}>
                {tool.icon}
              </div>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{tool.label}</h3>
                <span className="text-xs bg-accent-100 dark:bg-accent-900 text-accent-800 dark:text-accent-200 px-2 py-1 rounded-full font-medium">
                  Live
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed min-h-[72px]">
                {tool.description}
              </p>
              <button
                type="button"
                onClick={() => handleToolAccess(tool.path)}
                className={`inline-block ${tool.button} text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 group-hover:shadow-md`}
              >
                {tool.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Footer Newsletter */}
            <div className="order-2 md:order-1">
              <NewsletterSubscription variant="compact" />
            </div>
            
            {/* Footer Info */}
            <div className="text-center md:text-right order-1 md:order-2">
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
                Powered by curiosity. Driven by that little extra.
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-end items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-500 dark:text-gray-400">
                <p>&copy; 2025 {CONFIG.APP_NAME}. Built with React, FastAPI, and lots of ❤️</p>
                <div className="flex space-x-4">
                  <a href="#" className="hover:text-primary-500 transition duration-200">Privacy</a>
                  <a href="#" className="hover:text-primary-500 transition duration-200">Terms</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;