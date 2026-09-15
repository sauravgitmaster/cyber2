import React, { useState, useEffect } from 'react';
import { ActivePage, ScenarioItem, ScenarioOption } from '../types';
import {
  Mail,
  Smartphone,
  ArrowRight,
  Clock,
  ExternalLink,
  HelpCircle,
  Sparkles,
  Shield,
  Search,
  Globe,
  Info,
  ChevronRight,
  AlertCircle,
  Flag,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { ByteMascot } from '../components/common/ByteMascot';

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
    scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0];

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [activeArtifactTab, setActiveArtifactTab] = useState<'message' | 'link' | 'headers'>('message');
  const [activeDetectiveTool, setActiveDetectiveTool] = useState<'inspectLink' | 'checkDomain' | 'clues'>('inspectLink');
  const [showHint, setShowHint] = useState(false);
  const [missionTimer, setMissionTimer] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMissionTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const selectedOption = currentScenario.options.find((o) => o.id === selectedOptionId);

  const handleSubmit = () => {
    if (!selectedOption) return;
    onSubmitDecision(currentScenario, selectedOption);
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s.toString().padStart(2, '0')}`;
  };

  // Option icon helper
  const getOptionIcon = (opt: ScenarioOption, index: number) => {
    const text = opt.text.toLowerCase();
    if (text.includes('report') || text.includes('forward') || text.includes('security')) {
      return { icon: Flag, color: 'text-amber-500 bg-amber-50' };
    }
    if (text.includes('delete') || text.includes('block') || text.includes('ignore')) {
      return { icon: Trash2, color: 'text-rose-500 bg-rose-50' };
    }
    if (text.includes('inspect') || text.includes('verify') || text.includes('check') || text.includes('out-of-band')) {
      return { icon: Search, color: 'text-blue-500 bg-blue-50' };
    }
    return { icon: HelpCircle, color: 'text-purple-500 bg-purple-50' };
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto text-[#243047] font-sans">
      {/* Top Breadcrumb & Mission Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-[#4F7CFF]">
            <span>🎯</span>
            <span className="uppercase tracking-wider">CYBER MISSION #{currentScenario.id === 'scenario-univ-phish' ? '1' : '2'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#243047] mt-0.5">
            {currentScenario.title}
          </h1>
        </div>

        {/* Mission Switcher Pills & Timer */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-[#4F7CFF]">
            <Clock className="w-3.5 h-3.5" />
            <span>Time: {formatTimer(missionTimer)}</span>
          </div>

          <div className="flex items-center gap-1">
            {scenarios.map((sc, i) => (
              <button
                key={sc.id}
                onClick={() => {
                  onSelectScenarioId(sc.id);
                  setSelectedOptionId(null);
                  setShowHint(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  sc.id === currentScenario.id
                    ? 'bg-[#4F7CFF] text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Mission {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main 2-Column Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Clean Realistic Artifact Viewer (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Artifact Card */}
          <div className="bg-white rounded-3xl border-2 border-slate-200/90 shadow-sm overflow-hidden">
            {/* Artifact Browser / Email Window Title Bar */}
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                <span className="text-xs font-bold text-slate-700 ml-2">
                  {currentScenario.environmentType === 'email' ? '📬 Webmail Inbox' : '📱 Message Notification'}
                </span>
              </div>

              {/* View Modes */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold">
                <button
                  onClick={() => setActiveArtifactTab('message')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    activeArtifactTab === 'message'
                      ? 'bg-blue-100 text-[#4F7CFF]'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Message
                </button>
                <button
                  onClick={() => setActiveArtifactTab('link')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    activeArtifactTab === 'link'
                      ? 'bg-blue-100 text-[#4F7CFF]'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Inspect Link
                </button>
                <button
                  onClick={() => setActiveArtifactTab('headers')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    activeArtifactTab === 'headers'
                      ? 'bg-blue-100 text-[#4F7CFF]'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Raw Code
                </button>
              </div>
            </div>

            {/* Email / Notification Content View */}
            <div className="p-6 space-y-4">
              {activeArtifactTab === 'message' && (
                <div className="space-y-4">
                  {/* Sender Header Card */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 font-bold">From:</span>
                        <span className="font-extrabold text-[#243047]">
                          {currentScenario.simulatedArtifact.sender}
                        </span>
                      </div>
                      <span className="text-slate-600 text-[11px]">
                        {currentScenario.simulatedArtifact.timestamp || 'Today 9:42 AM'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                      <span>&lt;{currentScenario.simulatedArtifact.senderAddress}&gt;</span>
                    </div>

                    {currentScenario.simulatedArtifact.subject && (
                      <div className="pt-2 border-t border-slate-200/60">
                        <span className="text-slate-500 font-bold mr-2">Subject:</span>
                        <span className="font-bold text-slate-800">
                          {currentScenario.simulatedArtifact.subject}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content with formatting */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-100 text-sm leading-relaxed text-slate-700 whitespace-pre-line">
                    {currentScenario.simulatedArtifact.body}
                  </div>

                  {/* Embedded Action Button / Link in message */}
                  {currentScenario.simulatedArtifact.targetUrl && (
                    <div className="p-4 rounded-2xl bg-amber-50/70 border-2 border-dashed border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-black uppercase text-amber-800 tracking-wide block">
                          LINK INSIDE THIS MESSAGE
                        </span>
                        <code className="text-xs font-mono font-bold text-amber-900 break-all">
                          {currentScenario.simulatedArtifact.targetUrl}
                        </code>
                      </div>

                      <button
                        onClick={() => setActiveDetectiveTool('inspectLink')}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-200/80 hover:bg-amber-300 text-amber-900 text-xs font-bold transition-colors shrink-0 flex items-center gap-1"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>Inspect Link</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeArtifactTab === 'link' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3 font-mono">
                  <div className="flex items-center gap-2 text-blue-600 font-bold">
                    <Globe className="w-4 h-4" />
                    <span>LINK DESTINATION ANALYSIS</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                    <span className="text-slate-500 text-[10px] block">Full Web Address:</span>
                    <span className="text-rose-600 font-bold text-xs break-all">
                      {currentScenario.simulatedArtifact.targetUrl || 'http://login.univ.edu.auth-portal-verify.org/session?id=9928'}
                    </span>
                  </div>
                  <p className="font-sans text-xs text-slate-600 leading-normal">
                    Notice how the web address starts with words you recognize, but right before the first slash <code>/</code>, the real domain is <strong>auth-portal-verify.org</strong>!
                  </p>
                </div>
              )}

              {activeArtifactTab === 'headers' && (
                <div className="p-4 rounded-2xl bg-[#0a0f1d] text-slate-200 text-xs font-mono space-y-2 overflow-x-auto">
                  <div className="text-blue-400 font-bold text-[11px]">--- EMAIL ENVELOPE HEADERS ---</div>
                  <pre className="text-[11px] leading-relaxed">
{`From: "${currentScenario.simulatedArtifact.sender}" <${currentScenario.simulatedArtifact.senderAddress}>
DKIM-Signature: v=1; d=attacker-network.cc (DOMAIN MISMATCH)
Authentication-Results: spf=softfail (unapproved IP sender)
X-Spam-Flag: SUSPICIOUS_URGENCY`}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Detective Tools Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🕵️</span>
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  DETECTIVE TOOLS
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#4F7CFF]">
                Click a tool to uncover clues
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs font-bold">
              <button
                onClick={() => setActiveDetectiveTool('inspectLink')}
                className={`py-2 px-3 rounded-xl border transition-colors flex items-center justify-center gap-1.5 ${
                  activeDetectiveTool === 'inspectLink'
                    ? 'bg-blue-50 border-[#4F7CFF] text-[#4F7CFF]'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Inspect Link</span>
              </button>

              <button
                onClick={() => setActiveDetectiveTool('checkDomain')}
                className={`py-2 px-3 rounded-xl border transition-colors flex items-center justify-center gap-1.5 ${
                  activeDetectiveTool === 'checkDomain'
                    ? 'bg-blue-50 border-[#4F7CFF] text-[#4F7CFF]'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Check Domain</span>
              </button>

              <button
                onClick={() => setActiveDetectiveTool('clues')}
                className={`py-2 px-3 rounded-xl border transition-colors flex items-center justify-center gap-1.5 ${
                  activeDetectiveTool === 'clues'
                    ? 'bg-blue-50 border-[#4F7CFF] text-[#4F7CFF]'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Info className="w-3.5 h-3.5" />
                <span>View Clues</span>
              </button>
            </div>

            {/* Detective Result Box */}
            <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs text-slate-700">
              {activeDetectiveTool === 'inspectLink' && (
                <p className="leading-relaxed">
                  🔍 <strong>Link Clue:</strong> The email claims to be from school IT, but the link points to a newly registered website that isn't on the school network!
                </p>
              )}
              {activeDetectiveTool === 'checkDomain' && (
                <p className="leading-relaxed">
                  🌐 <strong>Domain Clue:</strong> The domain <code>auth-portal-verify.org</code> was registered only 2 days ago via an anonymous proxy service.
                </p>
              )}
              {activeDetectiveTool === 'clues' && (
                <p className="leading-relaxed">
                  📋 <strong>Urgency Clue:</strong> Notice the text: "Your account will be terminated in 12 hours". Scammers use fake deadlines to make you panic!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: "What would you do?" Decision Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border-2 border-blue-200/80 p-6 shadow-sm space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-black uppercase tracking-wider">
                  YOUR TURN
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Select 1 action
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#243047] mt-1.5">
                What would you do?
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                {currentScenario.prompt}
              </p>
            </div>

            {/* Answer Options as Large Friendly Cards */}
            <div className="space-y-2.5">
              {currentScenario.options.map((opt, idx) => {
                const isSelected = selectedOptionId === opt.id;
                const { icon: Icon, color } = getOptionIcon(opt, idx);

                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedOptionId(opt.id)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 group ${
                      isSelected
                        ? 'bg-blue-50/80 border-[#4F7CFF] shadow-xs scale-[1.01]'
                        : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isSelected ? 'bg-[#4F7CFF] text-white' : color
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-xs sm:text-sm font-bold text-[#243047] block leading-snug">
                        {opt.text}
                      </span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${
                        isSelected
                          ? 'border-[#4F7CFF] bg-[#4F7CFF]'
                          : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Ask Byte For A Hint Toggle Button */}
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowHint(!showHint)}
                className="w-full py-2.5 px-4 rounded-2xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-xs font-bold text-amber-800 transition-colors flex items-center justify-center gap-2"
              >
                <ByteMascot mood="thinking" size="xs" />
                <span>{showHint ? 'Hide Byte’s Hint' : 'Need help? Ask Byte for a hint!'}</span>
              </button>

              {showHint && (
                <div className="mt-3 p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 text-xs text-amber-900 space-y-1 animate-in fade-in duration-150">
                  <span className="font-black block">💡 Byte Whispers:</span>
                  <p className="leading-relaxed text-[11px]">
                    "Take a close look at the sender’s address and the URL. If someone asks you to click an urgent login link, the safest choice is always to report it or check your real school app directly!"
                  </p>
                </div>
              )}
            </div>

            {/* Submit Action Button */}
            <button
              onClick={handleSubmit}
              disabled={!selectedOptionId}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#4F7CFF] hover:bg-[#3D6CE6] disabled:opacity-40 text-white font-black text-sm transition-all shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2"
            >
              <span>Submit My Decision</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
