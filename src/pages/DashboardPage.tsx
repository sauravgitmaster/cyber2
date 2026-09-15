import React from 'react';
import { ActivePage, UserProfile, LearningPath, MentorInsight } from '../types';
import { TrustScoreGauge } from '../components/common/TrustScoreGauge';
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  Bot,
  Flame,
  Terminal,
  ChevronRight,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface DashboardPageProps {
  user: UserProfile;
  onNavigate: (page: ActivePage, params?: { pathId?: string; moduleId?: string; scenarioId?: string }) => void;
  paths: LearningPath[];
  mentorInsight: MentorInsight;
  onOpenMentor: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  onNavigate,
  paths,
  mentorInsight,
  onOpenMentor,
}) => {
  // Primary active path and module
  const activePath = paths.find(p => p.id === 'cyber-safety-fundamentals') || paths[0];
  const activeModule = activePath?.modules.find(m => !m.isCompleted) || activePath?.modules[0];

  // Modules count
  const allModules = paths.flatMap(p => p.modules);
  const completedModulesCount = allModules.filter(m => m.isCompleted).length;
  const totalModulesCount = allModules.length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6 text-slate-200">
      {/* Top Learner Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#1a2233] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
            Security Learning Workstation
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Student: <span className="text-slate-300 font-mono font-medium">{user.name}</span> ({user.studentId}) • {user.institution}
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Curriculum Active</span>
          </div>
          <span>•</span>
          <span>{completedModulesCount} of {totalModulesCount} Modules</span>
        </div>
      </div>

      {/* SECTION A: CURRENT LEARNING FOCUS (Dominant Section) */}
      <div className="p-5 sm:p-6 rounded-lg bg-[#0c121e] border border-[#1b2538] space-y-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400 font-medium">
                CURRENT FOCUS • {activePath?.title}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              {activeModule?.title || 'Phishing & Social Engineering Tactics'}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              {activeModule?.summary || 'Learn to recognize social engineering pretexts, deceptive URL anatomy, and adversarial urgency cues.'}
            </p>
          </div>

          {/* Large prominent Continue CTA */}
          <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 shrink-0">
            <button
              onClick={() => onNavigate('module-detail', { pathId: activePath.id, moduleId: activeModule?.id })}
              className="w-full sm:w-auto px-5 py-2.5 rounded-[4px] bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Continue Module</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Est. {activeModule?.estimatedMinutes || 12} min remaining</span>
            </span>
          </div>
        </div>

        {/* Progress Bar & Module Progress Status */}
        <div className="space-y-1.5 pt-1 border-t border-[#162033]">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Module Completion</span>
            <span className="text-slate-200 font-medium">{activeModule?.progress || 0}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#141b2b] rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${activeModule?.progress || 0}%` }}
            />
          </div>
        </div>

        {/* Path Progression Timeline (Linear Steps) */}
        <div className="pt-2">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <span>Curriculum Progression</span>
            <button
              onClick={() => onNavigate('learning-paths', { pathId: activePath.id })}
              className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 lowercase"
            >
              <span>view syllabus</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {activePath.modules.map((mod, idx) => {
              const isCompleted = mod.isCompleted;
              const isActive = mod.id === activeModule?.id;

              return (
                <div
                  key={mod.id}
                  onClick={() => onNavigate('module-detail', { pathId: activePath.id, moduleId: mod.id })}
                  className={`p-2.5 rounded-[4px] border text-left cursor-pointer transition-colors flex flex-col justify-between space-y-2 ${
                    isActive
                      ? 'bg-[#141d2f] border-blue-500/80 text-white'
                      : isCompleted
                      ? 'bg-[#0f1523] border-[#1f2b40] text-slate-300 hover:border-slate-600'
                      : 'bg-[#0a0e18] border-[#161f30] text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400">0{idx + 1}</span>
                    {isCompleted ? (
                      <span className="w-4 h-4 rounded-full bg-blue-900/60 border border-blue-500/50 flex items-center justify-center text-blue-400">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    ) : isActive ? (
                      <span className="text-[10px] font-mono font-bold text-blue-400">ACTIVE</span>
                    ) : (
                      <Circle className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-medium line-clamp-1">
                      {mod.title}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                      {isCompleted ? 'Done' : isActive ? `${mod.progress}% complete` : `${mod.estimatedMinutes}m`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2-COLUMN GRID: PROGRESS SNAPSHOT + AI MENTOR CALLOUT & SECONDARY ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN: PROGRESS SNAPSHOT (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-lg bg-[#0c121e] border border-[#1b2538] space-y-4">
            <div className="flex items-center justify-between border-b border-[#162033] pb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium">
                PROGRESS SNAPSHOT
              </span>
              <button
                onClick={() => onNavigate('progress-analytics')}
                className="text-[11px] font-mono text-blue-400 hover:text-blue-300"
              >
                Analytics →
              </button>
            </div>

            {/* Digital Trust Score Gauge */}
            <TrustScoreGauge
              score={user.digitalTrustScore}
              delta={user.trustScoreDelta}
              size="md"
            />

            {/* Structured Metric Stats */}
            <div className="pt-2 border-t border-[#162033] grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-[#090d17] border border-[#172033]">
                <span className="text-slate-400 block text-[10px]">MODULES</span>
                <span className="font-semibold text-slate-100 text-sm">
                  {completedModulesCount}/{totalModulesCount}
                </span>
              </div>
              <div className="p-2 rounded bg-[#090d17] border border-[#172033]">
                <span className="text-slate-400 block text-[10px]">SCENARIOS</span>
                <span className="font-semibold text-slate-100 text-sm">
                  {user.scenariosCompletedCount}
                </span>
              </div>
              <div className="p-2 rounded bg-[#090d17] border border-[#172033]">
                <span className="text-slate-400 block text-[10px]">STREAK</span>
                <span className="font-semibold text-amber-400 text-sm flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  {user.streakDays}d
                </span>
              </div>
              <div className="p-2 rounded bg-[#090d17] border border-[#172033]">
                <span className="text-slate-400 block text-[10px]">LEVEL</span>
                <span className="font-semibold text-blue-400 text-sm">
                  Lv.{user.level}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI MENTOR CALLOUT + PRACTICE DRILLS (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* COMPACT AI MENTOR CALLOUT (Not a huge glowing chat box) */}
          <div className="p-4 rounded-lg bg-[#0c1322] border border-[#1e2a42] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded bg-blue-950/60 border border-blue-800/50 text-blue-400 shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="text-[11px] font-mono text-blue-400 uppercase tracking-wider font-medium">
                  CYBERMENTOR RECOMMENDATION
                </div>
                <p className="text-xs text-slate-300 leading-normal">
                  {mentorInsight?.observation || 'Focus on Phishing Detection next based on your baseline assessment to reinforce threat identification.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => onNavigate('module-detail', { pathId: mentorInsight?.recommendationPathId || 'cyber-safety-fundamentals', moduleId: 'mod-phishing-social' })}
                className="px-3 py-1.5 rounded-[4px] bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
              >
                Start Drill
              </button>
              <button
                onClick={onOpenMentor}
                className="px-3 py-1.5 rounded-[4px] bg-[#121a2a] hover:bg-[#182338] border border-[#22314d] text-slate-300 text-xs font-medium transition-colors"
              >
                Ask Mentor
              </button>
            </div>
          </div>

          {/* SECONDARY ACTIONS: PRACTICE SCENARIOS */}
          <div className="p-5 rounded-lg bg-[#0c121e] border border-[#1b2538] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium">
                  HANDS-ON PRACTICE
                </span>
                <h3 className="text-sm font-semibold text-white">Recommended Scenarios</h3>
              </div>
              <button
                onClick={() => onNavigate('interactive-scenario')}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
              >
                <span>All Scenarios</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Scenario 1 */}
              <div
                onClick={() => onNavigate('interactive-scenario', { scenarioId: 'scenario-univ-phish' })}
                className="p-3.5 rounded-[4px] bg-[#090e18] border border-[#182235] hover:border-blue-500/70 transition-colors cursor-pointer flex flex-col justify-between space-y-2 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-200 group-hover:text-blue-300 transition-colors">
                      Spot the Phish
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#131b2c] text-slate-400">
                      8 min
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    Inspect realistic credential harvest emails with mismatched DKIM/SPF headers.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[#131b29] text-[10px] font-mono text-slate-400">
                  <span className="text-emerald-400">Beginner</span>
                  <span className="flex items-center gap-1 text-blue-400 group-hover:translate-x-0.5 transition-transform">
                    <Terminal className="w-3 h-3" />
                    <span>Launch Drill</span>
                  </span>
                </div>
              </div>

              {/* Scenario 2 */}
              <div
                onClick={() => onNavigate('interactive-scenario', { scenarioId: 'scenario-campus-usb' })}
                className="p-3.5 rounded-[4px] bg-[#090e18] border border-[#182235] hover:border-blue-500/70 transition-colors cursor-pointer flex flex-col justify-between space-y-2 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-200 group-hover:text-blue-300 transition-colors">
                      Found USB in Library
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#131b2c] text-slate-400">
                      10 min
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    A branded USB drive is left at a public terminal. Choose appropriate response protocol.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[#131b29] text-[10px] font-mono text-slate-400">
                  <span className="text-emerald-400">Beginner</span>
                  <span className="flex items-center gap-1 text-blue-400 group-hover:translate-x-0.5 transition-transform">
                    <Terminal className="w-3 h-3" />
                    <span>Launch Drill</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

