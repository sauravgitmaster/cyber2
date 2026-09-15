import React from 'react';
import { ActivePage, SkillCategoryScore, UserProfile } from '../types';
import { TrustScoreGauge } from '../components/common/TrustScoreGauge';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Compass,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';

interface AnalyticsPageProps {
  user: UserProfile;
  skills: SkillCategoryScore[];
  onNavigate: (page: ActivePage, params?: { pathId?: string; moduleId?: string }) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  user,
  skills,
  onNavigate,
}) => {
  // Historical 5-week trust score data points
  const timelineData = [
    { period: 'Week 1', score: 58, label: 'Baseline Test' },
    { period: 'Week 2', score: 62, label: 'Passwords Vault' },
    { period: 'Week 3', score: 66, label: 'Privacy Pruning' },
    { period: 'Week 4', score: 68, label: 'MFA Defense' },
    { period: 'Current', score: user.digitalTrustScore, label: '+6 This Week' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto text-slate-100 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">
              PERFORMANCE INTELLIGENCE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Progress & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Clear tracking of your security hygiene, defensive skill balance, and score evolution.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
          Evaluated across {user.scenariosCompletedCount} practical decision drills
        </div>
      </div>

      {/* Top Cards: Trust Score + Highlight Focus Areas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Trust Score */}
        <div className="p-5 rounded-2xl bg-[#0e172a] border border-slate-800 shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">
              AGGREGATE RATING
            </span>
            <h3 className="text-sm font-semibold text-white">Digital Trust Score</h3>
            <span className="text-xs font-mono text-blue-400">+{user.trustScoreDelta} this week</span>
            <p className="text-[11px] text-slate-400 mt-1">Top 15% in university cohort</p>
          </div>
          <TrustScoreGauge score={user.digitalTrustScore} delta={user.trustScoreDelta} size="sm" showLabel={false} />
        </div>

        {/* Card 2: Strongest Skill */}
        <div className="p-5 rounded-2xl bg-[#0e172a] border border-slate-800 shadow-xl flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-400">
              STRONGEST SKILL
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold">86%</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Password Security</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Consistent entropy creation, zero password reuse, and proper authenticator app usage.
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-300">Proficient Tier</span>
        </div>

        {/* Card 3: Focus Area */}
        <div className="p-5 rounded-2xl bg-[#0e172a] border border-slate-800 shadow-xl flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-amber-400">
              FOCUS AREA
            </span>
            <span className="text-xs font-mono text-amber-400 font-bold">54%</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Social Engineering</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Needs practice recognizing authority pretexting and phone verification traps.
            </p>
          </div>
          <button
            onClick={() => onNavigate('learning-paths', { pathId: 'cyber-safety-fundamentals', moduleId: 'mod-soc-eng-basics' })}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
          >
            <span>Launch Social Engineering Basics</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Skill Categories Breakdown */}
      <div className="p-6 rounded-2xl bg-[#0e172a] border border-slate-800 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              DIAGNOSTIC MATRIX
            </span>
            <h2 className="text-lg font-bold text-white">Skill Categories & Readiness</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">Target Benchmark: 80%</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map(skill => {
            const isStrength = skill.score >= 80;
            const isDeveloping = skill.score < 65;

            return (
              <div
                key={skill.id}
                className="p-4 rounded-xl bg-[#0a0f1d] border border-slate-800/80 space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{skill.name}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400">+{skill.change}%</span>
                    <span
                      className={`font-bold ${
                        isStrength
                          ? 'text-emerald-400'
                          : isDeveloping
                          ? 'text-amber-400'
                          : 'text-blue-400'
                      }`}
                    >
                      {skill.score}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isStrength
                        ? 'bg-emerald-500'
                        : isDeveloping
                        ? 'bg-amber-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${skill.score}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate pr-2">{skill.description}</span>
                  <span className="font-mono text-slate-300 shrink-0 font-medium">
                    {skill.level}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Improvement Over Time Chart */}
      <div className="p-6 rounded-2xl bg-[#0e172a] border border-slate-800 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              LONGITUDINAL TREND
            </span>
            <h2 className="text-lg font-bold text-white">Digital Trust Score Progression</h2>
          </div>
          <span className="text-xs font-mono text-blue-300">
            Net Improvement: +14 Points
          </span>
        </div>

        {/* Timeline visualization */}
        <div className="grid grid-cols-5 gap-3 pt-4">
          {timelineData.map((item, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-[#0a0f1d] border border-slate-800 text-center flex flex-col justify-between space-y-2"
            >
              <span className="text-[10px] font-mono text-slate-400 uppercase">
                {item.period}
              </span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-white">
                {item.score}
              </div>
              <span className="text-[10px] text-blue-300 font-mono">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
