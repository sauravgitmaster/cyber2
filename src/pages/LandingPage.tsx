import React from 'react';
import { ActivePage, LearningPath } from '../types';
import { HeroProductPreview } from '../components/landing/HeroProductPreview';
import {
  ArrowRight,
  Lock,
  Eye,
  Terminal,
  Compass,
  FileCheck,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Globe,
  Flame,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: ActivePage, params?: { pathId?: string }) => void;
  paths: LearningPath[];
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, paths }) => {
  return (
    <div className="min-h-screen bg-[#070b13] text-slate-200 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Quiet Navigation */}
      <header className="border-b border-[#182133] bg-[#090d16] sticky top-0 z-40 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-[2px] bg-blue-500" />
          <span className="font-mono text-xs font-bold tracking-widest text-white uppercase">
            CYBERMENTOR
          </span>
          <span className="text-[10px] font-mono text-slate-400 pl-1 hidden sm:inline">
            // DEFENSIVE WORKSTATION
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs text-slate-300 font-mono">
          <a href="#threat-matrix" className="hover:text-white transition-colors">
            THREAT FOCUS
          </a>
          <a href="#frameworks" className="hover:text-white transition-colors">
            FRAMEWORKS
          </a>
          <a href="#curriculum" className="hover:text-white transition-colors">
            CURRICULUM
          </a>
          <a href="#trust-score" className="hover:text-white transition-colors">
            TRUST SCORE
          </a>
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-[4px] border border-[#202c42] hover:border-slate-500 transition-colors"
          >
            Open Workstation
          </button>
          <button
            onClick={() => onNavigate('skill-check')}
            className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium px-3.5 py-1.5 rounded-[4px] transition-colors flex items-center gap-1.5"
          >
            <span>Skill Diagnostic</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="pt-12 sm:pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[4px] bg-[#0f1726] border border-[#1e2a42] text-[11px] text-blue-300 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            PRACTICAL DEFENSIVE CYBER EDUCATION
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Practical cybersecurity education for everyday digital safety.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Traditional cyber training relies on passive multiple-choice tests. CyberMentor puts students in interactive incident scenarios with automated feedback and measurable Trust Score metrics.
            </p>
          </div>

          {/* Primary Action Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1 font-mono text-xs">
            <button
              onClick={() => onNavigate('skill-check')}
              className="px-5 py-2.5 rounded-[4px] bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors flex items-center gap-2"
            >
              <span>Initial Diagnostic Test</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('learning-paths')}
              className="px-5 py-2.5 rounded-[4px] bg-[#101726] hover:bg-[#162035] border border-[#202c44] text-slate-200 font-medium transition-colors flex items-center gap-2"
            >
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              <span>Explore Syllabus</span>
            </button>
          </div>

          {/* Interactive Simulation Workstation Preview */}
          <div className="pt-6 pb-2 max-w-5xl mx-auto">
            <HeroProductPreview
              onStartSkillCheck={() => onNavigate('skill-check')}
              onExplorePaths={() => onNavigate('learning-paths')}
            />
          </div>
        </section>

        {/* SECTION: Threat Focus Matrix */}
        <section id="threat-matrix" className="py-16 border-t border-[#182133] bg-[#090e18]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-left border-b border-[#182235] pb-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block">
                  DEFENSIVE CORE
                </span>
                <h2 className="text-xl font-semibold text-white mt-0.5">
                  Real Threats Faced by Students & Professionals
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">
                4 Specialized Curriculum Tracks
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Threat 1 */}
              <div className="p-4 rounded-[4px] bg-[#0c121e] border border-[#1b2538] flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="w-7 h-7 rounded-[4px] bg-[#111a2d] border border-[#1f2d47] flex items-center justify-center text-blue-400">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">Phishing & Pretexts</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Lookalike domain analysis, spear-phishing pretexts, urgent wire/account threats, and DKIM/SPF header verification.
                  </p>
                </div>
                <div className="text-[10px] font-mono text-slate-400 pt-2 border-t border-[#141c2c]">
                  Track: Social Engineering
                </div>
              </div>

              {/* Threat 2 */}
              <div className="p-4 rounded-[4px] bg-[#0c121e] border border-[#1b2538] flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="w-7 h-7 rounded-[4px] bg-[#111a2d] border border-[#1f2d47] flex items-center justify-center text-blue-400">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">Password & MFA Hygiene</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    High-entropy passphrases, credential reuse cascades, multi-factor fatigue/bombing, and secure hardware authenticators.
                  </p>
                </div>
                <div className="text-[10px] font-mono text-slate-400 pt-2 border-t border-[#141c2c]">
                  Track: Identity & Access
                </div>
              </div>

              {/* Threat 3 */}
              <div className="p-4 rounded-[4px] bg-[#0c121e] border border-[#1b2538] flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="w-7 h-7 rounded-[4px] bg-[#111a2d] border border-[#1f2d47] flex items-center justify-center text-blue-400">
                    <Eye className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">Privacy & OSINT Leaks</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Metadata stripping from shared documents, open-source intelligence gathering, and social survey question harvesting.
                  </p>
                </div>
                <div className="text-[10px] font-mono text-slate-400 pt-2 border-t border-[#141c2c]">
                  Track: Information Privacy
                </div>
              </div>

              {/* Threat 4 */}
              <div className="p-4 rounded-[4px] bg-[#0c121e] border border-[#1b2538] flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="w-7 h-7 rounded-[4px] bg-[#111a2d] border border-[#1f2d47] flex items-center justify-center text-blue-400">
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">Safe Browsing & Rogue Files</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Malvertising drive-bys, malicious browser extensions, USB drop hazards, and suspicious executable payloads.
                  </p>
                </div>
                <div className="text-[10px] font-mono text-slate-400 pt-2 border-t border-[#141c2c]">
                  Track: Endpoint Hygiene
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: Framework Alignment */}
        <section id="frameworks" className="py-14 border-t border-[#182133] bg-[#070b13]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-5 rounded-lg bg-[#0c121e] border border-[#1b2538] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block">
                  STANDARDS & FRAMEWORKS
                </span>
                <h3 className="text-base font-semibold text-white">
                  Curriculum Mapped to Industry Security Frameworks
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                  Every scenario and assessment is strictly structured against recognized cybersecurity workforce and defense standards.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono shrink-0">
                <div className="px-3 py-1.5 rounded bg-[#090e18] border border-[#192336] flex items-center gap-1.5 text-slate-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>NIST SP 800-181</span>
                </div>
                <div className="px-3 py-1.5 rounded bg-[#090e18] border border-[#192336] flex items-center gap-1.5 text-slate-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>CISA Cyber Hygiene</span>
                </div>
                <div className="px-3 py-1.5 rounded bg-[#090e18] border border-[#192336] flex items-center gap-1.5 text-slate-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>OWASP Top 10</span>
                </div>
                <div className="px-3 py-1.5 rounded bg-[#090e18] border border-[#192336] flex items-center gap-1.5 text-slate-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>MITRE ATT&CK</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: Featured Learning Paths */}
        <section id="curriculum" className="py-16 border-t border-[#182133] bg-[#090e18]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#182235] pb-4">
              <div>
                <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block">
                  SYLLABUS
                </span>
                <h2 className="text-xl font-semibold text-white mt-0.5">
                  Available Learning Paths
                </h2>
              </div>
              <button
                onClick={() => onNavigate('learning-paths')}
                className="text-xs font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <span>View Full Curriculum</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paths.slice(0, 6).map(path => (
                <div
                  key={path.id}
                  onClick={() => onNavigate('learning-paths', { pathId: path.id })}
                  className="p-4 rounded-[4px] bg-[#0c121e] border border-[#1a2336] hover:border-blue-500/60 cursor-pointer transition-colors flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="px-1.5 py-0.2 rounded bg-[#121a2c] text-blue-300">
                        {path.category}
                      </span>
                      <span className="text-slate-400">
                        {path.difficulty}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                      {path.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {path.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#141d2f] flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>{path.moduleCount} Modules • {path.estimatedTime}</span>
                    <span className="text-blue-400 group-hover:translate-x-0.5 transition-transform">
                      Inspect →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: Trust Score Callout */}
        <section id="trust-score" className="py-16 border-t border-[#182133] bg-[#070b13]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block">
              OBJECTIVE PROGRESSION
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              The Digital Trust Score
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Every learner starts at a baseline of 0. Your score dynamically updates as you complete modules, navigate realistic scenarios, and demonstrate resilience under adversarial conditions.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 font-mono text-xs">
              <button
                onClick={() => onNavigate('skill-check')}
                className="px-5 py-2.5 rounded-[4px] bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors flex items-center gap-2"
              >
                <span>Establish Baseline Score</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-5 py-2.5 rounded-[4px] bg-[#101726] hover:bg-[#162035] border border-[#202c44] text-slate-200 transition-colors"
              >
                Return to Workstation
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-[#182133] bg-[#090d16] py-6 px-6 text-xs text-slate-400 font-mono">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2 h-2 rounded-[2px] bg-blue-500" />
            <span className="font-semibold text-white">CyberMentor</span>
            <span>— Cybersecurity Learning Workstation</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Clean Baseline</span>
            <span>•</span>
            <span>Zero-Trust Learning</span>
            <span>•</span>
            <button onClick={() => onNavigate('auth')} className="hover:text-white">
              Student Auth
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

