import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/useAuth.js';
import { API_ENDPOINTS } from '../config/backend.js';

const CockroachKillerPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [stats, setStats] = useState({ plays: 0, bestScore: 0, lastScore: 0 });
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const savedStats = window.localStorage.getItem('cockroachKillerStats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }

    const loadLeaderboard = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.COCKROACH_KILLER.LEADERBOARD);
        if (!response.ok) return;
        const payload = await response.json();
        setLeaderboard(payload.entries || []);
      } catch {
        setLeaderboard([]);
      }
    };

    loadLeaderboard();

    const onMessage = (event) => {
      if (!event.data || event.data.type !== 'cockroach-killer-end') {
        return;
      }

      const { plays, bestScore, lastScore } = event.data;
      setStats({ plays, bestScore, lastScore });
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-400">FaltooAI Micro Tool</p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white">Cockroach Killer: Corporate Edition</h1>
              <p className="mt-4 max-w-2xl text-slate-300">
                Play instantly without login. Click the corporate cockroaches before the timer runs out, earn your title, and share your score with LinkedIn-ready humor.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-slate-950/95 p-4 ring-1 ring-slate-700">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Signed In</p>
                <p className="mt-2 text-xl font-semibold text-white">{isAuthenticated ? 'Yes' : 'No'}</p>
                <p className="mt-1 text-sm text-slate-400">{isAuthenticated ? user?.name || user?.email : 'Guest mode active'}</p>
              </div>
              <div className="rounded-3xl bg-slate-950/95 p-4 ring-1 ring-slate-700">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Plays</p>
                <p className="mt-2 text-3xl font-semibold text-amber-400">{stats.plays}</p>
              </div>
              <div className="rounded-3xl bg-slate-950/95 p-4 ring-1 ring-slate-700">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Best Score</p>
                <p className="mt-2 text-3xl font-semibold text-emerald-400">{stats.bestScore}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto]">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/95 p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500 mb-3">Leaderboard</p>
              {leaderboard.length ? (
                <div className="space-y-3">
                  {leaderboard.slice(0, 5).map((entry, index) => (
                    <div key={entry.user_id} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-900 p-3">
                      <div>
                        <div className="text-sm font-semibold text-white">{index + 1}. {entry.player_name || entry.email}</div>
                        <div className="text-xs text-slate-400">{entry.email}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-emerald-400">{entry.best_score}</div>
                        <div className="text-xs text-slate-500">{entry.total_plays} plays</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">Leaderboard warming up — play a round to get on top.</p>
              )}
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950">
            <iframe
              src="/cockroach-killer.html"
              title="Cockroach Killer game"
              className="h-[78vh] min-h-[640px] w-full border-none"
            />
          </div>

          <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/90 p-5 text-sm text-slate-400">
            <p className="font-semibold text-slate-200">How it works</p>
            <ul className="mt-3 space-y-2 list-inside list-disc text-slate-400">
              <li>No signup required — click the play card to launch the game instantly.</li>
              <li>If you sign in, your browser keeps score history and play count.</li>
              <li>After each round, the game prompts a funny LinkedIn share text you can copy.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CockroachKillerPage;
