import React from 'react';
import { ActivePage, UserProfile } from '../../types';
import { Flame, Menu, Shield, Zap, Sparkles, Trophy } from 'lucide-react';
import { ByteMascot } from '../common/ByteMascot';

interface NavbarProps {
  currentPage?: ActivePage;
  activePage?: ActivePage;
  onNavigate: (page: ActivePage) => void;
  user?: UserProfile;
  onOpenMentor?: () => void;
  onToggleMobileNav?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  activePage,
  onNavigate,
  user,
  onOpenMentor,
  onToggleMobileNav,
}) => {
  const current = activePage || currentPage || 'dashboard';
  const safeUser = user || {
    name: 'Saurav',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    level: 0,
    currentXP: 0,
    digitalTrustScore: 0,
    trustScoreDelta: 0,
    streakDays: 0,
  };

  const getPageTitle = () => {
    switch (current) {
      case 'dashboard':
        return { label: 'Adventure Home', icon: '🏠' };
      case 'learning-paths':
        return { label: 'Learning Adventures', icon: '🗺️' };
      case 'module-detail':
        return { label: 'Learning Zone', icon: '📖' };
      case 'interactive-scenario':
        return { label: 'Cyber Missions', icon: '🎯' };
      case 'ai-feedback':
        return { label: 'Mission Results', icon: '✨' };
      case 'skill-check':
        return { label: 'Quick Cyber Check', icon: '⚡' };
      case 'progress-analytics':
        return { label: 'Your Progress', icon: '📈' };
      case 'badges':
        return { label: 'Badges & Rewards', icon: '🏆' };
      case 'leaderboard':
        return { label: 'Weekly Challenge', icon: '🌟' };
      case 'profile':
        return { label: 'Your Cyber Profile', icon: '👤' };
      case 'settings':
        return { label: 'Settings', icon: '⚙️' };
      default:
        return { label: 'Cyber Adventure', icon: '🛡️' };
    }
  };

  const currentInfo = getPageTitle();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 select-none text-[#243047] shadow-xs">
      {/* Left: Mobile Toggle & Page Location */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggleMobileNav?.()}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Current Area Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl" role="img" aria-label="icon">
            {currentInfo.icon}
          </span>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-[#243047] leading-tight">
              {currentInfo.label}
            </h1>
            <p className="text-[11px] text-slate-600 hidden sm:block">
              Cyber adventure & safety skills
            </p>
          </div>
        </div>
      </div>

      {/* Right Utility Bar: Gamified stats & Byte Buddy */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Cyber Smart Score Pill */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors shadow-xs"
          title="Your Cyber Smart Score"
        >
          <Shield className="w-4 h-4 text-[#4F7CFF]" />
          <span className="text-xs font-bold text-[#243047]">
            {safeUser.digitalTrustScore}
          </span>
          <span className="text-xs text-amber-500 font-bold">⭐</span>
        </button>

        {/* Learning Streak Pill */}
        <div
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 shadow-xs"
          title={`${safeUser.streakDays} Day Learning Streak`}
        >
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="text-xs font-bold">{safeUser.streakDays}d</span>
        </div>

        {/* Total XP Pill */}
        <button
          onClick={() => onNavigate('badges')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-[#8B6CFF] hover:bg-purple-100 transition-colors shadow-xs"
          title={`${safeUser.currentXP} Total XP`}
        >
          <Zap className="w-4 h-4 text-[#8B6CFF] fill-[#8B6CFF]" />
          <span className="text-xs font-bold text-slate-800">{safeUser.currentXP} XP</span>
        </button>

        {/* Ask Byte Companion CTA Button */}
        <button
          onClick={onOpenMentor}
          className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-[#4F7CFF] to-[#8B6CFF] hover:from-[#3D6CE6] hover:to-[#7957E6] text-white font-bold text-xs shadow-sm hover:shadow transition-all duration-150 active:scale-95"
          title="Chat with Byte, your cyber buddy"
        >
          <ByteMascot size="xs" animate={false} />
          <span className="hidden sm:inline">Ask Byte</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </button>

        {/* User Avatar with Level Ring */}
        <button
          onClick={() => onNavigate('profile')}
          className="relative rounded-full p-0.5 border-2 border-[#4F7CFF] hover:scale-105 transition-transform"
          title={`View profile (${safeUser.name})`}
        >
          <img
            src={safeUser.avatar}
            alt={safeUser.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#8B6CFF] text-white text-[9px] font-black flex items-center justify-center border border-white">
            {safeUser.level}
          </span>
        </button>
      </div>
    </header>
  );
};
