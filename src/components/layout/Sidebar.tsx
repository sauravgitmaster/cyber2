import React from 'react';
import { ActivePage, UserProfile } from '../../types';
import {
  Home,
  BookOpen,
  Target,
  Users,
  Trophy,
  User,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { ByteMascot } from '../common/ByteMascot';

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
  onOpenMentor,
}) => {
  const current = activePage || currentPage || 'dashboard';

  // The 6 clean consumer-learning nav items
  const mainNav = [
    { id: 'dashboard' as ActivePage, label: 'Home', icon: Home, color: 'text-[#4F7CFF]' },
    { id: 'learning-paths' as ActivePage, label: 'Learn', icon: BookOpen, color: 'text-[#40C98A]' },
    { id: 'interactive-scenario' as ActivePage, label: 'Missions', icon: Target, color: 'text-[#FF6B6B]' },
    { id: 'multiplayer' as ActivePage, label: 'Play', icon: Users, color: 'text-[#8B6CFF]' },
    { id: 'badges' as ActivePage, label: 'Rewards', icon: Trophy, color: 'text-[#FFC857]' },
    { id: 'profile' as ActivePage, label: 'Profile', icon: User, color: 'text-[#36B37E]' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen shrink-0 sticky top-0 select-none text-[#243047] z-20 shadow-xs hidden lg:flex">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-3 text-left group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#4F7CFF] to-[#8B6CFF] flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <ByteMascot size="xs" animate={false} />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-[#243047] block">
              CyberMentor
            </span>
            <span className="text-[11px] font-bold text-[#4F7CFF] block -mt-0.5">
              Adventure Academy
            </span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('landing')}
          title="Overview & Info"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* Main Nav Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive =
            current === item.id ||
            (item.id === 'learning-paths' && current === 'module-detail') ||
            (item.id === 'interactive-scenario' && current === 'ai-feedback');

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl font-bold text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-blue-50 text-[#4F7CFF] shadow-xs translate-x-1'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    isActive ? 'bg-blue-500 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4 text-[#4F7CFF]" />}
            </button>
          );
        })}
      </div>

      {/* Byte Buddy Mascot Callout in Footer */}
      <div className="p-4 border-t border-slate-100 bg-gradient-to-b from-white to-blue-50/50">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100/80 space-y-2.5">
          <div className="flex items-center gap-2.5">
            <ByteMascot mood="waving" size="sm" />
            <div>
              <span className="text-xs font-bold text-[#243047] block">
                Meet Byte!
              </span>
              <span className="text-[11px] text-slate-500 block">
                Your cyber safety buddy
              </span>
            </div>
          </div>
          <button
            onClick={onOpenMentor}
            className="w-full py-2 px-3 rounded-xl bg-white hover:bg-blue-50 border border-blue-200 text-xs font-bold text-[#4F7CFF] shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            <span>Ask Byte a question</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
