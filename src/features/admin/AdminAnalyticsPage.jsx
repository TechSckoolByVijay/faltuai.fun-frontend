import React, { useEffect, useMemo, useState } from 'react';

import { authService } from '../../auth/authService.js';
import { API_ENDPOINTS } from '../../config/backend.js';

const AdminAnalyticsPage = () => {
  const user = authService.getUserInfo();

  const [overview, setOverview] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [featureUsers, setFeatureUsers] = useState([]);
  const [featureQuestions, setFeatureQuestions] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [ideaDrafts, setIdeaDrafts] = useState({});
  const [ideaFilters, setIdeaFilters] = useState({ status: 'all', search: '' });
  const [ideasTotal, setIdeasTotal] = useState(0);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingDrilldown, setLoadingDrilldown] = useState(false);
  const [loadingIdeas, setLoadingIdeas] = useState(false);
  const [savingIdeaId, setSavingIdeaId] = useState(null);
  const [deletingIdeaId, setDeletingIdeaId] = useState(null);
  const [error, setError] = useState('');
  const [ideaError, setIdeaError] = useState('');

  const token = useMemo(() => authService.getToken(), []);

  const applyIdeaDrafts = (items) => {
    const nextDrafts = {};
    items.forEach((item) => {
      nextDrafts[item.id] = {
        status: item.status || 'new',
        admin_notes: item.admin_notes || '',
      };
    });
    setIdeaDrafts(nextDrafts);
  };

  const loadIdeas = async (filters = ideaFilters) => {
    setLoadingIdeas(true);
    setIdeaError('');

    try {
      const query = new URLSearchParams({
        status: filters.status || 'all',
        limit: '50',
      });

      if (filters.search?.trim()) {
        query.set('search', filters.search.trim());
      }

      const response = await fetch(`${API_ENDPOINTS.PRODUCT_IDEAS.ADMIN_LIST}?${query.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to load product ideas');
      }

      setIdeas(data.items || []);
      setIdeasTotal(data.total || 0);
      applyIdeaDrafts(data.items || []);
    } catch (requestError) {
      setIdeaError(requestError.message || 'Failed to load product ideas');
    } finally {
      setLoadingIdeas(false);
    }
  };

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
      loadIdeas();
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

  const updateIdeaDraft = (ideaId, key, value) => {
    setIdeaDrafts((prev) => ({
      ...prev,
      [ideaId]: {
        ...(prev[ideaId] || {}),
        [key]: value,
      },
    }));
  };

  const saveIdea = async (ideaId) => {
    const draft = ideaDrafts[ideaId];
    if (!draft) {
      return;
    }

    setSavingIdeaId(ideaId);
    setIdeaError('');

    try {
      const response = await fetch(API_ENDPOINTS.PRODUCT_IDEAS.ADMIN_UPDATE(ideaId), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(draft),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to save idea update');
      }

      setIdeas((prev) => prev.map((item) => (item.id === ideaId ? data : item)));
      updateIdeaDraft(ideaId, 'status', data.status);
      updateIdeaDraft(ideaId, 'admin_notes', data.admin_notes || '');
    } catch (requestError) {
      setIdeaError(requestError.message || 'Failed to update idea');
    } finally {
      setSavingIdeaId(null);
    }
  };

  const deleteIdea = async (ideaId) => {
    const confirmed = window.confirm('Delete this product idea? This action cannot be undone.');
    if (!confirmed) {
      return;
    }

    setDeletingIdeaId(ideaId);
    setIdeaError('');

    try {
      const response = await fetch(API_ENDPOINTS.PRODUCT_IDEAS.ADMIN_DELETE(ideaId), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to delete idea');
      }

      setIdeas((prev) => prev.filter((item) => item.id !== ideaId));
      setIdeaDrafts((prev) => {
        const next = { ...prev };
        delete next[ideaId];
        return next;
      });
      setIdeasTotal((prev) => Math.max(0, prev - 1));
    } catch (requestError) {
      setIdeaError(requestError.message || 'Failed to delete idea');
    } finally {
      setDeletingIdeaId(null);
    }
  };

  const exportIdeasCsv = async () => {
    setIdeaError('');

    try {
      const query = new URLSearchParams({ status: ideaFilters.status || 'all' });
      if (ideaFilters.search?.trim()) {
        query.set('search', ideaFilters.search.trim());
      }

      const response = await fetch(`${API_ENDPOINTS.PRODUCT_IDEAS.ADMIN_EXPORT_CSV}?${query.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to export CSV');
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'product_ideas.csv';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (requestError) {
      setIdeaError(requestError.message || 'Failed to export CSV');
    }
  };

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

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-xl font-semibold">🚀 Product Ideas Inbox</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">View, manage, and export community feature suggestions.</p>
              </div>

              <button
                onClick={exportIdeasCsv}
                className="px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium"
              >
                Export CSV
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-3 mb-4">
              <label className="text-sm">
                <span className="block text-gray-600 dark:text-gray-300 mb-1">Status</span>
                <select
                  value={ideaFilters.status}
                  onChange={(event) => setIdeaFilters((prev) => ({ ...prev, status: event.target.value }))}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-2"
                >
                  <option value="all">All</option>
                  <option value="new">New</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="planned">Planned</option>
                  <option value="shipped">Shipped</option>
                  <option value="rejected">Rejected</option>
                </select>
              </label>

              <label className="text-sm md:col-span-2">
                <span className="block text-gray-600 dark:text-gray-300 mb-1">Search</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={ideaFilters.search}
                    onChange={(event) => setIdeaFilters((prev) => ({ ...prev, search: event.target.value }))}
                    placeholder="Title, description, target users, email"
                    className="flex-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-2"
                  />
                  <button
                    onClick={() => loadIdeas()}
                    className="px-3 py-2 rounded-md bg-primary-600 hover:bg-primary-700 text-white text-sm"
                  >
                    Apply
                  </button>
                </div>
              </label>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">Total ideas: {ideasTotal}</div>

            {ideaError && (
              <div className="mb-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-2 text-red-700 dark:text-red-300 text-sm">
                {ideaError}
              </div>
            )}

            {loadingIdeas ? (
              <div className="text-gray-500 dark:text-gray-400">Loading product ideas...</div>
            ) : ideas.length === 0 ? (
              <div className="text-gray-500 dark:text-gray-400">No product ideas found for current filters.</div>
            ) : (
              <div className="space-y-4">
                {ideas.map((idea) => {
                  const draft = ideaDrafts[idea.id] || { status: idea.status, admin_notes: idea.admin_notes || '' };

                  return (
                    <div key={idea.id} className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/40">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-gray-100">{idea.idea_title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            #{idea.id} · {idea.source} · {new Date(idea.submitted_at).toLocaleString()}
                          </div>
                        </div>
                        <div className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-2 py-1 rounded-full">
                          {idea.status}
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 dark:text-gray-200 mt-3 whitespace-pre-wrap">{idea.idea_description}</p>

                      <div className="grid md:grid-cols-2 gap-3 mt-3 text-xs text-gray-600 dark:text-gray-300">
                        <div><span className="font-semibold">Target:</span> {idea.target_users || 'N/A'}</div>
                        <div><span className="font-semibold">Usage:</span> {idea.usage_frequency || 'N/A'}</div>
                        <div><span className="font-semibold">Categories:</span> {(idea.feature_categories || []).join(', ') || 'N/A'}</div>
                        <div><span className="font-semibold">Contact:</span> {idea.contact_email || 'N/A'}</div>
                      </div>

                      {idea.example_references && (
                        <div className="mt-3 text-xs text-gray-600 dark:text-gray-300">
                          <span className="font-semibold">References:</span> {idea.example_references}
                        </div>
                      )}

                      <div className="grid md:grid-cols-3 gap-2 mt-4 items-end">
                        <label className="text-sm">
                          <span className="block text-gray-600 dark:text-gray-300 mb-1">Status</span>
                          <select
                            value={draft.status || 'new'}
                            onChange={(event) => updateIdeaDraft(idea.id, 'status', event.target.value)}
                            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-2"
                          >
                            <option value="new">New</option>
                            <option value="reviewing">Reviewing</option>
                            <option value="planned">Planned</option>
                            <option value="shipped">Shipped</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </label>

                        <label className="text-sm md:col-span-2">
                          <span className="block text-gray-600 dark:text-gray-300 mb-1">Admin Notes</span>
                          <textarea
                            rows={2}
                            value={draft.admin_notes || ''}
                            onChange={(event) => updateIdeaDraft(idea.id, 'admin_notes', event.target.value)}
                            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-2"
                          />
                        </label>
                      </div>

                      <div className="flex items-center justify-end gap-2 mt-3">
                        <button
                          onClick={() => saveIdea(idea.id)}
                          disabled={savingIdeaId === idea.id}
                          className="px-3 py-2 rounded-md bg-primary-600 hover:bg-primary-700 text-white text-sm disabled:bg-primary-400"
                        >
                          {savingIdeaId === idea.id ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => deleteIdea(idea.id)}
                          disabled={deletingIdeaId === idea.id}
                          className="px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm disabled:bg-red-400"
                        >
                          {deletingIdeaId === idea.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAnalyticsPage;
