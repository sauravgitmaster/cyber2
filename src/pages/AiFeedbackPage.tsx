import React from 'react';
import { ActivePage, ScenarioItem, ScenarioOption } from '../types';
import { sampleScenarios } from '../data/mockData';
import {
  BrainCircuit,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  LayoutDashboard,
  CheckCircle2,
  XCircle,
  FileSearch,
  ExternalLink,
  Flame,
  MessageSquare,
  Crosshair,
} from 'lucide-react';

interface AiFeedbackPageProps {
  decisionData: {
    scenario: ScenarioItem;
    option: ScenarioOption;
    previousScore: number;
    newScore: number;
  } | null;
  onNavigate: (page: ActivePage, params?: { scenarioId?: string }) => void;
  onOpenMentor: () => void;
}

export const AiFeedbackPage: React.FC<AiFeedbackPageProps> = ({
  decisionData,
  onNavigate,
  onOpenMentor,
}) => {
  const scenario = decisionData?.scenario || sampleScenarios[0];
  const option = decisionData?.option || scenario.options[2];
  const previousScore = decisionData?.previousScore ?? 0;
  const newScore = decisionData?.newScore ?? (option.isOptimal ? 8 : 0);

  const { feedback, scoreImpacts } = option;
  const isOptimal = option.isOptimal;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 max-w-5xl mx-auto text-slate-200">
      {/* Debrief Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#182133] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
            <Crosshair className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">POST-INCIDENT DEBRIEF // FORENSIC ANALYSIS</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
            Scenario Incident Debrief
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Target Scenario: {scenario.title} ({scenario.category})
          </p>
        </div>

        {/* Outcome Badge & Delta */}
        <div className="flex items-center gap-2.5 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-[4px] bg-[#090d16] border border-[#1b2538] flex items-center gap-2">
            <span className="text-slate-400">TRUST DELTA:</span>
            <span className="text-white font-bold">{previousScore}</span>
            <span>→</span>
            <span className={`font-bold ${isOptimal ? 'text-emerald-400' : 'text-rose-400'}`}>
              {newScore} ({newScore >= previousScore ? `+${newScore - previousScore}` : newScore - previousScore})
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-[4px] bg-[#090d16] border border-[#1b2538] flex items-center gap-1.5 text-amber-400 font-bold">
            +{scoreImpacts.xpDelta} XP
          </div>
        </div>
      </div>

      {/* Main Analysis Container */}
      <div className="p-5 sm:p-6 rounded-[4px] bg-[#0c121e] border border-[#1b2538] space-y-5">
        {/* Your Action & Evaluation Bar */}
        <div className="p-3.5 rounded-[4px] bg-[#080d17] border border-[#182338] space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 uppercase text-[10px] tracking-wider">YOUR COMMITTED ACTION</span>
            <span
              className={`px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase ${
                isOptimal
                  ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                  : feedback.decisionQuality === 'Fair'
                  ? 'bg-amber-950/70 text-amber-300 border border-amber-800/60'
                  : 'bg-rose-950/70 text-rose-300 border border-rose-800/60'
              }`}
            >
              Evaluation: {feedback.decisionQuality} Decision
            </span>
          </div>

          <div className="text-white font-sans text-sm font-semibold">
            Option {option.label}: "{option.text}"
          </div>
        </div>

        {/* AI Mentor Operational Assessment */}
        <div className="p-4 rounded-[4px] bg-[#081121] border border-blue-900/40 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-mono text-blue-400">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span className="font-semibold uppercase">AI MENTOR OPERATIONAL CRITIQUE</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
            "{feedback.summary}"
          </p>
        </div>

        {/* Real-World Incident Case Study Comparison */}
        <div className="p-4 rounded-[4px] bg-[#080d17] border border-[#1c283d] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-amber-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <FileSearch className="w-3.5 h-3.5" />
              REAL-WORLD INCIDENT PARALLEL // 2022 TWILIO OKTAPUS CAMPAIGN
            </span>
            <span className="text-slate-500 text-[10px]">MITRE ATT&CK T1566.002</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            This scenario mirrors the "Oktapus" phishing kit deployed against over 130 organizations. Attackers sent SMS/email notifications claiming IT Okta sessions were expired with domains like <code>univ-sso-auth.org</code>. Victims who navigated out-of-band to their true bookmarks neutralized the campaign completely.
          </p>
        </div>

        {/* 4-Vector Technical Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
          <div className="p-3.5 rounded-[4px] bg-[#080d17] border border-[#162136] space-y-1.5">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block">
              Why This Decision Matters
            </span>
            <p className="text-slate-300 leading-relaxed font-sans text-[11px]">
              {feedback.whyItMatters}
            </p>
          </div>

          <div className="p-3.5 rounded-[4px] bg-[#080d17] border border-[#162136] space-y-1.5">
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
              Strengths of Your Triage
            </span>
            <p className="text-slate-300 leading-relaxed font-sans text-[11px]">
              {feedback.whatYouDidWell}
            </p>
          </div>

          <div className="p-3.5 rounded-[4px] bg-[#080d17] border border-[#162136] space-y-1.5">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
              Latent Vulnerabilities & Traps
            </span>
            <p className="text-slate-300 leading-relaxed font-sans text-[11px]">
              {feedback.watchOutFor}
            </p>
          </div>

          <div className="p-3.5 rounded-[4px] bg-[#080d17] border border-[#162136] space-y-1.5">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
              Recommended Next Action
            </span>
            <p className="text-slate-300 leading-relaxed font-sans text-[11px]">
              {feedback.nextStepRecommendation}
            </p>
          </div>
        </div>

        {/* Debrief Action Row */}
        <div className="pt-4 border-t border-[#182133] flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-3.5 py-2 rounded-[4px] border border-[#1b2538] text-slate-300 hover:bg-[#121927] transition-colors flex items-center gap-1.5"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Return to Dashboard</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenMentor}
              className="px-3.5 py-2 rounded-[4px] bg-[#111929] hover:bg-[#162238] border border-[#1f2d47] text-blue-300 transition-colors flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
              <span>Discuss with Mentor</span>
            </button>
            <button
              onClick={() => onNavigate('interactive-scenario')}
              className="px-4 py-2 rounded-[4px] bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors flex items-center gap-1.5"
            >
              <span>Next Scenario</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

