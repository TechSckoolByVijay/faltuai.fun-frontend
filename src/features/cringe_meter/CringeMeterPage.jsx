import React, { useState } from 'react';
import { authService } from '../../auth/authService.js';
import { API_ENDPOINTS } from '../../config/backend.js';

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

const describeArc = (centerX, centerY, radius, startAngle, endAngle) => {
  const start = polarToCartesian(centerX, centerY, radius, endAngle);
  const end = polarToCartesian(centerX, centerY, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [`M ${start.x} ${start.y}`, `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`].join(' ');
};

const ScoreGauge = ({ score, label, colorClass }) => {
  const clampedScore = Math.max(0, Math.min(100, score));
  const startAngle = -120;
  const endAngle = 120;
  const gaugeAngle = startAngle + ((endAngle - startAngle) * clampedScore) / 100;
  const needle = polarToCartesian(120, 120, 70, gaugeAngle);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-slate-50 to-white dark:from-gray-800 dark:to-gray-900 p-5">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-green-500/10 via-yellow-400/10 to-red-500/10 pointer-events-none" />
      <div className="relative">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">Cringe Score</div>

        <div className="mx-auto max-w-[280px]">
          <svg viewBox="0 0 240 160" className="w-full h-auto drop-shadow-sm" role="img" aria-label={`Cringe score ${clampedScore} out of 100`}>
            <path d={describeArc(120, 120, 88, -120, -40)} fill="none" stroke="#22c55e" strokeWidth="18" strokeLinecap="round" />
            <path d={describeArc(120, 120, 88, -40, 40)} fill="none" stroke="#facc15" strokeWidth="18" strokeLinecap="round" />
            <path d={describeArc(120, 120, 88, 40, 120)} fill="none" stroke="#ef4444" strokeWidth="18" strokeLinecap="round" />

            <path d={describeArc(120, 120, 64, -120, 120)} fill="none" stroke="rgba(148,163,184,0.20)" strokeWidth="2" strokeDasharray="4 6" />

            <line x1="120" y1="120" x2={needle.x} y2={needle.y} stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" />
            <circle cx="120" cy="120" r="10" fill="#f8fafc" />
            <circle cx="120" cy="120" r="4" fill="#0f172a" />

            <text x="36" y="148" textAnchor="middle" className="fill-slate-400 text-[10px] font-semibold">0</text>
            <text x="120" y="22" textAnchor="middle" className="fill-slate-400 text-[10px] font-semibold">50</text>
            <text x="204" y="148" textAnchor="middle" className="fill-slate-400 text-[10px] font-semibold">100</text>
          </svg>
        </div>

        <div className="-mt-2 text-center">
          <div className={`text-5xl font-black tracking-tight ${colorClass}`}>{clampedScore}/100</div>
          <div className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</div>
        </div>
      </div>
    </div>
  );
};

const CringeMeterPage = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const scoreColor = (score) => {
    if (score <= 25) return 'text-green-600 dark:text-green-400';
    if (score <= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const scoreLabel = (score) => {
    if (score <= 25) return 'Almost human';
    if (score <= 60) return 'Mildly corporate';
    if (score <= 85) return 'Peak LinkedIn mode';
    return 'Maximum delusion';
  };

  const handleAnalyze = async () => {
    if (content.trim().length < 10) {
      setError('Please enter at least 10 characters.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const token = authService.getToken();
      const response = await fetch(API_ENDPOINTS.CRINGE_METER.ANALYZE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: content.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        const detail = typeof data.detail === 'string' ? data.detail : 'Failed to analyze post';
        throw new Error(detail);
      }

      setResult(data);
    } catch (requestError) {
      setError(requestError.message || 'Failed to analyze post.');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    setContent(
      'Humbled and honored to share that I had an incredible deep dive with industry leaders today. This game-changing conversation reinforced my passion for disruption and innovation.'
    );
    setError('');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg p-8 text-white mb-8">
          <h1 className="text-4xl font-bold mb-2">🤏 LinkedIn Cringe-o-Meter</h1>
          <p className="text-purple-100 text-lg">
            Detect buzzwords, score the cringe, and rewrite like an actual human.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Analyze a Post</h2>
              <button
                onClick={loadSample}
                className="text-sm bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 px-3 py-1 rounded-md hover:opacity-90"
              >
                Load Sample
              </button>
            </div>

            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Paste LinkedIn post content here..."
              className="w-full h-56 p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">{content.length} characters</span>
              <button
                onClick={handleAnalyze}
                disabled={loading || content.trim().length < 10}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition"
              >
                {loading ? 'Analyzing...' : 'Analyze Cringe'}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-md bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
                {error}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Results</h2>

            {!result ? (
              <div className="h-full min-h-[280px] flex items-center justify-center text-center text-gray-500 dark:text-gray-400">
                Run analysis to see score, buzzwords, rewrite, and roast verdict.
              </div>
            ) : (
              <div className="space-y-5">
                <ScoreGauge
                  score={result.cringe_score}
                  label={scoreLabel(result.cringe_score)}
                  colorClass={scoreColor(result.cringe_score)}
                />

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Buzzwords Detected</h3>
                  {result.buzzwords_detected?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {result.buzzwords_detected.map((item, index) => (
                        <span
                          key={`${item}-${index}`}
                          className="px-2 py-1 text-sm rounded-full bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No cringe buzzwords detected.</p>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Humanity Correction</h3>
                  <div className="p-3 rounded-md bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-gray-800 dark:text-gray-100 whitespace-pre-wrap">
                    {result.human_rewrite}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Roast Verdict</h3>
                  <div className="p-3 rounded-md bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 text-gray-800 dark:text-gray-100">
                    {result.roast_verdict}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CringeMeterPage;
