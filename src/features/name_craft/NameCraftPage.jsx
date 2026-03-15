import React, { useState } from 'react';

import { authService } from '../../auth/authService.js';
import { API_ENDPOINTS } from '../../config/backend.js';

const PROJECT_TYPES = ['enterprise', 'startup', 'personal', 'weekend project'];
const NAMING_PREFERENCES = ['professional', 'balanced', 'fun'];
const CLOUD_PROVIDERS = ['none', 'azure', 'aws', 'gcp'];
const INFRA_STYLES = ['managed', 'containers', 'serverless', 'hybrid'];
const DEVOPS_WORKFLOWS = ['github-actions', 'azure-devops', 'gitlab-ci', 'jenkins', 'none'];
const ARCHITECTURES = ['monolith', 'modular-monolith', 'microservices'];

const NameCraftPage = () => {
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('startup');
  const [namingPreference, setNamingPreference] = useState('balanced');

  const [includeDatabase, setIncludeDatabase] = useState(true);
  const [includeMicroservices, setIncludeMicroservices] = useState(false);
  const [includeFrontendBackendSeparation, setIncludeFrontendBackendSeparation] = useState(true);
  const [includeMessagingSystem, setIncludeMessagingSystem] = useState(false);
  const [includeAnalytics, setIncludeAnalytics] = useState(false);

  const [advancedOptionsEnabled, setAdvancedOptionsEnabled] = useState(false);
  const [cloudProvider, setCloudProvider] = useState('none');
  const [infrastructureStyle, setInfrastructureStyle] = useState('managed');
  const [devopsWorkflow, setDevopsWorkflow] = useState('github-actions');
  const [microservicesArchitecture, setMicroservicesArchitecture] = useState('monolith');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [copiedField, setCopiedField] = useState('');

  const handleCopy = async (value, key) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(key);
      setTimeout(() => setCopiedField(''), 1200);
    } catch {
      setCopiedField('');
    }
  };

  const loadSample = () => {
    setProjectName('Task Orbit');
    setProjectType('startup');
    setNamingPreference('balanced');
    setIncludeDatabase(true);
    setIncludeMicroservices(true);
    setIncludeFrontendBackendSeparation(true);
    setIncludeMessagingSystem(true);
    setIncludeAnalytics(false);
    setAdvancedOptionsEnabled(true);
    setCloudProvider('azure');
    setInfrastructureStyle('containers');
    setDevopsWorkflow('github-actions');
    setMicroservicesArchitecture('microservices');
    setResult(null);
    setError('');
  };

  const handleGenerate = async () => {
    if (projectName.trim().length < 2) {
      setError('Please enter a project name with at least 2 characters.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const token = authService.getToken();
      const response = await fetch(API_ENDPOINTS.NAME_CRAFT.GENERATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          project_name: projectName.trim(),
          project_type: projectType,
          naming_preference: namingPreference,
          include_database: includeDatabase,
          include_microservices: includeMicroservices,
          include_frontend_backend_separation: includeFrontendBackendSeparation,
          include_messaging_system: includeMessagingSystem,
          include_analytics: includeAnalytics,
          advanced_options_enabled: advancedOptionsEnabled,
          cloud_provider: advancedOptionsEnabled ? cloudProvider : 'none',
          infrastructure_style: advancedOptionsEnabled ? infrastructureStyle : 'managed',
          devops_workflow: advancedOptionsEnabled ? devopsWorkflow : 'github-actions',
          microservices_architecture: advancedOptionsEnabled ? microservicesArchitecture : 'monolith',
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        const detail = typeof data.detail === 'string' ? data.detail : 'Failed to generate names';
        throw new Error(detail);
      }

      setResult(data);
    } catch (requestError) {
      setError(requestError.message || 'Failed to generate names.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl shadow-lg p-8 text-white mb-8">
          <h1 className="text-4xl font-bold mb-2">🧭 NameCraft</h1>
          <p className="text-indigo-100 text-lg">
            Generate practical naming conventions for repos, components, environments, cloud resources, and pipelines.
          </p>
        </div>

        <div className="grid xl:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Project Input</h2>
              <button
                onClick={loadSample}
                className="text-sm bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200 px-3 py-1 rounded-md hover:opacity-90"
              >
                Load Sample
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-sm text-gray-700 dark:text-gray-300">
                <span className="block mb-1 font-medium">Project Name</span>
                <input
                  type="text"
                  value={projectName}
                  onChange={(event) => setProjectName(event.target.value)}
                  placeholder="Example: Smart Budget Buddy"
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </label>

              <div className="grid sm:grid-cols-2 gap-2">
                <label className="block text-sm text-gray-700 dark:text-gray-300">
                  <span className="block mb-1 font-medium">Project Type</span>
                  <select
                    value={projectType}
                    onChange={(event) => setProjectType(event.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                  >
                    {PROJECT_TYPES.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm text-gray-700 dark:text-gray-300">
                  <span className="block mb-1 font-medium">Naming Preference</span>
                  <select
                    value={namingPreference}
                    onChange={(event) => setNamingPreference(event.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                  >
                    {NAMING_PREFERENCES.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Optional Components</div>
                <div className="grid sm:grid-cols-2 gap-2 text-sm">
                  <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300"><input type="checkbox" checked={includeDatabase} onChange={(event) => setIncludeDatabase(event.target.checked)} /> Database</label>
                  <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300"><input type="checkbox" checked={includeMicroservices} onChange={(event) => setIncludeMicroservices(event.target.checked)} /> Microservices</label>
                  <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300"><input type="checkbox" checked={includeFrontendBackendSeparation} onChange={(event) => setIncludeFrontendBackendSeparation(event.target.checked)} /> Frontend/Backend</label>
                  <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300"><input type="checkbox" checked={includeMessagingSystem} onChange={(event) => setIncludeMessagingSystem(event.target.checked)} /> Messaging</label>
                  <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300"><input type="checkbox" checked={includeAnalytics} onChange={(event) => setIncludeAnalytics(event.target.checked)} /> Analytics</label>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                  <input
                    type="checkbox"
                    checked={advancedOptionsEnabled}
                    onChange={(event) => setAdvancedOptionsEnabled(event.target.checked)}
                  />
                  Advanced Options
                </label>

                {advancedOptionsEnabled && (
                  <div className="grid sm:grid-cols-2 gap-2 mt-3">
                    <label className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="block mb-1">Cloud Provider</span>
                      <select value={cloudProvider} onChange={(event) => setCloudProvider(event.target.value)} className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm">
                        {CLOUD_PROVIDERS.map((option) => (<option key={option} value={option}>{option}</option>))}
                      </select>
                    </label>

                    <label className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="block mb-1">Infrastructure Style</span>
                      <select value={infrastructureStyle} onChange={(event) => setInfrastructureStyle(event.target.value)} className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm">
                        {INFRA_STYLES.map((option) => (<option key={option} value={option}>{option}</option>))}
                      </select>
                    </label>

                    <label className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="block mb-1">DevOps Workflow</span>
                      <select value={devopsWorkflow} onChange={(event) => setDevopsWorkflow(event.target.value)} className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm">
                        {DEVOPS_WORKFLOWS.map((option) => (<option key={option} value={option}>{option}</option>))}
                      </select>
                    </label>

                    <label className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="block mb-1">Architecture</span>
                      <select value={microservicesArchitecture} onChange={(event) => setMicroservicesArchitecture(event.target.value)} className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm">
                        {ARCHITECTURES.map((option) => (<option key={option} value={option}>{option}</option>))}
                      </select>
                    </label>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">Output uses concise, copy-paste-ready naming suggestions.</span>
                <button
                  onClick={handleGenerate}
                  disabled={loading || projectName.trim().length < 2}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg text-sm font-medium transition"
                >
                  {loading ? 'Crafting...' : 'Craft Names'}
                </button>
              </div>

              {error && (
                <div className="mt-2 p-3 rounded-md bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Naming Suggestions</h2>

            {!result ? (
              <div className="h-full min-h-[420px] flex items-center justify-center text-center text-gray-500 dark:text-gray-400">
                Add your project inputs, choose relevant components, and click Craft Names.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 p-3">
                  <div className="text-xs uppercase tracking-wide text-indigo-700 dark:text-indigo-300">Recommended Repository</div>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <code className="text-sm font-semibold text-gray-800 dark:text-gray-100">{result.recommended_repository_name}</code>
                    <button
                      onClick={() => handleCopy(result.recommended_repository_name, 'repo')}
                      className="text-xs px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                      {copiedField === 'repo' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200">Environment Names</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {result.environment_names?.map((name) => (
                      <span key={name} className="px-2 py-1 rounded-md text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>

                {Object.entries(result.component_suggestions || {}).map(([component, names]) => (
                  <div key={component} className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 capitalize">{component.replace(/[-_]/g, ' ')}</div>
                    <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      {names.map((name) => (
                        <li key={`${component}-${name}`} className="flex items-center justify-between gap-2">
                          <code>{name}</code>
                          <button
                            onClick={() => handleCopy(name, `${component}-${name}`)}
                            className="text-xs px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 hover:opacity-90"
                          >
                            {copiedField === `${component}-${name}` ? 'Copied' : 'Copy'}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {Object.keys(result.environment_prefixed_examples || {}).length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Environment-prefixed Examples</div>
                    <div className="space-y-2">
                      {Object.entries(result.environment_prefixed_examples).map(([key, names]) => (
                        <div key={key} className="text-xs text-gray-700 dark:text-gray-300">
                          <span className="font-semibold">{key.replace(/[-_]/g, ' ')}:</span> {names.join(', ')}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {Object.keys(result.cloud_resource_suggestions || {}).length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Cloud-specific Suggestions</div>
                    <div className="space-y-2">
                      {Object.entries(result.cloud_resource_suggestions).map(([key, names]) => (
                        <div key={key} className="text-xs text-gray-700 dark:text-gray-300">
                          <span className="font-semibold">{key.replace(/[-_]/g, ' ')}:</span> {names.join(', ')}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.notes?.length > 0 && (
                  <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 p-3">
                    <div className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">Notes</div>
                    <ul className="list-disc list-inside text-xs text-blue-700 dark:text-blue-300 space-y-1">
                      {result.notes.map((note, index) => (
                        <li key={`${note}-${index}`}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NameCraftPage;
