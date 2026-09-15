import React, { useState } from 'react';
import { ActivePage, LearningPath, CategoryGroup } from '../types';
import {
  Compass,
  Clock,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Filter,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';

interface LearningPathsPageProps {
  paths: LearningPath[];
  onNavigate: (page: ActivePage, params?: { pathId?: string; moduleId?: string }) => void;
  selectedPathId?: string;
}

export const LearningPathsPage: React.FC<LearningPathsPageProps> = ({
  paths,
  onNavigate,
  selectedPathId,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = [
    { id: 'ALL', label: 'All Curriculums' },
    { id: 'FOUNDATIONS', label: 'Foundations' },
    { id: 'THREAT AWARENESS', label: 'Threat Awareness' },
    { id: 'RESPONSIBLE CYBER BEHAVIOUR', label: 'Responsible Cyber Behaviour' },
  ];

  const filteredPaths = paths.filter(p => {
    if (activeCategory === 'ALL') return true;
    return p.category === activeCategory;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto text-slate-100 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">
              CURRICULUM CATALOGUE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Learning Paths
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Modular pathways engineered to teach defensive security, digital privacy hygiene, and ethical awareness step-by-step.
          </p>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-3 font-mono text-xs text-slate-300">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-blue-400 font-bold">{paths.length}</span> Pathways
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-cyan-400 font-bold">34</span> Micro-Modules
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {categories.map(cat => {
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Category Groups View */}
      {(['FOUNDATIONS', 'THREAT AWARENESS', 'RESPONSIBLE CYBER BEHAVIOUR'] as CategoryGroup[]).map(group => {
        const groupPaths = filteredPaths.filter(p => p.category === group);
        if (groupPaths.length === 0) return null;

        let groupDescription = '';
        if (group === 'FOUNDATIONS') {
          groupDescription = 'Core security principles, password entropy, and personal data isolation.';
        } else if (group === 'THREAT AWARENESS') {
          groupDescription = 'Deconstruction of deceptive messages, physical baiting, and financial fraud.';
        } else {
          groupDescription = 'Ethical boundaries, coordinated disclosure, and responsible AI usage.';
        }

        return (
          <div key={group} className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-950/70 border border-blue-800/60 text-blue-300 uppercase font-semibold">
                  {group}
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">— {groupDescription}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {groupPaths.map(path => {
                const isSelected = selectedPathId === path.id;
                const isStarted = path.progress > 0;

                return (
                  <div
                    key={path.id}
                    onClick={() => {
                      const firstModule = path.modules[0]?.id;
                      onNavigate('module-detail', { pathId: path.id, moduleId: firstModule });
                    }}
                    className={`p-5 rounded-2xl bg-[#0e172a] border transition-all cursor-pointer flex flex-col justify-between space-y-4 hover:border-blue-700/80 shadow-lg group ${
                      isSelected ? 'border-blue-500' : 'border-slate-800'
                    }`}
                  >
                    {/* Top Badges */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#0a0f1d] border border-slate-800 text-slate-300">
                          {path.difficulty}
                        </span>
                        <div className="flex items-center gap-1.5 font-mono text-slate-400 text-[11px]">
                          <Clock className="w-3 h-3 text-blue-400" />
                          <span>{path.estimatedTime}</span>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-base font-semibold text-white group-hover:text-blue-300 transition-colors">
                          {path.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                          {path.description}
                        </p>
                      </div>
                    </div>

                    {/* Progress Section */}
                    <div className="space-y-3 pt-2 border-t border-slate-800/80">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-mono text-[11px]">
                          {path.moduleCount} Modules
                        </span>
                        <span className="font-mono text-blue-300 font-medium text-[11px]">
                          {path.progress}% Completed
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${path.progress}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-[11px] text-slate-400">
                          {isStarted ? 'Resume learning' : 'Start curriculum'}
                        </span>
                        <span className="text-blue-400 font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          <span>View Modules</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
