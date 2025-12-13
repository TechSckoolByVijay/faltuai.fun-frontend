import React, { useState } from 'react';
import { CONFIG } from '../config/backend.js';

const NewsletterSubscription = ({ variant = 'default', className = '' }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${CONFIG.BACKEND_URL}/api/v1/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          source: 'website'
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubscribed(true);
        setMessage(data.message);
        setEmail('');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again later.');
      console.error('Newsletter subscription error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className={`newsletter-success bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-6 ${className}`}>
        <div className="text-center">
          <div className="text-4xl mb-3">🎉</div>
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-100 mb-2">
            Welcome to the FaltooAI Community!
          </h3>
          <p className="text-green-700 dark:text-green-200 text-sm">
            {message}
          </p>
        </div>
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div className={`newsletter-hero bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-950 dark:to-accent-950 border border-primary-200 dark:border-primary-800 rounded-xl p-8 ${className}`}>
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Stay Ahead in the AI Race
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
            Get our <strong>monthly newsletter</strong> with curated AI insights, trends, and updates. 
            <br />
            <span className="text-primary-600 dark:text-primary-400 font-medium">
              No spam, just a 2-minute read to keep you ahead of the curve.
            </span>
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200"
              disabled={isLoading}
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white font-medium rounded-lg transition duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed min-w-[120px]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </div>
              ) : (
                'Join Now'
              )}
            </button>
          </div>
        </form>
        
        {message && (
          <div className={`mt-4 text-center text-sm ${message.includes('error') || message.includes('failed') ? 'text-red-600 dark:text-red-400' : 'text-primary-600 dark:text-primary-400'}`}>
            {message}
          </div>
        )}
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
            <span>🔒</span>
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`newsletter-compact bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">💡</span>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
              Stay Updated
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-xs">
              Monthly AI insights, no spam
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-transparent transition duration-200"
            disabled={isLoading}
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-3 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white text-sm font-medium rounded-md transition duration-200 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
        
        {message && (
          <div className={`mt-2 text-xs text-center ${message.includes('error') || message.includes('failed') ? 'text-red-600 dark:text-red-400' : 'text-primary-600 dark:text-primary-400'}`}>
            {message}
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`newsletter-default bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 ${className}`}>
      <div className="text-center mb-4">
        <div className="text-3xl mb-2">📬</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Join Our AI Newsletter
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Monthly curated insights to keep you ahead in the AI world
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200"
          disabled={isLoading}
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white font-medium rounded-md transition duration-200 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Subscribing...
            </span>
          ) : (
            'Subscribe Now'
          )}
        </button>
      </form>
      
      {message && (
        <div className={`mt-3 text-sm text-center ${message.includes('error') || message.includes('failed') ? 'text-red-600 dark:text-red-400' : 'text-primary-600 dark:text-primary-400'}`}>
          {message}
        </div>
      )}
      
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
        No spam, just valuable insights. Unsubscribe anytime.
      </p>
    </div>
  );
};

export default NewsletterSubscription;