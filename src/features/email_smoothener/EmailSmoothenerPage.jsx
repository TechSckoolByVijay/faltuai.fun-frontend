import React, { useState } from 'react';

import { authService } from '../../auth/authService.js';
import { API_ENDPOINTS } from '../../config/backend.js';

const detectMood = (text = '') => {
  const content = text.toLowerCase();

  if (/(urgent|asap|immediately|frustrat|concern|issue|problem|blocked|delay)/.test(content)) {
    return 'urgent';
  }
  if (/(thank|appreciate|glad|happy|great|kind regards|best regards)/.test(content)) {
    return 'positive';
  }
  return 'neutral';
};

const getOutputTheme = (styleKey, emailText) => {
  if (styleKey === 'kind_but_firm') {
    return {
      card: 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/70',
      chip: 'bg-emerald-200/70 text-emerald-900 dark:bg-emerald-900/70 dark:text-emerald-100',
      track: 'bg-emerald-100/80 dark:bg-emerald-900/40',
    };
  }

  const mood = detectMood(emailText);

  if (mood === 'urgent') {
    return {
      card: 'border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/70',
      chip: 'bg-rose-200/70 text-rose-900 dark:bg-rose-900/70 dark:text-rose-100',
      track: 'bg-rose-100/80 dark:bg-rose-900/40',
    };
  }

  if (mood === 'positive') {
    return {
      card: 'border-sky-300 dark:border-sky-700 bg-sky-50 dark:bg-sky-950/70',
      chip: 'bg-sky-200/70 text-sky-900 dark:bg-sky-900/70 dark:text-sky-100',
      track: 'bg-sky-100/80 dark:bg-sky-900/40',
    };
  }

  return {
    card: 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/70',
    chip: 'bg-amber-200/70 text-amber-900 dark:bg-amber-900/70 dark:text-amber-100',
    track: 'bg-amber-100/80 dark:bg-amber-900/40',
  };
};

const getMeterTone = (score) => {
  if (score >= 80) return 'good';
  if (score >= 55) return 'okay';
  return 'low';
};

const getMeterStyles = (tone) => {
  if (tone === 'good') {
    return {
      chip: 'bg-emerald-200/70 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-100',
      track: 'bg-emerald-100/80 dark:bg-emerald-900/40',
      fill: 'bg-emerald-500',
    };
  }

  if (tone === 'okay') {
    return {
      chip: 'bg-amber-200/70 text-amber-900 dark:bg-amber-900/60 dark:text-amber-100',
      track: 'bg-amber-100/80 dark:bg-amber-900/40',
      fill: 'bg-amber-500',
    };
  }

  return {
    chip: 'bg-rose-200/70 text-rose-900 dark:bg-rose-900/60 dark:text-rose-100',
    track: 'bg-rose-100/80 dark:bg-rose-900/40',
    fill: 'bg-rose-500',
  };
};

const AssessmentMeter = ({ label, score }) => {
  const tone = getMeterTone(score);
  const styles = getMeterStyles(tone);

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950/80 p-3 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-700 dark:text-slate-200">{label}</span>
        <span className={`text-xs px-2 py-1 rounded-full ${styles.chip}`}>{score}%</span>
      </div>
      <div className={`w-full h-2 rounded-full overflow-hidden ${styles.track}`}>
        <div className={`h-full ${styles.fill}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
};

const EmailSmoothenerPage = () => {
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleSmoothen = async () => {
    if (rawText.trim().length < 10) {
      setError('Please paste at least 10 characters.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const token = authService.getToken();
      const response = await fetch(API_ENDPOINTS.EMAIL_SMOOTHENER.SMOOTHEN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ raw_text: rawText.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(typeof data.detail === 'string' ? data.detail : 'Failed to smoothen draft');
      }

      setResult(data);
    } catch (requestError) {
      setError(requestError.message || 'Failed to smoothen draft');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    setRawText(
      "Hey, I sent this like 3 times and still no reply. If this project isn't moving then just tell me straight. I can't keep waiting around for vague updates."
    );
    setError('');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/40 dark:from-gray-950 dark:via-slate-900 dark:to-black p-6 sm:p-8 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="rounded-xl border border-emerald-200 dark:border-green-500/40 bg-white/90 dark:bg-black/70 p-6 shadow-xl dark:shadow-2xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-emerald-700 dark:text-green-400">
            📨 Email Smoothener
          </h1>
          <p className="mt-2 text-emerald-700/80 dark:text-green-200/90">
            Dump your raw draft. Get three Faltoo versions with ghosting probability so you can send and move on.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-emerald-200 dark:border-green-500/40 bg-white dark:bg-black/75 p-5 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-emerald-700 dark:text-green-300">Raw Draft Terminal</h2>
              <button
                onClick={loadSample}
                className="text-xs px-3 py-1 rounded-md border border-emerald-300 dark:border-green-500 text-emerald-700 dark:text-green-300 hover:bg-emerald-50 dark:hover:bg-green-900/30"
              >
                Load Sample
              </button>
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 overflow-hidden shadow-sm">
              <div className="px-3 py-2 text-xs border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-mono bg-slate-50 dark:bg-slate-950">
                email input
              </div>
              <textarea
                value={rawText}
                onChange={(event) => setRawText(event.target.value)}
                placeholder="Paste your anxious / blunt / messy email thoughts here..."
                className="w-full h-72 p-4 bg-white dark:bg-slate-950 text-slate-800 dark:text-green-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-mono text-sm focus:outline-none"
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{rawText.length} chars</span>
              <button
                onClick={handleSmoothen}
                disabled={loading || rawText.trim().length < 10}
                className="px-5 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 dark:bg-green-500 dark:hover:bg-green-400 text-white dark:text-black font-semibold disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:text-slate-500 dark:disabled:text-slate-300"
              >
                {loading ? 'Processing...' : 'Smoothen Draft'}
              </button>
            </div>

            {error && (
              <div className="mt-3 rounded-md border border-red-300 dark:border-red-600/60 bg-red-50 dark:bg-red-950/60 px-3 py-2 text-sm text-red-700 dark:text-red-200">
                {error}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/80 p-5 shadow-sm dark:shadow-none">
            <h2 className="text-xl font-semibold mb-1 text-slate-900 dark:text-white">Faltu Output</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Three sendable versions + reply-risk vibe check.</p>

            {!result ? (
              <div className="h-[26rem] rounded-lg border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-sm text-slate-500 dark:text-slate-500 text-center px-6 bg-slate-50/70 dark:bg-transparent">
                Run smoothening to generate Corporate Robot, Kind but Firm, and No Nonsense variants.
              </div>
            ) : (
              <div className="space-y-4 max-h-[35rem] overflow-y-auto pr-1">
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-sm text-slate-700 dark:text-slate-300">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">Overall Vibe:</span> {result.overall_vibe}
                </div>

                {result.draft_assessment && (
                  <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-900/80 p-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Draft Quality Indicators</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${result.draft_assessment.is_good_enough ? 'bg-emerald-200/70 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-100' : 'bg-amber-200/70 text-amber-900 dark:bg-amber-900/60 dark:text-amber-100'}`}>
                        {result.draft_assessment.is_good_enough ? 'Good enough' : 'Needs improvement'}
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3">
                      <AssessmentMeter
                        label="Clarity-o-Meter 🧠"
                        score={result.draft_assessment.clarity_score}
                      />
                      <AssessmentMeter
                        label="Polite-o-Meter"
                        score={result.draft_assessment.politeness_score}
                      />
                      <AssessmentMeter
                        label="Formal-o-Meter"
                        score={result.draft_assessment.formality_score}
                      />
                    </div>

                    <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">Tone:</span> {result.draft_assessment.tone_summary}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-2 py-1 rounded-full ${result.draft_assessment.sounds_friendly ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                          Friendly: {result.draft_assessment.sounds_friendly ? 'Yes' : 'No'}
                        </span>
                        <span className={`px-2 py-1 rounded-full ${result.draft_assessment.sounds_aggressive ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                          Aggressive: {result.draft_assessment.sounds_aggressive ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>

                    <div className={`rounded-md px-3 py-2 text-sm ${result.draft_assessment.is_good_enough ? 'border border-emerald-700/60 bg-emerald-950/40 text-emerald-200' : 'border border-amber-700/60 bg-amber-950/40 text-amber-200'}`}>
                      {result.draft_assessment.good_enough_message}
                    </div>
                  </div>
                )}

                {result.variants?.map((variant) => {
                  const theme = getOutputTheme(variant.style_key, variant.smoothed_email);

                  return (
                  <div
                    key={variant.style_key}
                    className={`rounded-lg border p-4 ${theme.card}`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{variant.style_label}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${theme.chip}`}>
                        Ghosting Probability: {variant.ghosting_probability}%
                      </span>
                    </div>

                    <div className={`w-full h-2 rounded-full mb-3 overflow-hidden ${theme.track}`}>
                      <div
                        className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                        style={{ width: `${variant.ghosting_probability}%` }}
                      />
                    </div>

                    <div className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-100 leading-relaxed">
                      {variant.smoothed_email}
                    </div>
                  </div>
                )})}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailSmoothenerPage;
