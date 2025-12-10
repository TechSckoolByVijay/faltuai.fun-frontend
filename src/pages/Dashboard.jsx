import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth.js';

/**
 * Dashboard Page - Main user dashboard after login
 */
const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Your Dashboard! 🎉
          </h1>
          <p className="text-gray-600">
            Hello {user?.name || user?.email}, here's your personalized control center.
          </p>
        </div>

        {/* User Info Card */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">👤 User Profile</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-500">Email:</span>
                <p className="text-gray-900">{user?.email || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Name:</span>
                <p className="text-gray-900">{user?.name || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Features Available:</span>
                <span className="font-medium">2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last Login:</span>
                <span className="font-medium">Just now</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="text-green-600 font-medium">Active</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/feature1"
                className="block w-full bg-primary-600 hover:bg-primary-700 text-white text-center py-2 px-4 rounded-md transition duration-200"
              >
                Try Feature 1
              </Link>
              <Link
                to="/resume-roast"
                className="block w-full bg-red-600 hover:bg-red-700 text-white text-center py-2 px-4 rounded-md transition duration-200"
              >
                🔥 Resume Roast
              </Link>
              <button
                disabled
                className="block w-full bg-gray-300 text-gray-500 text-center py-2 px-4 rounded-md cursor-not-allowed"
              >
                Feature 3 (Coming Soon)
              </button>
              <button
                disabled
                className="block w-full bg-gray-300 text-gray-500 text-center py-2 px-4 rounded-md cursor-not-allowed"
              >
                Feature 3 (Coming Soon)
              </button>
            </div>
          </div>
        </div>

        {/* Available Features */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🚀 Available Features</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 Card */}
            <div className="border border-gray-200 rounded-lg p-6 hover:border-primary-300 transition duration-200">
              <div className="flex items-center mb-4">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <span className="text-2xl">🎯</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Feature 1</h3>
                  <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">Available</span>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Our first demonstration feature. Test the API integration and authentication flow.
              </p>
              <Link
                to="/feature1"
                className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition duration-200"
              >
                Try Now →
              </Link>
            </div>

            {/* Resume Roast Card */}
            <div className="border border-red-200 rounded-lg p-6 hover:border-red-300 transition duration-200 bg-gradient-to-br from-red-50 to-orange-50">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <span className="text-2xl">🔥</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Resume Roaster</h3>
                  <div className="flex gap-2">
                    <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">Available</span>
                    <span className="text-sm text-yellow-600 bg-yellow-100 px-2 py-1 rounded">💎 Premium</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Get your resume roasted by AI! Upload your resume and get brutally honest feedback with actionable improvement tips.
              </p>
              <Link
                to="/resume-roast"
                className="inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-200"
              >
                🔥 Roast Now →
              </Link>
            </div>

            {/* Placeholder Feature 2 */}
            <div className="border border-gray-200 rounded-lg p-6 opacity-50">
              <div className="flex items-center mb-4">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <span className="text-2xl">🔮</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-600">Feature 2</h3>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">Coming Soon</span>
                </div>
              </div>
              <p className="text-gray-500 mb-4">
                Next exciting feature in development. Stay tuned for updates!
              </p>
              <button
                disabled
                className="inline-block bg-gray-300 text-gray-500 px-4 py-2 rounded-md cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>

            {/* Placeholder Feature 3 */}
            <div className="border border-gray-200 rounded-lg p-6 opacity-50">
              <div className="flex items-center mb-4">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <span className="text-2xl">⭐</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-600">Feature 3</h3>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">Planned</span>
                </div>
              </div>
              <p className="text-gray-500 mb-4">
                Another amazing feature planned for future releases.
              </p>
              <button
                disabled
                className="inline-block bg-gray-300 text-gray-500 px-4 py-2 rounded-md cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📈 Recent Activity</h2>
          <div className="text-gray-500 text-center py-8">
            <p>No recent activity yet. Start by exploring Feature 1!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;