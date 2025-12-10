import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { authService } from '../../auth/authService.js';
import { API_ENDPOINTS } from '../../config/backend.js';

/**
 * Feature1Page - Demonstration feature page
 */
const Feature1Page = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Test the backend API connection
  const testFeature1API = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Get JWT token for authorization
      const token = authService.getToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Make authenticated request to Feature1 API
      const response = await axios.get(API_ENDPOINTS.FEATURE1.HELLO, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setMessage(response.data.message || 'Success!');
    } catch (err) {
      console.error('Feature1 API Error:', err);
      
      if (err.response?.status === 401) {
        setError('Authentication expired. Please log in again.');
        // Could trigger logout here: authService.logout();
      } else if (err.response?.status === 404) {
        setError('Feature1 API endpoint not found. Backend may not be running.');
      } else {
        setError(err.message || 'Failed to connect to Feature1 API');
      }
    } finally {
      setLoading(false);
    }
  };

  // Auto-test API on component mount
  useEffect(() => {
    testFeature1API();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎯 Feature 1 Demo
          </h1>
          <p className="text-gray-600">
            This is our first demonstration feature. It showcases API integration and JWT authentication.
          </p>
        </div>

        {/* API Test Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            API Connection Test
          </h2>
          
          <div className="mb-4">
            <button
              onClick={testFeature1API}
              disabled={loading}
              className={`px-6 py-3 rounded-lg font-medium transition duration-200 ${
                loading 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-primary-600 hover:bg-primary-700 text-white'
              }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Testing...
                </span>
              ) : (
                'Test Feature1 API'
              )}
            </button>
          </div>

          {/* Results Display */}
          {message && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex">
                <div className="text-green-400 mr-3">✅</div>
                <div>
                  <h3 className="text-sm font-medium text-green-800">Success!</h3>
                  <p className="text-sm text-green-700 mt-1">{message}</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex">
                <div className="text-red-400 mr-3">❌</div>
                <div>
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Feature Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            About This Feature
          </h2>
          
          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">
              Feature 1 is a demonstration of the full authentication and API integration flow. 
              Here's what it demonstrates:
            </p>
            
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>JWT token validation before API calls</li>
              <li>Authenticated requests to the backend</li>
              <li>Error handling for various scenarios</li>
              <li>Loading states and user feedback</li>
              <li>Modular component structure for easy expansion</li>
            </ul>
            
            <p>
              This serves as a template for building additional features. Each new feature 
              can follow the same pattern for consistent user experience and code organization.
            </p>
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            🔧 Technical Details
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Frontend Tech</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• React 18 with Hooks</li>
                <li>• Axios for HTTP requests</li>
                <li>• JWT token management</li>
                <li>• Tailwind CSS styling</li>
                <li>• React Router for navigation</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Backend Integration</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• FastAPI backend</li>
                <li>• JWT authentication</li>
                <li>• Protected API endpoints</li>
                <li>• CORS configuration</li>
                <li>• Error handling & status codes</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <Link
            to="/dashboard"
            className="inline-block bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Feature1Page;