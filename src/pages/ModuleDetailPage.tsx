import React, { useState } from 'react';
import { ActivePage, LearningPath, ModuleItem } from '../types';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  FileText,
  PlayCircle,
  BrainCircuit,
  RotateCcw,
  AlertTriangle,
  ShieldCheck,
  ChevronRight,
  Terminal,
  Copy,
  Check,
  MessageSquare,
  ShieldAlert,
  Info,
} from 'lucide-react';

interface ModuleDetailPageProps {
  paths: LearningPath[];
  selectedPathId: string;
  selectedModuleId: string;
  onNavigate: (page: ActivePage, params?: { pathId?: string; moduleId?: string; scenarioId?: string }) => void;
  onUpdateModuleProgress: (pathId: string, moduleId: string, delta: number) => void;
}

export const ModuleDetailPage: React.FC<ModuleDetailPageProps> = ({
  paths,
  selectedPathId,
  selectedModuleId,
  onNavigate,
  onUpdateModuleProgress,
}) => {
  const currentPath = paths.find(p => p.id === selectedPathId) || paths[0];
  const currentModule =
    currentPath?.modules.find(m => m.id === selectedModuleId) ||
    currentPath?.modules[2] ||
    currentPath?.modules[0];

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  const sections = [
    { id: 0, title: 'Attack Vectors & Anatomy', icon: BookOpen, type: 'concept' },
    { id: 1, title: 'Domain Analysis & Typosquatting', icon: FileText, type: 'example' },
    { id: 2, title: 'Decision Matrix & Triage', icon: ShieldCheck, type: 'protocol' },
    { id: 3, title: 'Core Defense Checklist', icon: RotateCcw, type: 'recap' },
  ];

  const handleNextSection = () => {
    if (activeSectionIndex < sections.length - 1) {
      setActiveSectionIndex(prev => prev + 1);
      if (currentModule) {
        onUpdateModuleProgress(currentPath.id, currentModule.id, 15);
      }
    } else {
      if (currentModule) {
        onUpdateModuleProgress(currentPath.id, currentModule.id, 25);
      }
      onNavigate('interactive-scenario', { scenarioId: 'scenario-univ-phish' });
    }
  };

  const copySnippet = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1800);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 max-w-7xl mx-auto text-slate-200">
      {/* Top Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#182133] pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <button
            onClick={() => onNavigate('learning-paths', { pathId: currentPath.id })}
            className="hover:text-white flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{currentPath.title}</span>
          </button>
          <span>/</span>
          <span className="text-slate-200">Module {currentModule?.moduleNumber || 3}: {currentModule?.title}</span>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-slate-400">
          <span>PROGRESS: {Math.round(((activeSectionIndex + 1) / sections.length) * 100)}%</span>
          <div className="w-20 h-1.5 bg-[#141c2c] rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${Math.round(((activeSectionIndex + 1) / sections.length) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3-Zone Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT ZONE: Table of Contents / Progress Checklist (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="p-3.5 rounded-[4px] bg-[#0c121e] border border-[#1b2538] space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-[#162032] pb-2">
              <span className="uppercase tracking-wider">TABLE OF CONTENTS</span>
              <span>{activeSectionIndex + 1} of {sections.length}</span>
            </div>

            <nav className="space-y-1">
              {sections.map((sec, idx) => {
                const Icon = sec.icon;
                const isCurrent = activeSectionIndex === idx;
                const isDone = activeSectionIndex > idx;

                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSectionIndex(idx)}
                    className={`w-full text-left px-2.5 py-2 rounded-[3px] text-xs font-mono flex items-center justify-between transition-colors ${
                      isCurrent
                        ? 'bg-[#141f33] border border-blue-500/60 text-white font-medium'
                        : isDone
                        ? 'text-slate-300 hover:bg-[#101726]'
                        : 'text-slate-400 hover:text-slate-300 hover:bg-[#101726]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-blue-400' : 'text-slate-400'}`} />
                      <span className="truncate">{sec.title}</span>
                    </div>
                    {isDone && <Check className="w-3 h-3 text-emerald-400 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </nav>

            <div className="pt-2 border-t border-[#162032]">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                LEARNING OBJECTIVES
              </span>
              <ul className="space-y-1.5 text-[11px] text-slate-300">
                {(currentModule?.objectives || [
                  'Analyze message origin headers',
                  'Identify domain spoofing markers',
                  'Execute defensive triage protocols',
                ]).map((obj, i) => (
                  <li key={i} className="flex items-start gap-1.5 leading-snug">
                    <span className="text-blue-400 font-mono text-[10px] mt-0.5">•</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* CENTER ZONE: Reading Content (6 cols, max-w-[680px]) */}
        <div className="lg:col-span-6 space-y-5">
          <div className="p-5 sm:p-6 rounded-[4px] bg-[#0c121e] border border-[#1b2538] space-y-5">
            {/* Section 0: Attacks & Anatomy */}
            {activeSectionIndex === 0 && (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block">
                    CONCEPT 01 // SOCIAL ENGINEERING
                  </span>
                  <h2 className="text-xl font-bold text-white mt-0.5">
                    Anatomy of Deceptive Pretexting
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  Phishing remains the initial access vector in over 80% of university network compromises. Rather than attacking hard firewall boundaries, adversaries manipulate cognitive urgency, authority deference, and fear of lost access.
                </p>

                {/* Structured Threat Breakdown Callout */}
                <div className="rounded-[4px] border border-[#232f48] bg-[#090e18] overflow-hidden text-xs">
                  <div className="px-3.5 py-2 bg-[#101726] border-b border-[#1b273d] flex items-center gap-2 text-slate-300 font-mono text-[11px]">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-semibold text-white">THREAT BREAKDOWN: URGENT SSO EXPIRATION</span>
                  </div>
                  <div className="p-3.5 space-y-2 font-mono text-[11px]">
                    <div>
                      <span className="text-slate-400 uppercase text-[10px] block">Attack Vector:</span>
                      <span className="text-slate-200">Adversary-in-the-Middle (AiTM) proxy using lookalike domain credentials harvesting.</span>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase text-[10px] block">Business Impact:</span>
                      <span className="text-slate-200">Session cookie theft bypassing standard SMS/Push MFA tokens; lateral access to student SIS records.</span>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase text-[10px] block">Defensive Countermeasure:</span>
                      <span className="text-emerald-400">Domain inspection prior to credential input; hardware FIDO2 keys resistant to proxy relay.</span>
                    </div>
                  </div>
                </div>

                {/* Terminal / Code Inspection Block */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Terminal className="w-3 h-3 text-blue-400" />
                      RAW EMAIL HEADER SNIPPET
                    </span>
                    <button
                      onClick={() => copySnippet('Received: from mail-attacker.net (unknown [198.51.100.24])\nDKIM-Signature: v=1; d=attacker.net; s=default;\nAuthentication-Results: spf=softfail (mail.univ.edu: domain of it-desk@univ.edu does not designate 198.51.100.24)')}
                      className="hover:text-white flex items-center gap-1 text-[10px]"
                    >
                      {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-3 rounded-[4px] bg-[#060a12] border border-[#172133] text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed">
                    <code>
{`Received: from mail-relay-ext.net (unknown [198.51.100.24])
From: "Campus Security Desk" <admin@univ-sso-auth.org>
Authentication-Results: spf=softfail (univ.edu: 198.51.100.24 unapproved)
DKIM-Signature: v=1; d=univ-sso-auth.org; s=2024; (spoofed domain)`}
                    </code>
                  </pre>
                </div>

                {/* Inline Knowledge Check */}
                <div className="p-3.5 rounded-[4px] bg-[#090e18] border border-[#1c283d] space-y-2.5">
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block">
                    QUICK CHECK // VERIFY COMPREHENSION
                  </span>
                  <p className="text-xs text-slate-200">
                    Why does the sender display name "Campus Security Desk" fail as an indicator of trust?
                  </p>
                  <div className="space-y-1.5 text-xs">
                    {[
                      { id: 0, text: 'The display name string is user-configurable and unauthenticated in SMTP protocols.', correct: true },
                      { id: 1, text: 'Campus security never issues emails to university students.', correct: false },
                      { id: 2, text: 'All security emails require PGP encryption signatures to display names.', correct: false },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setQuizAnswer(opt.id)}
                        className={`w-full text-left p-2 rounded-[3px] text-[11px] border transition-colors ${
                          quizAnswer === opt.id
                            ? opt.correct
                              ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                              : 'bg-rose-950/40 border-rose-500 text-rose-200'
                            : 'bg-[#0c121e] border-[#182338] text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        {opt.text}
                      </button>
                    ))}
                  </div>
                  {quizAnswer !== null && (
                    <div className="text-[11px] font-mono text-slate-400 pt-1">
                      {quizAnswer === 0 ? (
                        <span className="text-emerald-400">Correct: SMTP envelop From header is verified; display names can be typed arbitrarily by any sender.</span>
                      ) : (
                        <span className="text-rose-400">Incorrect: Review RFC 5322 display name handling.</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Section 1: Domain Analysis */}
            {activeSectionIndex === 1 && (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block">
                    CONCEPT 02 // TECHNICAL DECONSTRUCTION
                  </span>
                  <h2 className="text-xl font-bold text-white mt-0.5">
                    Typosquatting & Subdomain Masking
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  Attackers capitalize on visual parsing habits. Because human readers scan left-to-right, placing trusted institutions at the left of a URL creates fraudulent credibility.
                </p>

                <div className="p-3.5 rounded-[4px] bg-[#070b13] border border-[#162136] space-y-2.5 font-mono text-xs">
                  <div className="p-2.5 rounded bg-[#091526] border border-blue-900/60 text-blue-300">
                    <span className="text-slate-400 block text-[10px] uppercase">LEGITIMATE CAMPUS PORTAL:</span>
                    https://login.university.edu/auth/cas/
                  </div>
                  <div className="p-2.5 rounded bg-rose-950/30 border border-rose-900/60 text-rose-300">
                    <span className="text-slate-400 block text-[10px] uppercase">ADVERSARY DOMAIN:</span>
                    https://university.edu.login-portal-auth.com/cas/
                  </div>
                </div>

                <div className="p-3 rounded-[4px] bg-[#090e18] border border-amber-900/50 text-xs text-slate-300 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed text-[11px]">
                    <strong>Parsing Rule:</strong> To find the actual controlling domain, scan from left until the first unescaped single slash <code>/</code>. Move left to find the top-level domain (.com, .org, .edu) and its immediate prefix. Here, that is <code>login-portal-auth.com</code>.
                  </p>
                </div>
              </div>
            )}

            {/* Section 2: Decision Matrix */}
            {activeSectionIndex === 2 && (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block">
                    CONCEPT 03 // DEFENSIVE WORKFLOW
                  </span>
                  <h2 className="text-xl font-bold text-white mt-0.5">
                    Incident Triage Protocol
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  When confronted with an unexpected notification threatening account suspension or requiring credentials, adhere strictly to the out-of-band verification protocol.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono">
                  <div className="p-3 rounded-[4px] bg-[#080d17] border border-rose-900/40 space-y-1">
                    <span className="text-rose-400 font-semibold block text-[11px]">Direct Link Interaction</span>
                    <span className="text-slate-400 text-[10px] block leading-normal">Carries full payload risk; executes token harvesting scripts.</span>
                  </div>
                  <div className="p-3 rounded-[4px] bg-[#080d17] border border-emerald-900/40 space-y-1">
                    <span className="text-emerald-400 font-semibold block text-[11px]">Out-of-Band Portal Login</span>
                    <span className="text-slate-400 text-[10px] block leading-normal">Bypasses attacker domain entirely; navigates via verified bookmark.</span>
                  </div>
                </div>
              </div>
            )}

            {/* Section 3: Core Checklist */}
            {activeSectionIndex === 3 && (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block">
                    CONCEPT 04 // RECAP
                  </span>
                  <h2 className="text-xl font-bold text-white mt-0.5">
                    Pre-Flight Verification Checklist
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  Keep these four rules ingrained before opening any high-urgency message:
                </p>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded-[4px] bg-[#080d17] border border-[#162136] flex items-center gap-3">
                    <span className="text-blue-400 font-bold">01</span>
                    <span className="text-slate-300">Is the urgency timeline shorter than 24 hours? If yes, treat as suspect.</span>
                  </div>
                  <div className="p-2.5 rounded-[4px] bg-[#080d17] border border-[#162136] flex items-center gap-3">
                    <span className="text-blue-400 font-bold">02</span>
                    <span className="text-slate-300">Does the root domain match the official registrar on whois records?</span>
                  </div>
                  <div className="p-2.5 rounded-[4px] bg-[#080d17] border border-[#162136] flex items-center gap-3">
                    <span className="text-blue-400 font-bold">03</span>
                    <span className="text-slate-300">Never click links inside notifications to re-authenticate single sign-on.</span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="pt-4 border-t border-[#182133] flex items-center justify-between font-mono text-xs">
              <button
                onClick={() => setActiveSectionIndex(prev => Math.max(0, prev - 1))}
                disabled={activeSectionIndex === 0}
                className="px-3.5 py-2 rounded-[4px] border border-[#1e2a42] text-slate-300 hover:bg-[#121927] disabled:opacity-30 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Section</span>
              </button>

              <button
                onClick={handleNextSection}
                className="px-4 py-2 rounded-[4px] bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors flex items-center gap-1.5"
              >
                <span>{activeSectionIndex === sections.length - 1 ? 'Launch Practical Scenario' : 'Next Section'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT ZONE: Quick Notes / Key Takeaways & Mentor Trigger (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="p-3.5 rounded-[4px] bg-[#0c121e] border border-[#1b2538] space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-[#162032] pb-2 text-[11px] font-mono text-slate-400">
              <span className="uppercase tracking-wider">DEFENSIVE TAKEAWAYS</span>
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            </div>

            <div className="space-y-2 text-[11px] text-slate-300 leading-relaxed font-sans">
              <div className="p-2.5 rounded bg-[#080d17] border border-[#141d2f]">
                <strong className="text-white block font-mono text-[10px] uppercase mb-0.5">Golden Rule</strong>
                "No legitimate security team asks you to re-enter MFA credentials over an email link."
              </div>

              <div className="p-2.5 rounded bg-[#080d17] border border-[#141d2f]">
                <strong className="text-white block font-mono text-[10px] uppercase mb-0.5">Scoring Impact</strong>
                Mastering this module prepares you for the live phishing investigation scenario (+8 Trust Score points).
              </div>
            </div>

            {/* Quick Ask Mentor Button */}
            <div className="pt-2 border-t border-[#162032]">
              <button
                onClick={() => onNavigate('interactive-scenario', { scenarioId: 'scenario-univ-phish' })}
                className="w-full py-2 px-2.5 rounded-[4px] bg-[#111929] hover:bg-[#162238] border border-[#1f2d47] text-blue-300 font-mono text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <PlayCircle className="w-3.5 h-3.5 text-blue-400" />
                <span>Simulate Threat Live</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

