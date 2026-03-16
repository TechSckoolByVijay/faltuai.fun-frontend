import React from 'react';
import { Link } from 'react-router-dom';

import ProductIdeaForm from '../components/ProductIdeaForm.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';

const ProductIdeasPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-950 dark:to-gray-900">
      <div className="fixed top-4 right-4 z-30">
        <ThemeToggle className="shadow-md border border-gray-200 dark:border-gray-700" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 sm:p-8 shadow-sm mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">🚀 Submit a Product Idea</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
            Suggest what we should build next on FaltuAI.fun.
          </p>
        </div>

        <ProductIdeaForm source="dedicated_page" variant="hero" />
      </div>
    </div>
  );
};

export default ProductIdeasPage;
