import React from 'react';
import { ActivePage, UserProfile } from '../../types';
import { Bot, Flame, Shield, Menu } from 'lucide-react';

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

  const getBreadcrumb = () => {
    switch (current) {
      case 'dashboard':
        return { section: 'OVERVIEW', title: 'Dashboard' };
      case 'learning-paths':
        return { section: 'LEARN', title: 'Learning Paths' };
      case 'module-detail':
        return { section: 'LEARN', title: 'Module Workspace' };
      case 'interactive-scenario':
        return { section: 'PRACTICE', title: 'Scenario Simulation' };
      case 'ai-feedback':
        return { section: 'PRACTICE', title: 'Decision Analysis' };
      case 'skill-check':
        return { section: 'ASSESSMENT', title: 'Skill Assessment' };
      case 'progress-analytics':
        return { section: 'PROGRESS', title: 'My Progress' };
      case 'badges':
        return { section: 'PROGRESS', title: 'Achievements' };
      case 'leaderboard':
        return { section: 'PROGRESS', title: 'Leaderboard' };
      case 'profile':
        return { section: 'ACCOUNT', title: 'Student Profile' };
      case 'settings':
        return { section: 'ACCOUNT', title: 'Settings' };
      case 'landing':
        return { section: 'PUBLIC', title: 'Overview' };
      default:
        return { section: 'WORKSPACE', title: 'CyberMentor' };
    }
  };

  const { section, title } = getBreadcrumb();

  return (
    <header className="h-12 bg-[#090d16] border-b border-[#1a2233] px-4 md:px-5 flex items-center justify-between sticky top-0 z-30 select-none text-slate-200">
      {/* Left: Mobile Toggle & Minimal Breadcrumb */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => onToggleMobileNav?.()}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#131b2c] md:hidden transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className="text-slate-400">{section}</span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-200 font-medium">{title}</span>
        </div>
      </div>

      {/* Right Utility Bar */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Trust Score Indicator */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-1.5 px-2 py-1 rounded-[4px] bg-[#101624] border border-[#1e273b] hover:border-slate-700 transition-colors"
          title="Digital Trust Score"
        >
          <Shield className="w-3 h-3 text-blue-400" />
          <span className="font-mono text-[11px] text-slate-400">TRUST</span>
          <span className="font-mono text-xs font-semibold text-white">
            {safeUser.digitalTrustScore}
          </span>
          {safeUser.trustScoreDelta > 0 && (
            <span className="font-mono text-[10px] text-blue-400 hidden sm:inline">
              +{safeUser.trustScoreDelta}
            </span>
          )}
        </button>

        {/* Streak */}
        {safeUser.streakDays > 0 && (
          <div
            className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-[4px] bg-[#121622] border border-[#1e273b] font-mono text-[11px] text-amber-300"
            title="Active learning streak"
          >
            <Flame className="w-3 h-3 text-amber-400" />
            <span>{safeUser.streakDays}d</span>
          </div>
        )}

        {/* Level */}
        <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded-[4px] bg-[#101624] border border-[#1e273b] font-mono text-[11px] text-slate-300">
          <span className="text-slate-400">LV</span>
          <span className="font-semibold text-slate-200">{safeUser.level}</span>
        </div>

        {/* Quiet Mentor Trigger */}
        <button
          onClick={() => onOpenMentor?.()}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-[#141d30] hover:bg-[#1a253d] border border-[#23324f] text-blue-300 text-xs font-medium transition-colors"
        >
          <Bot className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Mentor</span>
        </button>

        {/* Profile Avatar Button */}
        <button
          onClick={() => onNavigate('profile')}
          className="w-7 h-7 rounded-full overflow-hidden border border-[#232d42] hover:border-slate-500 transition-colors focus:outline-none"
        >
          <img src={safeUser.avatar} alt={safeUser.name} className="w-full h-full object-cover" />
        </button>
      </div>
    </header>
  );
};

