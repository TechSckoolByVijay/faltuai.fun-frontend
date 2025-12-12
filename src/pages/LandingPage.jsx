import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth.js';
import { CONFIG } from '../config/backend.js';

/**
 * Landing Page - FaltooAI Brand Experience
 */
const LandingPage = () => {
  const { isAuthenticated, login, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light to-blue-50 dark:from-neutral-dark dark:to-gray-800">
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
              aria-label="Try a Micro Tool"
            >
              Try a Micro Tool →
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
                onClick={login}
                className="bg-accent-500 hover:bg-accent-600 text-white font-bold py-3 px-6 rounded-lg text-base transition duration-300 shadow-md"
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
                <Link
                  to="/resume-roast"
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                >
                  🔥 Resume Roast
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

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

      {/* Micro Tools Section */}
      <section id="tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Micro Tools
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Small tools that make a big difference. Try these AI-powered micro-utilities designed to save time and spark creativity.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Snippet Wizard */}
          <div className="faltoo-card p-6 hover:shadow-lg transition-all duration-200 group">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Snippet Wizard</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Turn a messy idea into a ready-to-use code or text snippet. Perfect for developers and writers who need quick, clean formatting.
            </p>
            <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 group-hover:shadow-md">
              Try Snippet Wizard
            </button>
          </div>

          {/* Auto Caption */}
          <div className="faltoo-card p-6 hover:shadow-lg transition-all duration-200 group">
            <div className="text-4xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Auto Caption</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Upload a short clip and get smart scene captions with action timestamps. Great for content creators and social media managers.
            </p>
            <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 group-hover:shadow-md">
              Upload Clip
            </button>
          </div>

          {/* Idea Spark */}
          <div className="faltoo-card p-6 hover:shadow-lg transition-all duration-200 group">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Idea Spark</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Enter a single phrase and get 10 micro-ideas to use or build. Perfect for brainstorming sessions and creative blocks.
            </p>
            <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 group-hover:shadow-md">
              Spark Ideas
            </button>
          </div>

          {/* Existing Resume Roast Tool */}
          <div className="faltoo-card p-6 hover:shadow-lg transition-all duration-200 group border-l-4 border-red-500">
            <div className="text-4xl mb-4">🔥</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
              Resume Roaster 
              <span className="text-sm bg-accent-100 dark:bg-accent-900 text-accent-800 dark:text-accent-200 px-2 py-1 rounded-full ml-2">Live</span>
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Get brutally honest AI feedback on your resume. Upload your CV and receive detailed roasting with actionable improvement tips.
            </p>
            <Link
              to="/resume-roast"
              className="inline-block bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 group-hover:shadow-md"
            >
              🔥 Roast My Resume
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
              Powered by curiosity. Driven by that little extra.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <p>&copy; 2024 {CONFIG.APP_NAME}. Built with React, FastAPI, and lots of ❤️</p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-primary-500 transition duration-200">Privacy</a>
                <a href="#" className="hover:text-primary-500 transition duration-200">Terms</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;