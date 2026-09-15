import React, { useState } from 'react';
import { ActivePage, BadgeItem, LearningPath, UserProfile } from '../types';
import { TrustScoreGauge } from '../components/common/TrustScoreGauge';
import {
  User,
  Building,
  GraduationCap,
  Award,
  Download,
  CheckCircle2,
  Calendar,
  Sparkles,
  Zap,
} from 'lucide-react';
import { ByteMascot } from '../components/common/ByteMascot';

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

  const unlockedBadges = badges.filter((b) => b.unlocked);
  const completedPaths = paths.filter((p) => p.progress >= 100);

  const handleExportReport = () => {
    setShowExportToast(true);
    setTimeout(() => setShowExportToast(false), 3000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto text-[#243047] font-sans">
      {/* Toast Notification */}
      {showExportToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-white border-2 border-emerald-400 text-[#243047] text-xs font-bold shadow-2xl flex items-center gap-3 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span>Cyber Hero Certificate & Transcript downloaded (.PDF)!</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs font-black text-[#4F7CFF] uppercase tracking-wider">
            <User className="w-4 h-4" />
            <span>STUDENT PASSPORT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#243047]">
            My Cyber Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Your personal credentials, earned badges, and cybersecurity accomplishments.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportReport}
            className="px-4 py-2.5 rounded-2xl bg-[#4F7CFF] hover:bg-[#3D6CE6] text-white font-black text-xs transition-colors flex items-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download Cyber Report</span>
          </button>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Avatar and Info */}
          <div className="flex items-start gap-4">
            <div className="w-18 h-18 rounded-3xl overflow-hidden border-2 border-blue-200 bg-blue-50 flex items-center justify-center shrink-0 shadow-xs">
              <ByteMascot mood="excited" size="md" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-[#243047]">{user.name}</h2>
                <span className="px-3 py-0.5 rounded-full bg-blue-100 text-[#4F7CFF] text-xs font-black">
                  CYBER EXPLORER
                </span>
              </div>
              <p className="text-xs font-bold text-slate-600 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#4F7CFF]" />
                <span>Level 0{user.level} — {user.levelTitle}</span>
                <span className="text-slate-300">•</span>
                <span>Student ID: {user.studentId}</span>
              </p>
              <p className="text-xs font-medium text-slate-500 flex items-center gap-2">
                <Building className="w-4 h-4 text-slate-400" />
                <span>{user.institution}</span>
              </p>
            </div>
          </div>

          {/* Trust Score Mini Gauge */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex items-center gap-5 self-start md:self-auto">
            <div className="space-y-0.5">
              <span className="text-[11px] font-black uppercase text-slate-500 block">
                CYBER SMART SCORE
              </span>
              <div className="text-xl font-black text-[#243047]">
                {user.digitalTrustScore} / 100 ⭐
              </div>
              <span className="text-xs font-black text-emerald-600">
                High Resilience
              </span>
            </div>
            <TrustScoreGauge score={user.digitalTrustScore} delta={user.trustScoreDelta} size="sm" showLabel={false} />
          </div>
        </div>

        {/* Record Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-black text-slate-500 uppercase">Student ID</span>
            <div className="text-xs font-bold text-[#243047]">{user.studentId}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-black text-slate-500 uppercase">Email</span>
            <div className="text-xs font-medium text-slate-600 truncate">{user.email}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-black text-slate-500 uppercase">Current Rank</span>
            <div className="text-xs font-black text-[#8B6CFF]">Level 0{user.level}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-black text-slate-500 uppercase">Member Since</span>
            <div className="text-xs font-medium text-slate-600">{user.joinedDate}</div>
          </div>
        </div>
      </div>

      {/* Completed Adventures & Earned Badges Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Curriculums */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-[#243047]">Completed Adventures</h3>
            <span className="text-xs font-bold text-[#4F7CFF]">{completedPaths.length} Completed</span>
          </div>

          <div className="space-y-3">
            {completedPaths.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-xs text-[#243047]">{p.title}</div>
                  <div className="text-xs text-emerald-800 font-medium">{p.category}</div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-black">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>100%</span>
                </div>
              </div>
            ))}
            {completedPaths.length === 0 && (
              <div className="text-xs text-slate-500 py-3 text-center">
                Keep going! Complete your first adventure to display it here.
              </div>
            )}
          </div>
        </div>

        {/* Badges Earned */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-[#243047]">Recent Badges</h3>
            <button
              onClick={() => onNavigate('achievements')}
              className="text-xs font-black text-[#4F7CFF] hover:underline"
            >
              View Trophy Room ({unlockedBadges.length}) →
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {unlockedBadges.slice(0, 4).map((b) => (
              <div
                key={b.id}
                className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Award className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-[#243047] truncate">{b.title}</div>
                  <div className="text-[11px] font-black text-purple-700">+{b.xpValue} XP</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
