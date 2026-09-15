import React from 'react';
import { ActivePage } from '../../types';
import {
  LayoutDashboard,
  Compass,
  Layers,
  Terminal,
  BarChart3,
  Award,
  User,
  X,
  Settings,
} from 'lucide-react';

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
}) => {
  const current = activePage || currentPage || 'dashboard';
  const navItems = [
    { id: 'dashboard' as ActivePage, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'learning-paths' as ActivePage, label: 'Learning Paths', icon: Compass },
    { id: 'module-detail' as ActivePage, label: 'Modules', icon: Layers },
    { id: 'interactive-scenario' as ActivePage, label: 'Scenarios', icon: Terminal },
    { id: 'progress-analytics' as ActivePage, label: 'My Progress', icon: BarChart3 },
    { id: 'badges' as ActivePage, label: 'Achievements', icon: Award },
    { id: 'profile' as ActivePage, label: 'Profile', icon: User },
    { id: 'settings' as ActivePage, label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
            onClick={onClose}
          />
          <div className="relative w-4/5 max-w-xs bg-[#090d16] border-r border-[#1a2233] flex flex-col h-full z-10 text-slate-200">
            <div className="p-4 border-b border-[#1a2233] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-[2px] bg-blue-500" />
                <span className="font-mono text-xs font-bold tracking-widest text-white uppercase">
                  CYBERMENTOR
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded text-slate-400 hover:text-white"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = current === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      onClose?.();
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[4px] text-xs transition-colors ${
                      isActive
                        ? 'bg-[#141c2c] text-white font-medium border-l-2 border-blue-500 pl-2.5'
                        : 'text-slate-300 hover:bg-[#111724]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Mobile Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090d16]/95 backdrop-blur-md border-t border-[#1a2233] px-2 py-1.5 flex items-center justify-around select-none">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded text-[10px] font-mono ${
            current === 'dashboard' ? 'text-blue-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => onNavigate('learning-paths')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded text-[10px] font-mono ${
            current === 'learning-paths' || current === 'module-detail'
              ? 'text-blue-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Learn</span>
        </button>

        <button
          onClick={() => onNavigate('interactive-scenario')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded text-[10px] font-mono ${
            current === 'interactive-scenario' || current === 'ai-feedback'
              ? 'text-blue-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Practice</span>
        </button>

        <button
          onClick={() => onNavigate('progress-analytics')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded text-[10px] font-mono ${
            current === 'progress-analytics' || current === 'badges'
              ? 'text-blue-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Progress</span>
        </button>
      </nav>
    </>
  );
};

