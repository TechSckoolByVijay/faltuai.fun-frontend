import React, { useState } from 'react';

import { authService } from '../../auth/authService.js';
import { API_ENDPOINTS } from '../../config/backend.js';

const TIME_OPTIONS = ['30 minutes', '1-2 hours', '3-5 hours', 'Weekend project'];
const CREATE_OPTIONS = ['Small app/tool', 'Content (blog/video/post)', 'Automation', 'Study project', 'Anything interesting'];
const SKILL_OPTIONS = ['Programming', 'AI/GenAI', 'Productivity', 'Business/startup', 'Design', 'Anything'];
const DIFFICULTY_OPTIONS = ['Beginner', 'Intermediate', 'Challenge me'];

const IdeaSparkPage = () => {
  const [phrase, setPhrase] = useState('');
  const [timeAvailable, setTimeAvailable] = useState('1-2 hours');
  const [createType, setCreateType] = useState('Anything interesting');
  const [skillArea, setSkillArea] = useState('Anything');
  const [difficultyLevel, setDifficultyLevel] = useState('Beginner');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    if (phrase.trim().length < 2) {
      setError('Please enter at least 2 characters.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const token = authService.getToken();
      const response = await fetch(API_ENDPOINTS.IDEA_SPARK.GENERATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phrase: phrase.trim(),
          time_available: timeAvailable,
          create_type: createType,
          skill_area: skillArea,
          difficulty_level: difficultyLevel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const detail = typeof data.detail === 'string' ? data.detail : 'Failed to generate ideas';
        throw new Error(detail);
      }

      setResult(data);
    } catch (requestError) {
      setError(requestError.message || 'Failed to generate ideas.');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    setPhrase('weekend productivity for students');
    setTimeAvailable('1-2 hours');
    setCreateType('Anything interesting');
    setSkillArea('Anything');
    setDifficultyLevel('Beginner');
    setError('');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-8 text-white mb-8">
          <h1 className="text-4xl font-bold mb-2">💡 Idea Spark</h1>
          <p className="text-blue-100 text-lg">
            Enter one phrase and get 10 practical micro-ideas you can build, ship, or test today.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Spark from a Phrase</h2>
              <button
                onClick={loadSample}
                className="text-sm bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-md hover:opacity-90"
              >
                Load Sample
              </button>
            </div>

            <input
              type="text"
              value={phrase}
              onChange={(event) => setPhrase(event.target.value)}
              placeholder="Example: side hustle for college students"
              className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="grid sm:grid-cols-2 gap-2 mt-3">
              <label className="text-xs text-gray-600 dark:text-gray-300">
                <span className="block mb-1 font-medium">Time Available</span>
                <select
                  value={timeAvailable}
                  onChange={(event) => setTimeAvailable(event.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {TIME_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-xs text-gray-600 dark:text-gray-300">
                <span className="block mb-1 font-medium">What Do You Want To Create?</span>
                <select
                  value={createType}
                  onChange={(event) => setCreateType(event.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CREATE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-xs text-gray-600 dark:text-gray-300">
                <span className="block mb-1 font-medium">Skill Area</span>
                <select
                  value={skillArea}
                  onChange={(event) => setSkillArea(event.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {SKILL_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-xs text-gray-600 dark:text-gray-300">
                <span className="block mb-1 font-medium">Difficulty Level</span>
                <select
                  value={difficultyLevel}
                  onChange={(event) => setDifficultyLevel(event.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {DIFFICULTY_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">{phrase.length} characters</span>
              <button
                onClick={handleGenerate}
                disabled={loading || phrase.trim().length < 2}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition"
              >
                {loading ? 'Sparking...' : 'Spark Ideas'}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-md bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
                {error}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Your 10 Micro-Ideas</h2>

            {!result ? (
              <div className="h-full min-h-[280px] flex items-center justify-center text-center text-gray-500 dark:text-gray-400">
                Enter a phrase and click Spark Ideas to generate your list.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Phrase: <span className="font-medium text-gray-700 dark:text-gray-200">{result.phrase}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-md bg-gray-50 dark:bg-gray-800 px-2 py-1 text-gray-700 dark:text-gray-200">⏱ {timeAvailable}</div>
                  <div className="rounded-md bg-gray-50 dark:bg-gray-800 px-2 py-1 text-gray-700 dark:text-gray-200">🧩 {createType}</div>
                  <div className="rounded-md bg-gray-50 dark:bg-gray-800 px-2 py-1 text-gray-700 dark:text-gray-200">🎯 {skillArea}</div>
                  <div className="rounded-md bg-gray-50 dark:bg-gray-800 px-2 py-1 text-gray-700 dark:text-gray-200">📈 {difficultyLevel}</div>
                </div>

                <ol className="space-y-3 list-decimal list-inside">
                  {result.ideas?.map((idea, index) => (
                    <li
                      key={`${idea}-${index}`}
                      className="rounded-lg border border-blue-100 dark:border-blue-900 bg-blue-50/70 dark:bg-blue-950/30 px-4 py-3 text-gray-800 dark:text-gray-100"
                    >
                      {idea}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaSparkPage;
