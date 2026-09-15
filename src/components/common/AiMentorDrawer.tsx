import React, { useState } from 'react';
import { MentorInsight } from '../../types';
import { Bot, Sparkles, Send, X, ArrowRight, ShieldQuestion, HelpCircle, CheckCircle2 } from 'lucide-react';

interface AiMentorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  insight: MentorInsight;
  onStartRecommendation: (pathId: string, moduleId?: string) => void;
  userTrustScore: number;
}

interface QAPair {
  q: string;
  a: string;
  category: string;
}

const PRESET_TOPICS: QAPair[] = [
  {
    category: 'Phishing',
    q: 'How do lookalike domains trick users even if they look legitimate?',
    a: 'Attackers register domains with visual substitutions (e.g. replacing Latin "l" with number "1", or using Cyrillic homoglyphs like "а"). They also nest authentic-sounding subdomains (e.g., login.university.edu.malicious-site.com). Always read backward from the first forward slash "/" to verify the real registered root domain.',
  },
  {
    category: 'Authentication',
    q: 'Why is MFA push fatigue becoming so common?',
    a: 'MFA push bombing occurs after an attacker has already stolen your primary password. By bombarding your phone with alerts at 2 AM, they exploit sensory overload or accidental taps to gain entry. The countermeasure is number-matching challenges or hardware FIDO2 security keys.',
  },
  {
    category: 'Privacy',
    q: 'What is the danger of answering viral social media quizzes?',
    a: 'Viral quizzes asking for your "first car", "childhood street", or "elementary school mascot" are disguised OSINT crawlers designed to harvest answers to standard security recovery questions.',
  },
  {
    category: 'Network',
    q: 'Does HTTPS make public Wi-Fi completely safe?',
    a: 'HTTPS encrypts payload data in transit between browser and server, but an untrusted public network still exposes DNS query destinations, allows malicious captive portals, and permits man-in-the-middle attacks if certificate warnings are bypassed.',
  },
];

export const AiMentorDrawer: React.FC<AiMentorDrawerProps> = ({
  isOpen,
  onClose,
  insight,
  onStartRecommendation,
  userTrustScore,
}) => {
  const [messages, setMessages] = useState<Array<{ sender: 'mentor' | 'student'; text: string; time: string }>>([
    {
      sender: 'mentor',
      text: `Hello Saurav. Based on your recent scenarios and current Trust Score of ${userTrustScore}/100, your technical link analysis is strong, but pretexting detection can be strengthened. What cybersecurity concept can I clarify today?`,
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const question = textToSend || inputText.trim();
    if (!question) return;

    // Add student message
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { sender: 'student', text: question, time: now }]);
    setInputText('');
    setIsAnswering(true);

    // Simulate contextual mentor answer
    setTimeout(() => {
      let answer = '';
      const lower = question.toLowerCase();

      if (lower.includes('phish') || lower.includes('email') || lower.includes('domain') || lower.includes('link')) {
        answer = 'In phishing analysis, prioritize three structural checks: 1) Verify the Return-Path in raw headers against the visible From address, 2) Inspect anchor href destinations rather than visible link text, and 3) Check for artificial urgency triggers demanding immediate action.';
      } else if (lower.includes('mfa') || lower.includes('push') || lower.includes('password') || lower.includes('fatigue')) {
        answer = 'MFA push bombing means your primary password has already been compromised. Never tap "Approve" to stop notifications. Deny the prompt immediately, mark as fraudulent, and rotate the master password from an uncompromised machine.';
      } else if (lower.includes('usb') || lower.includes('flash') || lower.includes('bait')) {
        answer = 'Unknown USB drives can execute automated keystroke injection payloads (like USB Rubber Ducky) in seconds. Delivering lost media directly to IT custody prevents peripheral controller exploitation and firmware tampering.';
      } else if (lower.includes('wifi') || lower.includes('network') || lower.includes('public')) {
        answer = 'On open Wi-Fi, assume the local gateway is adversarial. Always route campus credentials through a trusted VPN tunnel and ensure strict TLS certificate validation is enforced without exceptions.';
      } else {
        answer = `Great inquiry regarding security hygiene. When analyzing ${question.slice(0, 40)}..., always adopt the principle of least privilege and zero-trust verification: never assume an incoming request is benign simply because it mentions familiar faculty or campus systems.`;
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'mentor',
          text: answer,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsAnswering(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0e172a] border-l border-slate-700/80 flex flex-col h-full shadow-2xl text-slate-100 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-[#0b1222] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white tracking-wide">Mentor</h3>
                <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-blue-950 border border-blue-800 text-blue-300">
                  AI ASSISTANT
                </span>
              </div>
              <p className="text-xs text-slate-400">Contextual cybersecurity education tutor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Insight Banner */}
        <div className="p-4 bg-[#0a0f1d] border-b border-slate-800">
          <div className="p-3.5 rounded-lg bg-blue-950/40 border border-blue-800/50">
            <div className="flex items-center gap-2 text-xs font-mono text-blue-300 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>MENTOR INSIGHT</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              "{insight.observation}"
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-blue-900/40 text-xs">
              <span className="text-slate-400">
                Recommended: <strong className="text-white">{insight.recommendationTitle}</strong>
              </span>
              <button
                onClick={() => {
                  onStartRecommendation(insight.recommendationPathId, insight.recommendationModuleId);
                  onClose();
                }}
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                <span>Start</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat / Education Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'mentor' ? 'items-start' : 'items-end'}`}
            >
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mb-1">
                <span>{m.sender === 'mentor' ? 'Mentor AI' : 'Saurav'}</span>
                <span>•</span>
                <span>{m.time}</span>
              </div>
              <div
                className={`max-w-[88%] p-3.5 rounded-xl text-xs leading-relaxed ${
                  m.sender === 'mentor'
                    ? 'bg-[#15203b] border border-slate-700/60 text-slate-200'
                    : 'bg-blue-600 text-white font-medium'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isAnswering && (
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono py-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span>Analyzing threat models...</span>
            </div>
          )}

          {/* Quick Discussion Prompts */}
          <div className="pt-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
              Quick Cybersecurity Prompts:
            </span>
            <div className="space-y-1.5">
              {PRESET_TOPICS.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(item.q)}
                  className="w-full text-left p-2 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-blue-700/60 hover:bg-slate-850 text-xs text-slate-300 transition-colors flex items-center justify-between"
                >
                  <span className="truncate pr-2">"{item.q}"</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-blue-300 shrink-0">
                    {item.category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3.5 border-t border-slate-800 bg-[#0b1222]">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Ask Mentor about a cyber concept, attack vector, or scenario..."
              className="flex-1 bg-[#0a0f1d] border border-slate-700/80 rounded-lg px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isAnswering}
              className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
            <span>Specialized for academic cybersecurity guidance</span>
            <span className="font-mono">Zero-Trust Framework</span>
          </div>
        </div>
      </div>
    </div>
  );
};
