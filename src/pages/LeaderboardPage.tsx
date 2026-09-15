import React, { useState } from 'react';
import { ActivePage, LeaderboardUser, UserProfile } from '../types';
import { initialLeaderboard } from '../data/mockData';
import {
  Trophy,
  Shield,
  Medal,
  Users,
  Flame,
  Search,
  Filter,
  ArrowUp,
  Award,
} from 'lucide-react';

interface LeaderboardPageProps {
  user: UserProfile;
  onNavigate: (page: ActivePage) => void;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({
  user,
  onNavigate,
}) => {
  const [filterScope, setFilterScope] = useState<'campus' | 'department' | 'class'>('department');
  const [sortBy, setSortBy] = useState<'trustScore' | 'xp'>('trustScore');

  const entries: LeaderboardUser[] = initialLeaderboard.map(entry => {
    // If it's the current user, sync dynamically with user profile
    if (entry.isCurrentUser) {
      return {
        ...entry,
        name: `${user.name} (You)`,
        trustScore: user.digitalTrustScore,
        xp: user.currentXP,
      };
    }
    return entry;
  });

  const sortedEntries = [...entries].sort((a, b) => {
    if (sortBy === 'trustScore') return b.trustScore - a.trustScore;
    return b.xp - a.xp;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto text-slate-100 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">
              COHORT STANDINGS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Academic Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Benchmarking cyber hygiene, decision consistency, and scenario defense across your cohort.
          </p>
        </div>

        {/* User Standing Quick Pill */}
        <div className="px-4 py-2 rounded-xl bg-blue-950/50 border border-blue-800 flex items-center gap-3 self-start sm:self-auto">
          <Medal className="w-4 h-4 text-blue-400" />
          <div className="text-xs font-mono">
            <span className="text-slate-400">Your Rank:</span>{' '}
            <span className="text-white font-bold">#4 in Department</span>
          </div>
        </div>
      </div>

      {/* Filter and Scope Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Scope Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0a0f1d] border border-slate-800">
          <button
            onClick={() => setFilterScope('campus')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterScope === 'campus'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            University-Wide
          </button>
          <button
            onClick={() => setFilterScope('department')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterScope === 'department'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            CS & Engineering
          </button>
          <button
            onClick={() => setFilterScope('class')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterScope === 'class'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            SEC-401 Lab
          </button>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>Sort by:</span>
          <button
            onClick={() => setSortBy('trustScore')}
            className={`px-2.5 py-1 rounded border ${
              sortBy === 'trustScore'
                ? 'bg-blue-950 border-blue-700 text-blue-300'
                : 'border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Trust Score
          </button>
          <button
            onClick={() => setSortBy('xp')}
            className={`px-2.5 py-1 rounded border ${
              sortBy === 'xp'
                ? 'bg-blue-950 border-blue-700 text-blue-300'
                : 'border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Total XP
          </button>
        </div>
      </div>

      {/* Leaderboard Table Card */}
      <div className="rounded-2xl bg-[#0e172a] border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0b1222] border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 font-normal">Rank</th>
                <th className="py-3.5 px-4 font-normal">Student</th>
                <th className="py-3.5 px-4 font-normal">Academic Cohort</th>
                <th className="py-3.5 px-4 font-normal text-right">Trust Score</th>
                <th className="py-3.5 px-4 font-normal text-right">XP</th>
                <th className="py-3.5 px-4 font-normal text-right">Level</th>
                <th className="py-3.5 px-4 font-normal text-center">Badges</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {sortedEntries.map((student, idx) => {
                const rank = idx + 1;
                const isUser = student.isCurrentUser;

                return (
                  <tr
                    key={student.studentIdMasked || idx}
                    className={`transition-colors ${
                      isUser
                        ? 'bg-blue-950/40 border-y border-blue-800/80'
                        : 'hover:bg-[#0c1426]'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3.5 px-4 font-mono font-semibold">
                      {rank === 1 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          1
                        </span>
                      ) : rank === 2 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-400/20 text-slate-300 border border-slate-400/30">
                          2
                        </span>
                      ) : rank === 3 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700/20 text-amber-500 border border-amber-700/30">
                          3
                        </span>
                      ) : (
                        <span className="text-slate-400 pl-2">0{rank}</span>
                      )}
                    </td>

                    {/* Student Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                            isUser
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <span
                            className={`font-semibold ${
                              isUser ? 'text-white' : 'text-slate-200'
                            }`}
                          >
                            {student.name}
                          </span>
                          {isUser && (
                            <span className="ml-1.5 text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-950 border border-blue-700 text-blue-300">
                              Current Session
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Cohort */}
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {student.cohort}
                    </td>

                    {/* Digital Trust Score */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-mono font-bold text-sm text-cyan-300">
                        {student.trustScore}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">/100</span>
                    </td>

                    {/* Total XP */}
                    <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                      {student.xp.toLocaleString()}
                    </td>

                    {/* Level */}
                    <td className="py-3.5 px-4 text-right font-mono">
                      <span className="inline-flex items-center gap-1 text-blue-400 text-xs">
                        Lv. 0{student.level}
                      </span>
                    </td>

                    {/* Badges count */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-blue-300">
                        {student.badgeCount}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
