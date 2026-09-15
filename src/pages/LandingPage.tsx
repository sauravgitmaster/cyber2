import React from 'react';
import { ActivePage, LearningPath } from '../types';
import { HeroProductPreview } from '../components/landing/HeroProductPreview';
import {
  ArrowRight,
  Lock,
  Eye,
  Compass,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Globe,
  Sparkles,
  Zap,
  CheckCircle2,
  Shield,
  Star,
} from 'lucide-react';
import { ByteMascot } from '../components/common/ByteMascot';

interface LandingPageProps {
  onNavigate: (page: ActivePage, params?: { pathId?: string }) => void;
  paths: LearningPath[];
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, paths }) => {
  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#243047] flex flex-col font-sans selection:bg-blue-200">
      {/* Friendly Top Navigation */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <ByteMascot mood="happy" size="xs" />
          <span className="text-lg font-black text-[#243047] tracking-tight group-hover:text-[#4F7CFF] transition-colors">
            CyberMentor <span className="text-[#4F7CFF]">AI</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600">
          <a href="#how-it-works" className="hover:text-[#4F7CFF] transition-colors">
            How It Works
          </a>
          <a href="#adventures" className="hover:text-[#4F7CFF] transition-colors">
            Adventures
          </a>
          <a href="#standards" className="hover:text-[#4F7CFF] transition-colors">
            For Schools & Parents
          </a>
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-xs font-bold text-slate-700 hover:text-[#4F7CFF] px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Enter App
          </button>
          <button
            onClick={() => onNavigate('skill-check')}
            className="text-xs bg-[#4F7CFF] hover:bg-[#3D6CE6] text-white font-black px-4 py-2 rounded-xl transition-all shadow-xs hover:shadow-md flex items-center gap-1.5"
          >
            <span>Start Free Check</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-12 sm:pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-black text-[#4F7CFF]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>INTERACTIVE CYBER DEFENSE FOR SCHOOL-AGE LEARNERS</span>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-5xl font-black text-[#243047] leading-tight tracking-tight">
              Cybersecurity made approachable, fun, and real.
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
              No boring lectures or scary jargon! Learn to spot scams, defeat phishing tricks, build unbreakable passwords, and protect your identity through interactive story missions with Byte.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('skill-check')}
              className="px-6 py-3.5 rounded-2xl bg-[#4F7CFF] hover:bg-[#3D6CE6] text-white font-black text-sm transition-all shadow-md hover:shadow-lg active:scale-98 flex items-center gap-2"
            >
              <span>Take Quick Cyber Check</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('learning-paths')}
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-700 font-black text-sm transition-all flex items-center gap-2 shadow-xs"
            >
              <Compass className="w-4 h-4 text-[#4F7CFF]" />
              <span>Browse Adventures</span>
            </button>
          </div>

          {/* Interactive Live Mini-Mission Preview */}
          <div className="pt-8 pb-4 max-w-5xl mx-auto">
            <HeroProductPreview
              onStartSkillCheck={() => onNavigate('skill-check')}
              onExplorePaths={() => onNavigate('learning-paths')}
            />
          </div>
        </section>

        {/* SECTION: 4 Core Adventures */}
        <section id="adventures" className="py-16 border-t border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-black text-[#4F7CFF] uppercase tracking-wider">
                CORE SKILLS
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#243047]">
                What You'll Learn to Defend
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Four essential skills to keep you, your family, and your school accounts safe online.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Adventure 1 */}
              <div className="p-6 rounded-3xl bg-blue-50/50 border-2 border-blue-100 hover:border-[#4F7CFF] transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-black text-[#243047]">Spot Scams & Phishing</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Learn to recognize fake login pages, tricky urgent texts, and lookalike web links before clicking.
                  </p>
                </div>
                <div className="text-xs font-bold text-[#4F7CFF] pt-2 border-t border-blue-100">
                  Track: Social Engineering
                </div>
              </div>

              {/* Adventure 2 */}
              <div className="p-6 rounded-3xl bg-purple-50/50 border-2 border-purple-100 hover:border-[#8B6CFF] transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-black text-[#243047]">Fortress Passwords & 2FA</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Craft memorable passphrases that supercomputers can't crack, and unlock two-step verification security.
                  </p>
                </div>
                <div className="text-xs font-bold text-[#8B6CFF] pt-2 border-t border-purple-100">
                  Track: Identity & Access
                </div>
              </div>

              {/* Adventure 3 */}
              <div className="p-6 rounded-3xl bg-emerald-50/50 border-2 border-emerald-100 hover:border-[#40C98A] transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Eye className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-black text-[#243047]">Privacy & Personal Data</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Guard your personal information, photos, and school accounts from online trackers and snoops.
                  </p>
                </div>
                <div className="text-xs font-bold text-[#40C98A] pt-2 border-t border-emerald-100">
                  Track: Information Privacy
                </div>
              </div>

              {/* Adventure 4 */}
              <div className="p-6 rounded-3xl bg-amber-50/50 border-2 border-amber-100 hover:border-[#FFC857] transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-black text-[#243047]">Safe Gaming & Downloads</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Avoid sneaky malware hiding in game mods, free robux tricks, and suspicious browser extensions.
                  </p>
                </div>
                <div className="text-xs font-bold text-amber-700 pt-2 border-t border-amber-100">
                  Track: Safe Browsing
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: Standards & Real Curriculum */}
        <section id="standards" className="py-14 border-t border-slate-200 bg-[#F7F9FC]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-xs font-black text-[#4F7CFF] uppercase tracking-wider block">
                  REAL CYBER EDUCATION
                </span>
                <h3 className="text-lg sm:text-xl font-black text-[#243047]">
                  Aligned with Real Cyber Defense Standards
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl font-medium">
                  While presented in a friendly, approachable format, all scenarios and skills are mapped directly to official frameworks like NIST, CISA Cyber Hygiene, and MITRE ATT&CK.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-bold shrink-0">
                <div className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#4F7CFF]" />
                  <span>NIST Aligned</span>
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#8B6CFF]" />
                  <span>CISA Hygiene</span>
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#40C98A]" />
                  <span>OWASP Concepts</span>
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <span>MITRE ATT&CK</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: CTA Callout */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-[#8B6CFF] text-white text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-5">
            <div className="flex justify-center">
              <ByteMascot mood="excited" size="lg" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Ready to begin your Cyber Adventure?
            </h2>
            <p className="text-xs sm:text-base text-blue-100 max-w-lg mx-auto font-medium">
              Join thousands of students learning to navigate the digital world safely, smartly, and confidently.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('skill-check')}
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-blue-50 text-[#4F7CFF] font-black text-sm transition-all shadow-md flex items-center gap-2"
              >
                <span>Start Free Cyber Check</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-6 py-3.5 rounded-2xl bg-blue-700/60 hover:bg-blue-700 text-white font-black text-sm border border-white/20 transition-colors"
              >
                Go to Student Dashboard
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Friendly Clean Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-6 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-bold text-slate-700">
            <ByteMascot mood="happy" size="xs" />
            <span>CyberMentor AI — Approchable Cybersecurity for Everyone</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span>Safe & Educational</span>
            <span>•</span>
            <span>Zero Intimidation</span>
            <span>•</span>
            <button onClick={() => onNavigate('auth')} className="text-[#4F7CFF] hover:underline font-bold">
              Student Sign In
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
