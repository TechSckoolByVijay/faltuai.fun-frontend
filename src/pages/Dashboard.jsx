import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth.js';
import NewsletterSubscription from '../components/NewsletterSubscription.jsx';

/**
 * Dashboard Page - Main user dashboard after login
 */
const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-gray-800 p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Welcome to Your Dashboard! 🎉
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Hello {user?.name || user?.email}, here's your personalized control center.
          </p>
        </div>

        {/* User Info Card */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-gray-800 p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">👤 User Profile</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Email:</span>
                <p className="text-gray-900 dark:text-gray-100">{user?.email || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Name:</span>
                <p className="text-gray-900 dark:text-gray-100">{user?.name || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-gray-800 p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">📊 Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Features Available:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">6</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Last Login:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">Just now</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Status:</span>
                <span className="text-green-600 dark:text-green-400 font-medium">Active</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-gray-800 p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">⚡ Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/skill-assessment"
                className="block w-full bg-primary-600 hover:bg-primary-700 text-white text-center py-2 px-4 rounded-md transition duration-200"
              >
                🎯 Skill Assessment
              </Link>
              <Link
                to="/email-smoothener"
                className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white text-center py-2 px-4 rounded-md transition duration-200"
              >
                📨 Email Smoothener
              </Link>
              <Link
                to="/resume-roast"
                className="block w-full bg-red-600 hover:bg-red-700 text-white text-center py-2 px-4 rounded-md transition duration-200"
              >
                🔥 Resume Roast
              </Link>
              <Link
                to="/cringe-meter"
                className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-2 px-4 rounded-md transition duration-200"
              >
                🤏 LinkedIn Cringe-o-Meter
              </Link>
              <Link
                to="/idea-spark"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-md transition duration-200"
              >
                💡 Idea Spark
              </Link>
              <Link
                to="/name-craft"
                className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center py-2 px-4 rounded-md transition duration-200"
              >
                🧭 NameCraft
              </Link>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-gray-800 p-6 border border-gray-200 dark:border-gray-700">
            <NewsletterSubscription variant="default" />
          </div>
        </div>

        {/* Available Features */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-gray-800 p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">🚀 Available Features</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Skill Assessment Card */}
            <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-6 hover:border-blue-300 dark:hover:border-blue-700 transition duration-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
              <div className="flex items-center mb-4">
                <div className="bg-blue-500 dark:bg-blue-600 p-3 rounded-lg">
                  <span className="text-2xl">🎯</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Skill Assessment</h3>
                  <div className="flex gap-2">
                    <span className="text-sm text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900 px-2 py-1 rounded font-medium">Available</span>
                    <span className="text-sm text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded font-medium">🤖 AI</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-200 mb-4">
                Take a personalized skill evaluation and get a curated learning roadmap tailored to your expertise level and career goals.
              </p>
              <Link
                to="/skill-assessment"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200 font-medium"
              >
                🎯 Start Assessment →
              </Link>
            </div>

            {/* Resume Roast Card */}
            <div className="border border-red-200 dark:border-red-800 rounded-lg p-6 hover:border-red-300 dark:hover:border-red-700 transition duration-200 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg">
                  <span className="text-2xl">🔥</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Resume Roaster</h3>
                  <div className="flex gap-2">
                    <span className="text-sm text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900 px-2 py-1 rounded">Available</span>
                    <span className="text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">💎 Premium</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Get your resume roasted by AI! Upload your resume and get brutally honest feedback with actionable improvement tips.
              </p>
              <Link
                to="/resume-roast"
                className="inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-200"
              >
                🔥 Roast Now →
              </Link>
            </div>

            {/* Email Smoothener Card */}
            <div className="border border-emerald-200 dark:border-emerald-800 rounded-lg p-6 hover:border-emerald-300 dark:hover:border-emerald-700 transition duration-200 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
              <div className="flex items-center mb-4">
                <div className="bg-emerald-500 dark:bg-emerald-600 p-3 rounded-lg">
                  <span className="text-2xl">📨</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Email Smoothener</h3>
                  <div className="flex gap-2">
                    <span className="text-sm text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900 px-2 py-1 rounded font-medium">Available</span>
                    <span className="text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900 px-2 py-1 rounded font-medium">✉️ Utility</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-200 mb-4">
                Check if your draft sounds polite, clear, and formal enough. Get three sendable rewrites with practical tone guidance.
              </p>
              <Link
                to="/email-smoothener"
                className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition duration-200 font-medium"
              >
                📨 Smoothen Email →
              </Link>
            </div>

            {/* LinkedIn Cringe-o-Meter Card */}
            <div className="border border-purple-200 dark:border-purple-800 rounded-lg p-6 hover:border-purple-300 dark:hover:border-purple-700 transition duration-200 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
                  <span className="text-2xl">🤏</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">LinkedIn Cringe-o-Meter</h3>
                  <div className="flex gap-2">
                    <span className="text-sm text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900 px-2 py-1 rounded font-medium">Available</span>
                    <span className="text-sm text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded font-medium">🔥 Fun</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-200 mb-4">
                Analyze performative LinkedIn posts for cringe score, detect buzzwords, and get a more human rewrite.
              </p>
              <Link
                to="/cringe-meter"
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition duration-200 font-medium"
              >
                🤏 Analyze Post →
              </Link>
            </div>

            {/* Idea Spark Card */}
            <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-6 hover:border-blue-300 dark:hover:border-blue-700 transition duration-200 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                  <span className="text-2xl">💡</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Idea Spark</h3>
                  <div className="flex gap-2">
                    <span className="text-sm text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900 px-2 py-1 rounded font-medium">Available</span>
                    <span className="text-sm text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded font-medium">🧠 Creative</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-200 mb-4">
                Give one phrase and get 10 actionable micro-ideas for content, products, or experiments.
              </p>
              <Link
                to="/idea-spark"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200 font-medium"
              >
                💡 Spark Ideas →
              </Link>
            </div>

            {/* NameCraft Card */}
            <div className="border border-indigo-200 dark:border-indigo-800 rounded-lg p-6 hover:border-indigo-300 dark:hover:border-indigo-700 transition duration-200 bg-gradient-to-br from-indigo-50 to-sky-50 dark:from-indigo-950 dark:to-sky-950">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-lg">
                  <span className="text-2xl">🧭</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">NameCraft</h3>
                  <span className="text-sm text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900 px-2 py-1 rounded font-medium">Available</span>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-200 mb-4">
                Generate sensible, consistent names for repository, services, environments, CI/CD, and cloud resources.
              </p>
              <Link
                to="/name-craft"
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition duration-200 font-medium"
              >
                🧭 Craft Names →
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-gray-800 p-6 mt-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">📈 Recent Activity</h2>
          <div className="text-gray-500 dark:text-gray-400 text-center py-8">
            <p>No recent activity yet. Start by exploring Feature 1!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;