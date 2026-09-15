import React, { useState } from 'react';
import { ActivePage } from '../../types';
import {
  Home,
  BookOpen,
  Target,
  Users,
  Trophy,
  User,
  X,
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
  const current = activePage || currentPage || 'dashboard';

  const items = [
    { id: 'dashboard' as ActivePage, label: 'Home', icon: Home },
    { id: 'learning-paths' as ActivePage, label: 'Learn', icon: BookOpen },
    { id: 'interactive-scenario' as ActivePage, label: 'Missions', icon: Target },
    { id: 'multiplayer' as ActivePage, label: 'Play', icon: Users },
    { id: 'badges' as ActivePage, label: 'Rewards', icon: Trophy },
    { id: 'profile' as ActivePage, label: 'Profile', icon: User },
  ];

  const handleSelectPage = (pageId: ActivePage) => {
    onNavigate(pageId);
    onClose?.();
  };

  return (
    <>
      {/* 6-Item Clean Bottom Bar on Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-1 py-1 flex items-center justify-around lg:hidden shadow-lg select-none">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            current === item.id ||
            (item.id === 'learning-paths' && current === 'module-detail') ||
            (item.id === 'interactive-scenario' && current === 'ai-feedback');

          return (
            <button
              key={item.id}
              onClick={() => handleSelectPage(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl min-w-[50px] transition-all ${
                isActive
                  ? 'text-[#4F7CFF] font-black scale-105'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  isActive ? 'bg-blue-50 text-[#4F7CFF]' : ''
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Slide-out Drawer if triggered by menu toggle */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative w-4/5 max-w-xs bg-white flex flex-col h-full z-10 text-[#243047] shadow-2xl animate-in slide-in-from-left duration-200">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ByteMascot size="xs" animate={false} />
                <span className="font-extrabold text-sm text-[#243047]">
                  CyberMentor
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = current === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectPage(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-colors ${
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

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
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
