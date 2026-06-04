import React, { useMemo, useState } from 'react';

import { API_ENDPOINTS } from '../config/backend.js';

const CATEGORY_OPTIONS = [
  'Faltu Growth',
  'Faltu Content',
  'Faltu Lifestyle',
  'Faltu Utilities',
];

const USAGE_FREQUENCY_OPTIONS = ['Daily', 'Weekly', 'Monthly', 'Occasionally'];

const initialForm = {
  ideaTitle: '',
  ideaDescription: '',
  targetUsers: '',
  featureCategories: [],
  usageFrequency: '',
  exampleReferences: '',
  contactEmail: '',
  isContactAllowed: false,
};

const ProductIdeaForm = ({ source = 'landing_page', variant = 'default', className = '' }) => {
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isOptionalOpen, setIsOptionalOpen] = useState(false);

  const wrapperClass = useMemo(() => {
    if (variant === 'hero') {
      return 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 sm:p-8';
    }

    if (variant === 'compact') {
      return 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-5';
    }

    return 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6';
  }, [variant]);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleCategory = (category) => {
    setFormData((prev) => {
      const exists = prev.featureCategories.includes(category);
      return {
        ...prev,
        featureCategories: exists
          ? prev.featureCategories.filter((item) => item !== category)
          : [...prev.featureCategories, category],
      };
    });
  };

  const resetForm = () => {
    setFormData(initialForm);
    setIsOptionalOpen(false);
  };

  const handleOptionalToggle = () => {
    setIsOptionalOpen((prev) => !prev);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.ideaTitle.trim().length < 3) {
      setIsSuccess(false);
      setMessage('Idea title should be at least 3 characters.');
      return;
    }

    if (formData.ideaDescription.trim().length < 10) {
      setIsSuccess(false);
      setMessage('Idea description should be at least 10 characters.');
      return;
    }

    if (!formData.contactEmail.trim()) {
      setIsSuccess(false);
      setMessage('Contact email is required.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch(API_ENDPOINTS.PRODUCT_IDEAS.SUBMIT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea_title: formData.ideaTitle.trim(),
          idea_description: formData.ideaDescription.trim(),
          target_users: formData.targetUsers.trim() || null,
          feature_categories: formData.featureCategories,
          usage_frequency: formData.usageFrequency || null,
          example_references: formData.exampleReferences.trim() || null,
          contact_email: formData.contactEmail.trim(),
          source,
          is_contact_allowed: formData.isContactAllowed,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const detail = data?.detail || data?.message || 'Failed to submit idea.';
        throw new Error(detail);
      }

      setIsSuccess(true);
      setMessage(data.message || 'Thanks! Your idea has been submitted.');
      resetForm();
    } catch (error) {
      setIsSuccess(false);
      setMessage(error.message || 'Failed to submit idea. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${wrapperClass} ${className}`}>
      <div className="mb-5">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">🚀 Product Ideas</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          Suggest a new tool or feature for FaltuAI.fun.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Idea Title *</label>
          <input
            type="text"
            value={formData.ideaTitle}
            onChange={(event) => updateField('ideaTitle', event.target.value)}
            placeholder="Example: AI project cost estimator"
            required
            maxLength={220}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Idea Description *</label>
          <textarea
            value={formData.ideaDescription}
            onChange={(event) => updateField('ideaDescription', event.target.value)}
            placeholder="What should this tool do and why would it help?"
            required
            maxLength={5000}
            rows={4}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Contact Email *</label>
          <input
            type="email"
            value={formData.contactEmail}
            onChange={(event) => updateField('contactEmail', event.target.value)}
            placeholder="your@email.com"
            required
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <span className="text-xs text-gray-600 dark:text-gray-300">Optional details</span>
          <button
            type="button"
            onClick={handleOptionalToggle}
            className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 text-lg leading-none"
            aria-label={isOptionalOpen ? 'Hide optional details' : 'Show optional details'}
            title={isOptionalOpen ? 'Hide optional details' : 'Show optional details'}
          >
            {isOptionalOpen ? '−' : '+'}
          </button>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOptionalOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
          aria-hidden={!isOptionalOpen}
        >
          <div className="space-y-4 pt-1">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Target Users</label>
                <input
                  type="text"
                  value={formData.targetUsers}
                  onChange={(event) => updateField('targetUsers', event.target.value)}
                  placeholder="Students, developers, creators..."
                  maxLength={220}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Usage Frequency</label>
                <div className="grid grid-cols-2 gap-2">
                  {USAGE_FREQUENCY_OPTIONS.map((option) => (
                    <label key={option} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                      <input
                        type="radio"
                        name={`usage-frequency-${source}-${variant}`}
                        checked={formData.usageFrequency === option}
                        onChange={() => updateField('usageFrequency', option)}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Feature Categories</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORY_OPTIONS.map((category) => (
                  <label key={category} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                    <input
                      type="checkbox"
                      checked={formData.featureCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                    />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Examples / References</label>
              <textarea
                value={formData.exampleReferences}
                onChange={(event) => updateField('exampleReferences', event.target.value)}
                placeholder="Any examples, links, or inspiration?"
                rows={3}
                maxLength={2000}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                <input
                  type="checkbox"
                  checked={formData.isContactAllowed}
                  onChange={(event) => updateField('isContactAllowed', event.target.checked)}
                />
                <span>Team can contact me about this idea</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <span className="text-xs text-gray-500 dark:text-gray-400">Fields with * are required.</span>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 rounded-md bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Idea'}
          </button>
        </div>
      </form>

      {message && (
        <div
          className={`mt-4 text-sm rounded-md p-3 border ${
            isSuccess
              ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
              : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default ProductIdeaForm;
