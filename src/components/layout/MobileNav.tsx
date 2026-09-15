import React, { useState } from 'react';
import { ActivePage } from '../../types';
import {
  Home,
  Map,
  Target,
  Trophy,
  X,
  Zap,
  BarChart2,
  Settings,
  User,
  MoreHorizontal,
  ChevronRight,
} from 'lucide-react';
import { ByteMascot } from '../common/ByteMascot';

interface MobileNavProps {
  isOpen?: boolean;
  onClose?: () => void;
  currentPage?: ActivePage;
  activePage?: ActivePage;
  onNavigate: (page: ActivePage) => void;
  onOpenMentor?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen = false,
  onClose,
  currentPage,
  activePage,
  onNavigate,
  onOpenMentor,
}) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const current = activePage || currentPage || 'dashboard';

  const coreItems = [
    { id: 'dashboard' as ActivePage, label: 'Home', icon: Home, color: 'text-[#4F7CFF]' },
    { id: 'learning-paths' as ActivePage, label: 'Learn', icon: Map, color: 'text-[#40C98A]' },
    { id: 'interactive-scenario' as ActivePage, label: 'Missions', icon: Target, color: 'text-[#FF6B6B]' },
    { id: 'badges' as ActivePage, label: 'Rewards', icon: Trophy, color: 'text-[#FFC857]' },
  ];

  const secondaryItems = [
    { id: 'skill-check' as ActivePage, label: 'Quick Cyber Check', icon: Zap },
    { id: 'progress-analytics' as ActivePage, label: 'My Progress', icon: BarChart2 },
    { id: 'profile' as ActivePage, label: 'My Cyber Profile', icon: User },
    { id: 'settings' as ActivePage, label: 'Settings', icon: Settings },
  ];

  const handleSelectPage = (pageId: ActivePage) => {
    onNavigate(pageId);
    setIsMoreMenuOpen(false);
    onClose?.();
  };

  return (
    <>
      {/* 4-Item Primary Bottom Bar on Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1.5 flex items-center justify-around lg:hidden shadow-lg select-none">
        {coreItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            current === item.id ||
            (item.id === 'learning-paths' && current === 'module-detail') ||
            (item.id === 'interactive-scenario' && current === 'ai-feedback');

          return (
            <button
              key={item.id}
              onClick={() => handleSelectPage(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl min-w-[64px] min-h-[46px] transition-all ${
                isActive
                  ? 'text-[#4F7CFF] font-bold scale-105'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  isActive ? 'bg-blue-100 text-[#4F7CFF]' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] mt-0.5">{item.label}</span>
            </button>
          );
        })}

        {/* More button to open secondary sheet */}
        <button
          onClick={() => setIsMoreMenuOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl min-w-[64px] min-h-[46px] transition-all ${
            isMoreMenuOpen ? 'text-[#4F7CFF]' : 'text-slate-600'
          }`}
        >
          <div className="w-7 h-7 rounded-lg flex items-center justify-center">
            <MoreHorizontal className="w-5 h-5" />
          </div>
          <span className="text-[11px] mt-0.5">More</span>
        </button>
      </nav>

      {/* Secondary Drawer / Modal for Extra Destinations */}
      {(isOpen || isMoreMenuOpen) && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => {
              setIsMoreMenuOpen(false);
              onClose?.();
            }}
          />
          <div className="relative w-4/5 max-w-xs bg-white flex flex-col h-full z-10 text-[#243047] shadow-2xl animate-in slide-in-from-left duration-200">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ByteMascot size="xs" animate={false} />
                <span className="font-extrabold text-sm text-[#243047]">
                  Cyber Adventure Menu
                </span>
              </div>
              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  onClose?.();
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block px-2 mb-1">
                  Main Destinations
                </span>
                {coreItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = current === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectPage(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-[#4F7CFF]'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block px-2 mb-1">
                  Extra Tools
                </span>
                {secondaryItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = current === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectPage(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-[#4F7CFF] font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Ask Byte Button in Mobile Drawer */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    onClose?.();
                    onOpenMentor?.();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#8B6CFF] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <ByteMascot size="xs" animate={false} />
                  <span>Chat with Byte</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
