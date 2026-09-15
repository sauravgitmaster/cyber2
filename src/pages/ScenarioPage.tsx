import React, { useState, useEffect } from 'react';
import { ActivePage, ScenarioItem, ScenarioOption } from '../types';
import {
  PlayCircle,
  Mail,
  Smartphone,
  ShieldAlert,
  ArrowRight,
  Terminal,
  Search,
  Globe,
  Binary,
  Clock,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  FileCode,
  Eye,
  Crosshair,
} from 'lucide-react';

interface ScenarioPageProps {
  scenarios: ScenarioItem[];
  selectedScenarioId: string;
  onSelectScenarioId: (id: string) => void;
  onSubmitDecision: (scenario: ScenarioItem, option: ScenarioOption) => void;
  onNavigate: (page: ActivePage) => void;
}

export const ScenarioPage: React.FC<ScenarioPageProps> = ({
  scenarios,
  selectedScenarioId,
  onSelectScenarioId,
  onSubmitDecision,
  onNavigate,
}) => {
  const currentScenario =
    scenarios.find(s => s.id === selectedScenarioId) || scenarios[0];

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [activeArtifactTab, setActiveArtifactTab] = useState<'preview' | 'headers' | 'links'>('preview');
  const [activeToolTab, setActiveToolTab] = useState<'headers' | 'whois' | 'scan' | 'decode'>('whois');
  const [realismTimer, setRealismTimer] = useState<number>(0);
  const [realismActive, setRealismActive] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (realismActive) {
      timer = setInterval(() => {
        setRealismTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [realismActive]);

  const selectedOption = currentScenario.options.find(o => o.id === selectedOptionId);

  const handleSubmit = () => {
    if (!selectedOption) return;
    onSubmitDecision(currentScenario, selectedOption);
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 max-w-7xl mx-auto text-slate-200">
      {/* Top Breadcrumb & Scenario Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#182133] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
            <Crosshair className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">INVESTIGATION WORKSTATION // INCIDENT SIMULATOR</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
            {currentScenario.title}
          </h1>
        </div>

        {/* Realism Timer & Scenario Selectors */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-[4px] bg-[#090d16] border border-[#1a2233] text-xs font-mono text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{realismActive ? formatTimer(realismTimer) : 'TIMER OFF'}</span>
            <button
              onClick={() => setRealismActive(!realismActive)}
              className="text-[10px] text-blue-400 hover:text-blue-300 ml-1 underline"
            >
              {realismActive ? 'Pause' : 'Start Drill'}
            </button>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-xs">
            {scenarios.map(sc => (
              <button
                key={sc.id}
                onClick={() => {
                  onSelectScenarioId(sc.id);
                  setSelectedOptionId(null);
                  setRealismTimer(0);
                }}
                className={`px-2.5 py-1 rounded-[3px] text-xs font-mono whitespace-nowrap transition-colors ${
                  sc.id === currentScenario.id
                    ? 'bg-[#152033] border border-blue-500/70 text-white font-semibold'
                    : 'bg-[#090d16] border border-[#1a2233] text-slate-400 hover:text-slate-200'
                }`}
              >
                {sc.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Split-Pane Investigation Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT PANE: Simulated Environment & Artifact (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="rounded-[4px] bg-[#0c121e] border border-[#1b2538] overflow-hidden">
            {/* Artifact Environment Header */}
            <div className="px-4 py-2.5 bg-[#090d16] border-b border-[#1b2538] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                {currentScenario.environmentType === 'email' ? (
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                ) : (
                  <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span className="font-semibold">
                  {currentScenario.environmentType === 'email' ? 'Campus Webmail Client' : 'System Event Notification'}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-[11px] text-slate-400">{currentScenario.simulatedArtifact.timestamp || 'Today 09:42 EST'}</span>
              </div>

              {/* View Tabs */}
              <div className="flex items-center gap-1 text-[11px] font-mono">
                <button
                  onClick={() => setActiveArtifactTab('preview')}
                  className={`px-2 py-0.5 rounded-[3px] transition-colors ${
                    activeArtifactTab === 'preview' ? 'bg-[#182338] text-white' : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  Rendered
                </button>
                <button
                  onClick={() => setActiveArtifactTab('headers')}
                  className={`px-2 py-0.5 rounded-[3px] transition-colors ${
                    activeArtifactTab === 'headers' ? 'bg-[#182338] text-white' : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  Raw Headers
                </button>
                <button
                  onClick={() => setActiveArtifactTab('links')}
                  className={`px-2 py-0.5 rounded-[3px] transition-colors ${
                    activeArtifactTab === 'links' ? 'bg-[#182338] text-white' : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  Extracted Links
                </button>
              </div>
            </div>

            {/* Artifact Content Canvas */}
            <div className="p-4 sm:p-5 space-y-3 font-sans text-xs">
              {activeArtifactTab === 'preview' && (
                <div className="space-y-3">
                  {/* Email Headers Meta Bar */}
                  <div className="p-3 rounded-[3px] bg-[#070b13] border border-[#162136] font-mono text-[11px] space-y-1 text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 w-16">FROM:</span>
                      <span className="text-white font-medium">{currentScenario.simulatedArtifact.sender}</span>
                      <span className="text-blue-300">&lt;{currentScenario.simulatedArtifact.senderAddress}&gt;</span>
                    </div>
                    {currentScenario.simulatedArtifact.subject && (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 w-16">SUBJECT:</span>
                        <span className="text-amber-300 font-semibold">{currentScenario.simulatedArtifact.subject}</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-4 rounded-[3px] bg-[#080d17] border border-[#162136] text-xs sm:text-[13px] leading-relaxed text-slate-200 whitespace-pre-line">
                    {currentScenario.simulatedArtifact.body}
                  </div>

                  {/* Hyperlink target callout */}
                  {currentScenario.simulatedArtifact.targetUrl && (
                    <div className="p-2.5 rounded-[3px] bg-[#08101e] border border-[#172640] text-[11px] font-mono flex items-center justify-between">
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-slate-400">Embedded URL:</span>
                        <code className="text-amber-400 truncate">{currentScenario.simulatedArtifact.targetUrl}</code>
                      </div>
                      <span className="text-[10px] text-rose-400 font-semibold uppercase px-1.5 py-0.5 rounded bg-rose-950/60 border border-rose-900/60 ml-2 shrink-0">
                        Unverified
                      </span>
                    </div>
                  )}
                </div>
              )}

              {activeArtifactTab === 'headers' && (
                <div className="p-3 rounded-[3px] bg-[#05080f] border border-[#162136] font-mono text-[11px] text-slate-300 space-y-1 leading-relaxed overflow-x-auto">
                  <div className="text-blue-400 font-bold mb-1">--- MIME ENVELOPE HEADERS ---</div>
                  <div>Received: from mx1.threat-actor-host.cc (198.51.100.82) by inbound.univ.edu</div>
                  <div>From: "{currentScenario.simulatedArtifact.sender}" &lt;{currentScenario.simulatedArtifact.senderAddress}&gt;</div>
                  <div>To: student@university.edu</div>
                  <div>Subject: {currentScenario.simulatedArtifact.subject}</div>
                  <div>DKIM-Signature: v=1; a=rsa-sha256; d=threat-actor-host.cc; s=202401; (DOMAIN MISMATCH)</div>
                  <div>Authentication-Results: spf=softfail (mx1.threat-actor-host.cc is unauthorized sender for univ.edu)</div>
                  <div>X-Spam-Flag: YES (Urgency Score: 8.8/10, Typosquatting Trigger)</div>
                </div>
              )}

              {activeArtifactTab === 'links' && (
                <div className="p-3 rounded-[3px] bg-[#05080f] border border-[#162136] font-mono text-[11px] text-slate-300 space-y-2">
                  <div className="text-blue-400 font-bold">--- EXTRACTED HYPERLINKS ---</div>
                  <div className="p-2 rounded bg-[#0b1220] border border-[#1b263b] space-y-1">
                    <span className="text-slate-400 block text-[10px]">ANCHOR TEXT:</span>
                    <span className="text-white">"Click here to re-authenticate single sign-on"</span>
                    <span className="text-slate-400 block text-[10px] pt-1">ACTUAL DESTINATION (HREF):</span>
                    <code className="text-rose-400 break-all">{currentScenario.simulatedArtifact.targetUrl || 'http://login.univ.edu.auth-portal-verify.org/session?id=9928'}</code>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Scenario Background Brief */}
          <div className="p-3.5 rounded-[4px] bg-[#0c121e] border border-[#1b2538] text-xs space-y-1.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              OPERATIONAL CONTEXT
            </span>
            <p className="text-slate-300 leading-relaxed font-sans">
              {currentScenario.context}
            </p>
          </div>
        </div>

        {/* RIGHT PANE: Investigation Tools + Decision Options (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Investigation Forensic Tools Box */}
          <div className="rounded-[4px] bg-[#0c121e] border border-[#1b2538] overflow-hidden">
            <div className="px-3.5 py-2 bg-[#090d16] border-b border-[#1b2538] flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-300 uppercase tracking-wider font-semibold">
                INVESTIGATION TOOLKIT
              </span>
              <span className="text-[10px] font-mono text-emerald-400">4 Tools Active</span>
            </div>

            {/* Tool Selector Tabs */}
            <div className="grid grid-cols-4 border-b border-[#162136] text-[11px] font-mono text-center">
              <button
                onClick={() => setActiveToolTab('whois')}
                className={`py-1.5 border-r border-[#162136] transition-colors ${
                  activeToolTab === 'whois' ? 'bg-[#141f33] text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Whois
              </button>
              <button
                onClick={() => setActiveToolTab('scan')}
                className={`py-1.5 border-r border-[#162136] transition-colors ${
                  activeToolTab === 'scan' ? 'bg-[#141f33] text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                URL Scan
              </button>
              <button
                onClick={() => setActiveToolTab('headers')}
                className={`py-1.5 border-r border-[#162136] transition-colors ${
                  activeToolTab === 'headers' ? 'bg-[#141f33] text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                SPF/DKIM
              </button>
              <button
                onClick={() => setActiveToolTab('decode')}
                className={`py-1.5 transition-colors ${
                  activeToolTab === 'decode' ? 'bg-[#141f33] text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Decode
              </button>
            </div>

            {/* Tool Output Window */}
            <div className="p-3 bg-[#060a12] font-mono text-[11px] text-slate-300 min-h-[120px]">
              {activeToolTab === 'whois' && (
                <div className="space-y-1">
                  <div className="text-slate-400">Domain: {currentScenario.simulatedArtifact.senderAddress?.split('@')[1] || 'portal-verify.org'}</div>
                  <div className="text-amber-400">Registered: 2 days ago (2025-09-08) via PrivacyProtect Ltd</div>
                  <div className="text-slate-400">Registrar: NameCheap, Inc. (Anonymized)</div>
                  <div className="text-rose-400">Flag: Newly Registered Domain (&lt; 7 days old)</div>
                </div>
              )}

              {activeToolTab === 'scan' && (
                <div className="space-y-1">
                  <div className="text-slate-400">Reputation Engine: 14/89 Security Vendors flagged malicious</div>
                  <div className="text-rose-400">Classification: Phishing / AiTM Credential Harvester</div>
                  <div className="text-slate-400">SSL Certificate: Let's Encrypt (Automated Free Cert)</div>
                  <div className="text-slate-400">Host IP: 198.51.100.24 (Bulgaria)</div>
                </div>
              )}

              {activeToolTab === 'headers' && (
                <div className="space-y-1">
                  <div>SPF Check: <span className="text-rose-400">FAIL</span> (IP 198.51.100.24 unlisted)</div>
                  <div>DKIM Signature: <span className="text-amber-400">MISMATCH</span> (signed by third party)</div>
                  <div>DMARC Policy: <span className="text-amber-400">p=none</span> (Monitoring mode only)</div>
                </div>
              )}

              {activeToolTab === 'decode' && (
                <div className="space-y-1">
                  <div className="text-slate-400">Encoded Query: ?target=c3R1ZGVudEB1bml2LmVkdQ==</div>
                  <div className="text-emerald-400">Base64 Decoded: "target=student@univ.edu"</div>
                  <div className="text-slate-400">Threat Purpose: Pre-populates victim email on spoofed SSO login form.</div>
                </div>
              )}
            </div>
          </div>

          {/* Decision Options */}
          <div className="rounded-[4px] bg-[#0c121e] border border-[#1b2538] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#182338] pb-2">
              <span className="text-[11px] font-mono text-blue-400 uppercase tracking-wider font-semibold">
                WHAT WOULD YOU DO?
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {currentScenario.difficulty.toUpperCase()} • 1 DECISION REQUIRED
              </span>
            </div>

            <p className="text-xs text-slate-300 font-medium">
              {currentScenario.prompt}
            </p>

            {/* Options list */}
            <div className="space-y-2">
              {currentScenario.options.map(opt => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedOptionId(opt.id)}
                    className={`w-full text-left p-3 rounded-[3px] border transition-colors flex items-start gap-3 ${
                      isSelected
                        ? 'bg-[#121c2e] border-blue-500 text-white'
                        : 'bg-[#080d17] border-[#182338] text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-[2px] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-[#152033] text-slate-400'
                      }`}
                    >
                      {opt.label}
                    </div>
                    <span className="text-xs leading-relaxed">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-between">
              <div className="text-[11px] font-mono text-slate-400">
                {selectedOption ? (
                  <span className="text-blue-400 font-semibold">Selected: Option {selectedOption.label}</span>
                ) : (
                  <span>Choose defensive action</span>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={!selectedOptionId}
                className="px-4 py-2 rounded-[3px] bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white font-mono text-xs font-medium transition-colors flex items-center gap-1.5"
              >
                <span>Submit & Run Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

