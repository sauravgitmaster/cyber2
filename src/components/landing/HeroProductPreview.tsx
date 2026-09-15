import React, { useState } from 'react';
import { TrustScoreGauge } from '../common/TrustScoreGauge';
import { ShieldCheck, Bot, ArrowRight, Mail, AlertTriangle, Check, Terminal, ExternalLink, ShieldAlert } from 'lucide-react';

interface HeroProductPreviewProps {
  onStartSkillCheck: () => void;
  onExplorePaths: () => void;
}

export const HeroProductPreview: React.FC<HeroProductPreviewProps> = ({
  onStartSkillCheck,
  onExplorePaths,
}) => {
  const [selectedChoice, setSelectedChoice] = useState<'link' | 'inspect' | 'direct' | null>(null);

  return (
    <div className="w-full rounded-lg border border-[#1e293b] bg-[#0c121e] overflow-hidden text-slate-200 text-left">
      {/* Workstation Header Bar */}
      <div className="px-4 py-2.5 bg-[#090d16] border-b border-[#1a2233] flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1e293b]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#1e293b]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#1e293b]" />
          </div>
          <span className="text-slate-400 text-[11px] ml-1">
            SIMULATION // SCENARIO-01: PHISHING INSPECTION
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-blue-400 bg-blue-950/60 border border-blue-800/60 px-2 py-0.5 rounded-[3px] font-mono">
            LIVE INTERACTIVE DEMO
          </span>
        </div>
      </div>

      {/* Main Workstation Layout */}
      <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Simulated Mail & Decision Console (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="p-3.5 rounded-[4px] bg-[#080d17] border border-[#1a2337] space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#141d2f] pb-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300 font-mono text-[11px]">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-semibold text-white">INBOX SIMULATOR</span>
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950/40 border border-amber-800/40 px-1.5 py-0.2 rounded">
                FLAGGED ADVERSARIAL
              </span>
            </div>

            {/* Email Header Inspector */}
            <div className="text-[11px] font-mono bg-[#05080f] p-2.5 rounded border border-[#121927] space-y-1 text-slate-400">
              <div><span className="text-slate-400">Subject:</span> <span className="text-slate-200 font-medium">[URGENT] Campus Single Sign-On Access Terminating</span></div>
              <div><span className="text-slate-400">Sender:</span> <span className="text-amber-300">Identity Desk &lt;support@univ-auth-sso.net&gt;</span></div>
              <div><span className="text-slate-400">Authentication:</span> <span className="text-rose-400">DKIM: Fail • SPF: SoftFail</span></div>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed font-sans pt-1">
              "Your student account credentials have failed the quarterly directory migration. Failure to re-verify your multi-factor identity within 2 hours will result in course portal lockout."
            </div>

            {/* Interactive Decision Options */}
            <div className="space-y-1.5 pt-2 border-t border-[#141d2f]">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Select Your Response:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => setSelectedChoice('link')}
                  className={`p-2 rounded-[4px] text-xs text-left border transition-colors ${
                    selectedChoice === 'link'
                      ? 'bg-rose-950/40 border-rose-600 text-rose-200'
                      : 'bg-[#0b101c] border-[#1a2336] text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="font-medium text-[11px]">A. Click Urgent Link</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Follow provided URL</div>
                </button>

                <button
                  onClick={() => setSelectedChoice('inspect')}
                  className={`p-2 rounded-[4px] text-xs text-left border transition-colors ${
                    selectedChoice === 'inspect'
                      ? 'bg-blue-950/40 border-blue-500 text-blue-200'
                      : 'bg-[#0b101c] border-[#1a2336] text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="font-medium text-[11px]">B. Inspect Headers</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Check root domain</div>
                </button>

                <button
                  onClick={() => setSelectedChoice('direct')}
                  className={`p-2 rounded-[4px] text-xs text-left border transition-colors ${
                    selectedChoice === 'direct'
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                      : 'bg-[#0b101c] border-[#1a2336] text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="font-medium text-[11px]">C. Direct Portal</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Navigate via bookmark</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Real-Time Evaluator & Trust Score Feedback (5 cols) */}
        <div className="lg:col-span-5 space-y-3 flex flex-col justify-between">
          <div className="p-3.5 rounded-[4px] bg-[#080d17] border border-[#1a2337] space-y-3">
            <div className="flex items-center justify-between border-b border-[#141d2f] pb-2 text-xs">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                DECISION FEEDBACK
              </span>
              <span className="text-[10px] font-mono text-blue-400">AUTOMATED ANALYSIS</span>
            </div>

            {selectedChoice === null ? (
              <div className="py-4 text-center text-xs text-slate-400 font-mono space-y-1">
                <Terminal className="w-5 h-5 mx-auto text-slate-400" />
                <p>Select an action above to trigger real-time AI security analysis.</p>
              </div>
            ) : selectedChoice === 'link' ? (
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-rose-400 font-medium font-mono text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>COMPROMISE DETECTED (-15 Trust Score)</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  The domain <code className="text-rose-300 font-mono bg-rose-950/50 px-1 py-0.5 rounded">univ-auth-sso.net</code> is an adversarial lookalike registered 3 days ago. Following the link submits your session token to an attacker proxy.
                </p>
              </div>
            ) : selectedChoice === 'inspect' ? (
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-blue-400 font-medium font-mono text-[11px]">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>ATTACK IDENTIFIED (+8 Trust Score)</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Header examination revealed SPF SoftFail and a fraudulent registrar. You successfully verified the sender before taking action.
                </p>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium font-mono text-[11px]">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>OPTIMAL PROTOCOL (+12 Trust Score)</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Bypassing the message and navigating directly to your verified bookmark neutralizes deceptive links completely.
                </p>
              </div>
            )}
          </div>

          {/* Metric Preview */}
          <div className="p-3.5 rounded-[4px] bg-[#080d17] border border-[#1a2337] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                DIGITAL TRUST SCORE
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-lg font-bold font-mono text-white">
                  {selectedChoice === 'link' ? '65' : selectedChoice === 'inspect' ? '88' : selectedChoice === 'direct' ? '92' : '80'}
                </span>
                <span className="text-xs font-mono text-slate-400">/ 100</span>
                {selectedChoice && (
                  <span className={`text-xs font-mono font-medium ${selectedChoice === 'link' ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {selectedChoice === 'link' ? '-15' : selectedChoice === 'inspect' ? '+8' : '+12'}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">STATUS</span>
              <span className="text-xs font-mono text-slate-200">
                {selectedChoice === 'link' ? 'Vulnerable' : 'Defended'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Workstation Footer */}
      <div className="px-4 py-2.5 bg-[#090d16] border-t border-[#1a2233] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>Aligned with NIST SP 800-181 & CISA Cyber Hygiene Principles</span>
        </div>
        <button
          onClick={onStartSkillCheck}
          className="text-blue-400 hover:text-blue-300 text-xs font-sans font-medium flex items-center gap-1"
        >
          <span>Take Full Diagnostic Assessment</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

