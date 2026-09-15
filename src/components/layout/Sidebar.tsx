import React from 'react';
import { ActivePage, UserProfile } from '../../types';
import {
  LayoutDashboard,
  Compass,
  Layers,
  Terminal,
  BarChart3,
  Award,
  User,
  Settings,
  Flame,
  Globe,
} from 'lucide-react';

interface SidebarProps {
  currentPage?: ActivePage;
  activePage?: ActivePage;
  onNavigate: (page: ActivePage) => void;
  user?: UserProfile;
  onOpenMentor?: () => void;
  unreadNotificationsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  activePage,
  onNavigate,
  user,
}) => {
  const current = activePage || currentPage || 'dashboard';
  const safeUser = user || {
    name: 'Saurav',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    level: 0,
    digitalTrustScore: 0,
    streakDays: 0,
  };

  const navSections = [
    {
      label: 'OVERVIEW',
      items: [
        { id: 'dashboard' as ActivePage, label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      label: 'LEARN',
      items: [
        { id: 'learning-paths' as ActivePage, label: 'Learning Paths', icon: Compass },
        { id: 'module-detail' as ActivePage, label: 'Modules', icon: Layers },
      ],
    },
    {
      label: 'PRACTICE',
      items: [
        { id: 'interactive-scenario' as ActivePage, label: 'Scenarios', icon: Terminal },
      ],
    },
    {
      label: 'PROGRESS',
      items: [
        { id: 'progress-analytics' as ActivePage, label: 'My Progress', icon: BarChart3 },
        { id: 'badges' as ActivePage, label: 'Achievements', icon: Award },
      ],
    },
  ];

  return (
    <aside className="w-56 bg-[#090d16] border-r border-[#1a2233] flex flex-col h-screen shrink-0 sticky top-0 select-none text-slate-300">
      {/* Brand Header */}
      <div className="px-4 py-4 border-b border-[#1a2233] flex items-center justify-between">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 text-left group"
        >
          <div className="w-2 h-2 rounded-[2px] bg-blue-500 group-hover:bg-blue-400 transition-colors" />
          <span className="font-mono text-xs font-bold tracking-widest text-slate-100 uppercase">
            CyberMentor
          </span>
        </button>

        <button
          onClick={() => onNavigate('landing')}
          title="View Public Overview"
          className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-[#121826] transition-colors"
        >
          <Globe className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {navSections.map(section => (
          <div key={section.label} className="space-y-0.5">
            <div className="px-2.5 pb-1 text-[10px] font-mono font-medium tracking-wider text-slate-400 uppercase">
              {section.label}
            </div>
            {section.items.map(item => {
              const Icon = item.icon;
              const isActive = current === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[4px] text-xs transition-colors text-left ${
                    isActive
                      ? 'bg-[#141c2c] text-white font-medium border-l-2 border-blue-500 pl-2'
                      : 'text-slate-300 hover:bg-[#111724] hover:text-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom Preferences & Profile */}
      <div className="p-2 border-t border-[#1a2233] bg-[#070b13] space-y-0.5">
        <button
          onClick={() => onNavigate('profile')}
          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[4px] text-xs transition-colors text-left ${
            current === 'profile'
              ? 'bg-[#141c2c] text-white font-medium border-l-2 border-blue-500 pl-2'
              : 'text-slate-300 hover:bg-[#111724] hover:text-slate-100'
          }`}
        >
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span>Profile</span>
        </button>

        <button
          onClick={() => onNavigate('settings')}
          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[4px] text-xs transition-colors text-left ${
            current === 'settings'
              ? 'bg-[#141c2c] text-white font-medium border-l-2 border-blue-500 pl-2'
              : 'text-slate-300 hover:bg-[#111724] hover:text-slate-100'
          }`}
        >
          <Settings className="w-3.5 h-3.5 text-slate-400" />
          <span>Settings</span>
        </button>

        {/* Compact User Row */}
        <div
          onClick={() => onNavigate('profile')}
          className="mt-1 pt-1.5 border-t border-[#161f30] px-2 py-1 flex items-center justify-between text-[11px] font-mono text-slate-400 cursor-pointer hover:text-slate-200"
        >
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="truncate font-sans font-medium text-slate-300">{safeUser.name}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] shrink-0 text-slate-400">
            <span>T:{safeUser.digitalTrustScore}</span>
            {safeUser.streakDays > 0 && (
              <span className="flex items-center gap-0.5 text-amber-400">
                <Flame className="w-2.5 h-2.5" />
                {safeUser.streakDays}
              </span>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

