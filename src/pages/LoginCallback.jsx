import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth/useAuth.js';

/**
 * LoginCallback Page - Handles OAuth callback and token processing
 */
const LoginCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleTokenReceived } = useAuth();

  useEffect(() => {
    // Extract token from URL query parameters
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      console.error('Authentication error:', error);
      alert('Authentication failed. Please try again.');
      navigate('/');
      return;
    }

    if (token) {
      try {
        // Store token and update auth state
        handleTokenReceived(token);
        
        // Show success message
        console.log('Authentication successful');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } catch (error) {
        console.error('Error processing token:', error);
        alert('Error processing authentication. Please try again.');
        navigate('/');
      }
    } else {
      // No token found in URL
      console.warn('No token found in callback URL');
      alert('No authentication token received. Please try logging in again.');
      navigate('/');
    }
  }, [searchParams, handleTokenReceived, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        {/* Loading Spinner */}
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-6"></div>
        
        {/* Status Message */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Processing Login...
        </h2>
        
        <p className="text-gray-600 mb-6">
          Please wait while we complete your authentication.
        </p>
        
        {/* Progress Indicator */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div className="bg-primary-600 h-2 rounded-full animate-pulse" style={{width: '75%'}}></div>
        </div>
        
        <p className="text-sm text-gray-500">
          You'll be redirected to your dashboard shortly.
        </p>
        
        {/* Fallback Link */}
        <div className="mt-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-primary-600 hover:text-primary-700 text-sm underline"
          >
            Go to Dashboard manually
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginCallback;