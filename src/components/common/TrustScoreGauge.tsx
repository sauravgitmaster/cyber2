import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface TrustScoreGaugeProps {
  score: number;
  delta?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showWhyDetail?: boolean;
  categoryBreakdown?: { name: string; score: number }[];
}

export const TrustScoreGauge: React.FC<TrustScoreGaugeProps> = ({
  score,
  delta,
  size = 'md',
  showLabel = true,
  showWhyDetail = false,
  categoryBreakdown = [
    { name: 'Password Security', score: 86 },
    { name: 'Privacy Awareness', score: 74 },
    { name: 'Phishing Detection', score: 61 },
    { name: 'Social Engineering', score: 54 },
    { name: 'Cyber Ethics', score: 82 },
  ],
}) => {
  const [isWhyOpen, setIsWhyOpen] = useState(false);

  // Status mapping
  let statusText = 'Fair Defense';
  let barColor = 'bg-blue-500';
  if (score === 0) {
    statusText = 'Unrated';
    barColor = 'bg-slate-600';
  } else if (score >= 80) {
    statusText = 'Strong Defense';
    barColor = 'bg-emerald-500';
  } else if (score >= 65) {
    statusText = 'Resilient';
    barColor = 'bg-blue-500';
  } else if (score >= 50) {
    statusText = 'Needs Practice';
    barColor = 'bg-amber-500';
  } else {
    statusText = 'High Risk';
    barColor = 'bg-rose-500';
  }

  // Segment count for the technical visual bar (20 segments total)
  const totalSegments = 20;
  const filledSegments = Math.round((Math.max(0, Math.min(100, score)) / 100) * totalSegments);

  // Compact variant for inline navbar / small cards
  if (size === 'sm') {
    return (
      <div className="flex items-center gap-2 font-mono">
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-semibold text-white">{score}</span>
          <span className="text-[10px] text-slate-400">/100</span>
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={`w-1 h-3 rounded-[1px] ${
                i < Math.round((score / 100) * 10) ? barColor : 'bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full select-none text-slate-100">
      {/* Metric Header */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
          Digital Trust Score
        </span>
        {showWhyDetail && (
          <button
            type="button"
            onClick={() => setIsWhyOpen(!isWhyOpen)}
            className="inline-flex items-center gap-1 text-[11px] font-mono text-blue-400 hover:text-blue-300 transition-colors"
          >
            <HelpCircle className="w-3 h-3" />
            <span>Why?</span>
            {isWhyOpen ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
        )}
      </div>

      {/* Primary Score & Delta */}
      <div className="mt-1.5 flex items-baseline justify-between">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-3xl font-semibold tracking-tight text-white">
            {score}
          </span>
          <span className="font-mono text-xs text-slate-400">/ 100</span>
        </div>

        {delta !== undefined && (
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span
              className={`px-1.5 py-0.5 rounded-[3px] text-[11px] font-medium ${
                delta > 0
                  ? 'bg-blue-950/80 text-blue-300 border border-blue-800/60'
                  : delta === 0
                  ? 'bg-slate-800/80 text-slate-400 border border-slate-700/60'
                  : 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
              }`}
            >
              {delta > 0 ? `+${delta} this week` : delta === 0 ? 'Baseline' : `${delta} this week`}
            </span>
          </div>
        )}
      </div>

      {/* Segmented Technical Bar: 20 blocks */}
      <div className="mt-2.5 flex items-center gap-1">
        {Array.from({ length: totalSegments }).map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-[1px] transition-colors duration-300 ${
              i < filledSegments ? barColor : 'bg-slate-800'
            }`}
          />
        ))}
      </div>

      {/* Micro Status Label */}
      {showLabel && (
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
          <span>Compared with your previous assessment.</span>
          <span className="font-mono font-medium text-slate-300">{statusText}</span>
        </div>
      )}

      {/* Interactive "Why?" Skill Breakdown */}
      {showWhyDetail && isWhyOpen && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2 animate-in fade-in duration-200">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Competency Breakdown
          </div>
          <div className="space-y-1.5 text-xs font-mono">
            {categoryBreakdown.map(item => (
              <div
                key={item.name}
                className="flex items-center justify-between text-slate-300 py-0.5 hover:text-white"
              >
                <span className="truncate pr-2">{item.name}</span>
                <span className="font-semibold text-slate-200">{item.score}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

