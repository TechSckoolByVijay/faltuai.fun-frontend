import React, { useEffect, useMemo, useState } from 'react';

import { authService } from '../../auth/authService.js';
import { API_ENDPOINTS } from '../../config/backend.js';

const AdminAnalyticsPage = () => {
  const user = authService.getUserInfo();

  const [overview, setOverview] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [featureUsers, setFeatureUsers] = useState([]);
  const [featureQuestions, setFeatureQuestions] = useState([]);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingDrilldown, setLoadingDrilldown] = useState(false);
  const [error, setError] = useState('');

  const token = useMemo(() => authService.getToken(), []);

  useEffect(() => {
    const loadOverview = async () => {
      setLoadingOverview(true);
      setError('');

      try {
        const response = await fetch(API_ENDPOINTS.ADMIN.OVERVIEW, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Failed to load analytics overview');
        }

        setOverview(data);

        if (data.features?.length > 0) {
          setSelectedFeature(data.features[0]);
        }
      } catch (requestError) {
        setError(requestError.message || 'Failed to load analytics data');
      } finally {
        setLoadingOverview(false);
      }
    };

    if (user?.is_super_user) {
      loadOverview();
    } else {
      setLoadingOverview(false);
    }
  }, [token, user?.is_super_user]);

  useEffect(() => {
    const loadDrilldown = async () => {
      if (!selectedFeature?.feature_key) {
        return;
      }

      setLoadingDrilldown(true);
      setError('');

      try {
        const [usersResponse, questionsResponse] = await Promise.all([
          fetch(API_ENDPOINTS.ADMIN.FEATURE_USERS(selectedFeature.feature_key), {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(API_ENDPOINTS.ADMIN.FEATURE_QUESTIONS(selectedFeature.feature_key), {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const usersData = await usersResponse.json();
        const questionsData = await questionsResponse.json();

        if (!usersResponse.ok) {
          throw new Error(usersData.detail || 'Failed to load feature users');
        }

        if (!questionsResponse.ok) {
          throw new Error(questionsData.detail || 'Failed to load common questions');
        }

        setFeatureUsers(usersData.users || []);
        setFeatureQuestions(questionsData.common_questions || []);
      } catch (requestError) {
        setError(requestError.message || 'Failed to load feature drilldown');
      } finally {
        setLoadingDrilldown(false);
      }
    };

    loadDrilldown();
  }, [selectedFeature?.feature_key, token]);

  if (!user?.is_super_user) {
    return (
      <div className="p-6 sm:p-8">
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-300">
          Super user access is required for analytics dashboard.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">📊 Super User Analytics</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Track feature popularity, discover power users, and see common prompts to decide what to build next.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {loadingOverview ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 text-center text-gray-500 dark:text-gray-400">
          Loading analytics overview...
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Tracked Events</div>
              <div className="text-3xl font-bold mt-1">{overview?.total_events || 0}</div>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">Features with Usage</div>
              <div className="text-3xl font-bold mt-1">{overview?.features?.filter((item) => item.total_uses > 0).length || 0}</div>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">Generated At (UTC)</div>
              <div className="text-lg font-semibold mt-1 break-all">{overview?.generated_at || 'N/A'}</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
              <h2 className="text-xl font-semibold mb-4">Feature Popularity</h2>
              <div className="space-y-3">
                {(overview?.features || []).map((feature) => (
                  <button
                    key={feature.feature_key}
                    onClick={() => setSelectedFeature(feature)}
                    className={`w-full text-left p-3 rounded-lg border transition ${
                      selectedFeature?.feature_key === feature.feature_key
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-400'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-semibold">{feature.feature_label}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Users: {feature.unique_users}
                        </div>
                      </div>
                      <div className="text-2xl font-bold">{feature.total_uses}</div>
                    </div>
                    {feature.top_user && (
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Top user: {feature.top_user.full_name || feature.top_user.email} ({feature.top_user.usage_count} uses)
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
                <h2 className="text-xl font-semibold mb-4">
                  {selectedFeature?.feature_label || 'Feature'} · Users Drilldown
                </h2>
                {loadingDrilldown ? (
                  <div className="text-gray-500 dark:text-gray-400">Loading users...</div>
                ) : featureUsers.length === 0 ? (
                  <div className="text-gray-500 dark:text-gray-400">No user activity yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-500 dark:text-gray-400">
                          <th className="pb-2">User</th>
                          <th className="pb-2">Email</th>
                          <th className="pb-2 text-right">Uses</th>
                        </tr>
                      </thead>
                      <tbody>
                        {featureUsers.map((item) => (
                          <tr key={item.user_id} className="border-t border-gray-100 dark:border-gray-800">
                            <td className="py-2">{item.full_name || 'N/A'}</td>
                            <td className="py-2">{item.email}</td>
                            <td className="py-2 text-right font-semibold">{item.usage_count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
                <h2 className="text-xl font-semibold mb-4">
                  {selectedFeature?.feature_label || 'Feature'} · Common Questions
                </h2>
                {loadingDrilldown ? (
                  <div className="text-gray-500 dark:text-gray-400">Loading questions...</div>
                ) : featureQuestions.length === 0 ? (
                  <div className="text-gray-500 dark:text-gray-400">No common questions captured yet.</div>
                ) : (
                  <div className="space-y-2">
                    {featureQuestions.map((question, index) => (
                      <div key={`${question.question}-${index}`} className="p-3 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <div className="text-sm">{question.question}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Frequency: {question.frequency}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAnalyticsPage;
