import React, { useState } from 'react';
import { ActivePage, BadgeItem, LearningPath, UserProfile } from '../types';
import { TrustScoreGauge } from '../components/common/TrustScoreGauge';
import {
  User,
  Shield,
  Building,
  GraduationCap,
  Award,
  Download,
  Share2,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Lock,
} from 'lucide-react';

interface ProfilePageProps {
  user: UserProfile;
  badges: BadgeItem[];
  paths: LearningPath[];
  onNavigate: (page: ActivePage) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  badges,
  paths,
  onNavigate,
}) => {
  const [showExportToast, setShowExportToast] = useState(false);

  const unlockedBadges = badges.filter(b => b.unlocked);
  const completedPaths = paths.filter(p => p.progress >= 100);

  const handleExportReport = () => {
    setShowExportToast(true);
    setTimeout(() => setShowExportToast(false), 3000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto text-slate-100 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {showExportToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-blue-950 border border-blue-600 text-white text-xs font-mono shadow-2xl flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Academic Verification Transcript downloaded (.PDF)</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <User className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">
              STUDENT RECORD
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Student Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Institutional credentials, verified competencies, and cyber hygiene transcript.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportReport}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors flex items-center gap-2 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Transcript</span>
          </button>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0e172a] border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Avatar and Info */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-blue-500/40 bg-blue-600/20 shrink-0">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl font-bold font-mono text-blue-400">
                  {user.name ? user.name.charAt(0) : 'S'}
                </div>
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{user.name}</h2>
                <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300 font-mono text-[10px]">
                  VERIFIED STUDENT
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                <span>{user.levelTitle || 'Cyber Explorer'}</span>
                <span className="text-slate-400">•</span>
                <span>ID: {user.studentId}</span>
              </p>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>{user.institution}</span>
              </p>
            </div>
          </div>

          {/* Trust Score Mini Gauge */}
          <div className="p-4 rounded-xl bg-[#0a0f1d] border border-slate-800 flex items-center gap-5 self-start md:self-auto">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">
                TRUST BENCHMARK
              </span>
              <div className="text-lg font-bold font-mono text-white">
                {user.digitalTrustScore} / 100
              </div>
              <span className="text-[11px] font-mono text-cyan-400">
                Tier: High Resilience
              </span>
            </div>
            <TrustScoreGauge score={user.digitalTrustScore} delta={user.trustScoreDelta} size="sm" showLabel={false} />
          </div>
        </div>

        {/* Institutional Record Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-[#0a0f1d] border border-slate-800/80 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Student ID</span>
            <div className="text-xs font-mono font-semibold text-white">{user.studentId}</div>
          </div>
          <div className="p-3 rounded-xl bg-[#0a0f1d] border border-slate-800/80 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Email</span>
            <div className="text-xs font-mono text-slate-300 truncate">{user.email}</div>
          </div>
          <div className="p-3 rounded-xl bg-[#0a0f1d] border border-slate-800/80 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Current Level</span>
            <div className="text-xs font-mono font-semibold text-blue-400">Level 0{user.level}</div>
          </div>
          <div className="p-3 rounded-xl bg-[#0a0f1d] border border-slate-800/80 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Enrolled</span>
            <div className="text-xs font-mono text-slate-300">{user.joinedDate}</div>
          </div>
        </div>
      </div>

      {/* Completed Curriculums & Earned Badges Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Curriculums */}
        <div className="p-6 rounded-2xl bg-[#0e172a] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Completed Pathways</h3>
            <span className="text-xs font-mono text-blue-400">{completedPaths.length} Completed</span>
          </div>

          <div className="space-y-3">
            {completedPaths.map(p => (
              <div
                key={p.id}
                className="p-3.5 rounded-xl bg-[#0a0f1d] border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-xs text-white">{p.title}</div>
                  <div className="text-[11px] font-mono text-slate-400">{p.category}</div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-blue-400 font-mono">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>100%</span>
                </div>
              </div>
            ))}
            {completedPaths.length === 0 && (
              <div className="text-xs text-slate-400 italic py-2">
                No pathways completed yet. Keep learning!
              </div>
            )}
          </div>
        </div>

        {/* Badges Earned */}
        <div className="p-6 rounded-2xl bg-[#0e172a] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Earned Badges</h3>
            <button
              onClick={() => onNavigate('achievements')}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              View All ({unlockedBadges.length}) →
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {unlockedBadges.slice(0, 4).map(b => (
              <div
                key={b.id}
                className="p-3 rounded-xl bg-[#0a0f1d] border border-slate-800 flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-semibold text-white truncate">{b.title}</div>
                  <div className="text-[10px] font-mono text-slate-400">+{b.xpValue} XP</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
