import React from 'react';
import { ActivePage, BadgeItem, CertificateItem, UserProfile } from '../types';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ExternalLink,
  Compass,
  EyeOff,
  Flame,
  Scale,
  KeyRound,
  Crosshair,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

interface AchievementsPageProps {
  user: UserProfile;
  badges: BadgeItem[];
  certificates: CertificateItem[];
  onOpenCertificate: (cert: CertificateItem) => void;
  onNavigate: (page: ActivePage) => void;
}

export const AchievementsPage: React.FC<AchievementsPageProps> = ({
  user,
  badges,
  certificates,
  onOpenCertificate,
  onNavigate,
}) => {
  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass':
        return <Compass className="w-5 h-5" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5" />;
      case 'EyeOff':
        return <EyeOff className="w-5 h-5" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'Scale':
        return <Scale className="w-5 h-5" />;
      case 'Flame':
        return <Flame className="w-5 h-5" />;
      case 'KeyRound':
        return <KeyRound className="w-5 h-5" />;
      case 'Crosshair':
        return <Crosshair className="w-5 h-5" />;
      default:
        return <Award className="w-5 h-5" />;
    }
  };

  const xpProgressPercent = Math.round((user.currentXP / user.nextLevelXP) * 100);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto text-slate-100 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">
              ACADEMIC RECOGNITION
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Badges & Credentials
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Verifiable badges and academic certificates certifying demonstrated competency.
          </p>
        </div>

        {/* Level Banner */}
        <div className="px-4 py-2.5 rounded-xl bg-blue-950/60 border border-blue-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600/30 flex items-center justify-center text-blue-400 font-bold font-mono text-sm">
            0{user.level}
          </div>
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wide">
              {user.levelTitle}
            </div>
            <div className="text-[11px] font-mono text-blue-300">
              {user.currentXP} / {user.nextLevelXP} XP
            </div>
          </div>
        </div>
      </div>

      {/* Level XP Progress Card */}
      <div className="p-6 rounded-2xl bg-[#0e172a] border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-300 gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">
              STUDENT RANK
            </span>
            <span className="text-base font-bold text-white">
              LEVEL 0{user.level} — {user.levelTitle}
            </span>
          </div>
          <span className="font-mono text-blue-400">
            XP: {user.currentXP.toLocaleString()} / {user.nextLevelXP.toLocaleString()} ({xpProgressPercent}%)
          </span>
        </div>

        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${xpProgressPercent}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] font-mono text-slate-400">
          <span>{user.nextLevelXP - user.currentXP} XP until Level 08 (Cyber Guardian)</span>
          <span>Earn XP through scenario decisions (+50 XP each)</span>
        </div>
      </div>

      {/* Academic Certificates Section */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-mono text-blue-400 uppercase tracking-wider block mb-1">
            VERIFIED CREDENTIALS
          </span>
          <h2 className="text-xl font-bold text-white">Academic Certificates</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Formal course completion certificates backed by scenario examination logs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {certificates.map(cert => (
            <div
              key={cert.id}
              className="p-5 rounded-2xl bg-[#0e172a] border border-slate-700 hover:border-blue-700/80 transition-all flex flex-col justify-between space-y-4 shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-950/70 border border-blue-800 text-blue-300 text-[10px] font-mono">
                    <ShieldCheck className="w-3 h-3 text-blue-400" />
                    ACADEMIC VERIFIED
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {cert.credentialId}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{cert.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Awarded by {cert.institution} • Issued {cert.issuedDate}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cert.skillsVerified.map((sk, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400 text-[11px]">
                  Trust Score: {cert.trustScoreAtIssue}/100
                </span>
                <button
                  onClick={() => onOpenCertificate(cert)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Certificate</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-mono text-blue-400 uppercase tracking-wider block mb-1">
            BADGE REPOSITORY
          </span>
          <h2 className="text-xl font-bold text-white">Competency Badges</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Earned through continuous defensive accuracy and ethical conduct.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map(b => {
            const isUnlocked = b.unlocked;

            return (
              <div
                key={b.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                  isUnlocked
                    ? 'bg-[#0e172a] border-slate-800 hover:border-slate-700 shadow-md'
                    : 'bg-[#0a0f1d] border-slate-900 opacity-55'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isUnlocked
                        ? 'bg-blue-950 border border-blue-800 text-blue-400'
                        : 'bg-slate-900 border border-slate-800 text-slate-400'
                    }`}
                  >
                    {isUnlocked ? getBadgeIcon(b.iconName) : <Lock className="w-4 h-4" />}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    +{b.xpValue} XP
                  </span>
                </div>

                <div>
                  <h4 className={`text-sm font-semibold ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                    {b.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-snug">
                    {b.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 text-[10px] font-mono flex items-center justify-between">
                  <span className="text-slate-400">{b.category}</span>
                  {isUnlocked ? (
                    <span className="text-blue-400">Unlocked</span>
                  ) : (
                    <span className="text-slate-400">Locked</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
