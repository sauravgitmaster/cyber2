import React from 'react';
import { ActivePage, UserProfile, LearningPath, MentorInsight } from '../types';
import { TrustScoreGauge } from '../components/common/TrustScoreGauge';
import { ByteMascot } from '../components/common/ByteMascot';
import {
  ArrowRight,
  Flame,
  Zap,
  Trophy,
  Target,
  Sparkles,
  Clock,
  ShieldCheck,
  ChevronRight,
  Lightbulb,
  CheckCircle2,
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
  // Main path
  const activePath = paths.find((p) => p.id === 'cyber-safety-fundamentals') || paths[0];
  const allModules = paths.flatMap((p) => p.modules);
  const completedCount = allModules.filter((m) => m.isCompleted).length;
  const totalCount = allModules.length || 8;

  // Active module
  const currentModule = activePath?.modules.find((m) => !m.isCompleted) || activePath?.modules[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 text-[#243047] font-sans">
      {/* 1. WHERE AM I? - Friendly Welcoming Header */}
      <div className="bg-gradient-to-r from-blue-500 via-[#5E87FF] to-[#8B6CFF] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute bottom-0 right-28 -mb-6 w-32 h-32 rounded-full bg-yellow-300/15 blur-lg pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold text-white">
              <span>🌟</span>
              <span>Adventure Level {user.level || 1} • {user.levelTitle || 'Cyber Detective'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              👋 Hey, {user.name}!
            </h1>
            <p className="text-sm sm:text-base text-blue-100 max-w-xl font-medium">
              Ready for your next cyber quest? You've completed{' '}
              <span className="font-bold text-yellow-300 underline underline-offset-2">
                Mission {completedCount} of {totalCount}
              </span>
              . Keep going to earn your Cyber Hero badge!
            </p>

            {/* Visual adventure progress bar */}
            <div className="pt-2 max-w-md space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-blue-100">
                <span>Adventure Progress</span>
                <span>{Math.round((completedCount / totalCount) * 100)}% Complete</span>
              </div>
              <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden p-0.5 border border-white/20">
                <div
                  className="h-full bg-gradient-to-r from-yellow-300 to-emerald-300 rounded-full transition-all duration-700"
                  style={{ width: `${Math.max(8, (completedCount / totalCount) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Byte Mascot Reaction on Banner */}
          <div className="hidden sm:flex flex-col items-center justify-center p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 shrink-0 text-center">
            <ByteMascot mood="excited" size="lg" />
            <span className="text-xs font-extrabold text-white mt-1">Byte is cheering for you!</span>
          </div>
        </div>
      </div>

      {/* 2. WHAT SHOULD I DO NEXT? - HERO "TODAY'S MISSION" CARD */}
      <div className="bg-white rounded-3xl border-2 border-blue-200/80 p-6 sm:p-7 shadow-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5 flex-1">
            {/* Big Mission Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl sm:text-4xl text-white shadow-md shrink-0">
              🎣
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-black uppercase tracking-wider">
                  TODAY’S MISSION
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-600 font-bold">
                  <Clock className="w-3.5 h-3.5 text-slate-600" />
                  <span>5 min</span>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#243047]">
                Spot the Fake Login
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                Can you tell which message is trying to trick you into giving away your password? Inspect the clue markers and make the smart choice.
              </p>
            </div>
          </div>

          {/* Strong Primary CTA Button */}
          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center gap-2">
            <button
              onClick={() =>
                onNavigate('interactive-scenario', { scenarioId: 'scenario-univ-phish' })
              }
              className="px-6 py-3.5 rounded-2xl bg-[#4F7CFF] hover:bg-[#3D6CE6] text-white font-black text-sm transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <Target className="w-4 h-4" />
              <span>START MISSION</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="text-[11px] text-center text-slate-600 font-bold">
              Earn +30 XP & +8 ⭐
            </span>
          </div>
        </div>
      </div>

      {/* 3. WHAT DID I ACHIEVE? - SECONDARY ACHIEVEMENT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Cyber Smart Score */}
        <div
          onClick={() => onNavigate('progress-analytics')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
              Smart Score
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#4F7CFF] flex items-center justify-center group-hover:scale-110 transition-transform">
              🛡️
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-[#243047]">
              {user.digitalTrustScore}
            </span>
            <span className="text-amber-500 font-bold text-lg">⭐</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1 font-medium line-clamp-1">
            {user.digitalTrustScore >= 70 ? 'Doing Great!' : 'Keep practicing!'}
          </p>
        </div>

        {/* Card 2: Learning Streak */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
              Streak
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Flame className="w-5 h-5 fill-amber-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-[#243047]">
              {user.streakDays}
            </span>
            <span className="text-xs font-bold text-slate-600">days</span>
          </div>
          <p className="text-[11px] text-amber-600 mt-1 font-bold">
            {user.streakDays > 0 ? 'Fire streak active!' : 'Start your streak today!'}
          </p>
        </div>

        {/* Card 3: Badges Collected */}
        <div
          onClick={() => onNavigate('badges')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-purple-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
              Badges
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#8B6CFF] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-[#243047]">
              {user.completedModulesCount >= 2 ? '3' : '1'}
            </span>
            <span className="text-xs font-bold text-slate-600">collected</span>
          </div>
          <p className="text-[11px] text-purple-600 mt-1 font-bold">
            Next unlock in 1 quest!
          </p>
        </div>

        {/* Card 4: Total XP */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
              Experience
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#40C98A] flex items-center justify-center">
              <Zap className="w-5 h-5 fill-[#40C98A]" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-[#243047]">
              {user.currentXP}
            </span>
            <span className="text-xs font-bold text-slate-600">XP</span>
          </div>
          <p className="text-[11px] text-emerald-600 mt-1 font-bold">
            {user.nextLevelXP - user.currentXP > 0
              ? `${user.nextLevelXP - user.currentXP} XP to Level ${user.level + 1}`
              : 'Max Level!'}
          </p>
        </div>
      </div>

      {/* 4. BYTE’S TIP - Illustrated Companion Callout */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 rounded-3xl border border-blue-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <ByteMascot mood="thinking" size="md" />
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#4F7CFF] uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>BYTE’S TIP OF THE DAY</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              "{mentorInsight?.observation || 'Scammers often pretend there is an urgent emergency. Remember: whenever a message creates panic, take a deep breath and check the official app directly!'}"
            </p>
          </div>
        </div>

        <button
          onClick={onOpenMentor}
          className="shrink-0 px-4 py-2 rounded-xl bg-white hover:bg-blue-50 border border-blue-200 text-xs font-bold text-[#4F7CFF] shadow-2xs hover:shadow-xs transition-all flex items-center gap-1.5 self-end sm:self-center"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Ask Byte more</span>
        </button>
      </div>

      {/* 5. MISSIONS FOR YOU - 2 to 4 Friendly Scenario Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold text-[#4F7CFF] uppercase tracking-wider block">
              MORE ADVENTURES
            </span>
            <h3 className="text-lg sm:text-xl font-black text-[#243047]">
              Missions For You
            </h3>
          </div>
          <button
            onClick={() => onNavigate('interactive-scenario')}
            className="text-xs font-bold text-[#4F7CFF] hover:text-[#3D6CE6] flex items-center gap-1"
          >
            <span>View All Missions</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Mission 1 */}
          <div
            onClick={() =>
              onNavigate('interactive-scenario', { scenarioId: 'scenario-univ-phish' })
            }
            className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🚨</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                  4 min
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#243047] group-hover:text-[#4F7CFF] transition-colors">
                The Urgent School Alert
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                An email says your account will be suspended today unless you verify immediately. What do you do?
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
              <span className="text-emerald-600">Beginner Friendly</span>
              <span className="text-[#4F7CFF] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                <span>Start Mission</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Mission 2 */}
          <div
            onClick={() =>
              onNavigate('interactive-scenario', { scenarioId: 'scenario-campus-usb' })
            }
            className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl">💾</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-bold">
                  5 min
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#243047] group-hover:text-[#4F7CFF] transition-colors">
                Mystery USB Drive
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                You find a cool flash drive sitting in the library labeled "Confidential". Should you plug it in to see who owns it?
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
              <span className="text-purple-600">+40 XP</span>
              <span className="text-[#4F7CFF] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                <span>Start Mission</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Mission 3 */}
          <div
            onClick={() =>
              onNavigate('interactive-scenario', { scenarioId: 'scenario-mfa-fatigue' })
            }
            className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl">📱</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold">
                  6 min
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#243047] group-hover:text-[#4F7CFF] transition-colors">
                Late Night Phone Buzz
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                Your phone keeps vibrating with login requests at 2 AM. How do you stop the trickster without letting them in?
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
              <span className="text-amber-600">+50 XP</span>
              <span className="text-[#4F7CFF] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                <span>Start Mission</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
