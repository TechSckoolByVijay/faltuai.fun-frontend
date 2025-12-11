import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth.js';

/**
 * Landing Page - Main entry point of the application
 */
const LandingPage = () => {
  const { isAuthenticated, login, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          {/* Main headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">
              FaltuAI Fun
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your playground for AI-powered fun and creativity. 
            Explore amazing features and build something extraordinary together.
          </p>

          {/* CTA Section */}
          <div className="space-y-6">
            {!isAuthenticated ? (
              <div>
                <button
                  onClick={login}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition duration-300 transform hover:scale-105 shadow-lg"
                >
                  🚀 Login with Google
                </button>
                <p className="text-gray-500 mt-4">
                  Sign in to access all features and personalized content
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Welcome back, {user?.name || user?.email}! 👋
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/dashboard"
                    className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                  >
                    Go to Dashboard
                  </Link>
                  <Link
                    to="/feature1"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                  >
                    Try Feature 1
                  </Link>
                  <Link
                    to="/resume-roast"
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                  >
                    🔥 Roast Resume
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What's Coming Next
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
              <div className="text-4xl mb-4">🤖</div>
              <h4 className="text-xl font-semibold mb-3">AI Assistant</h4>
              <p className="text-gray-600">
                Interact with powerful AI models to generate content, solve problems, and get creative assistance.
              </p>
            </div>

            {/* Feature Card 2 - Resume Roast */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-l-4 border-red-500">
              <div className="text-4xl mb-4">🔥</div>
              <h4 className="text-xl font-semibold mb-3">Resume Roaster <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full ml-2">💎 Premium</span></h4>
              <p className="text-gray-600">
                Get brutally honest AI feedback on your resume. Upload your CV and receive detailed roasting with actionable improvement tips.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
              <div className="text-4xl mb-4">🔧</div>
              <h4 className="text-xl font-semibold mb-3">Smart Utilities</h4>
              <p className="text-gray-600">
                Access productivity tools, data analyzers, and smart workflows to supercharge your tasks.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 FaltuAI Fun. Built with React, FastAPI, and lots of ❤️</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;