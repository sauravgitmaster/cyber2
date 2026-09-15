import React, { useState } from 'react';
import { ActivePage, SkillCheckResult } from '../types';
import { initialSkillCheckQuestions } from '../data/mockData';
import { TrustScoreGauge } from '../components/common/TrustScoreGauge';
import {
  CheckSquare,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  TrendingUp,
  Sparkles,
  RefreshCw,
  Compass,
} from 'lucide-react';

interface SkillCheckPageProps {
  onNavigate: (page: ActivePage, params?: { pathId?: string }) => void;
  onCompleteSkillCheck: (result: SkillCheckResult) => void;
  lastResult?: SkillCheckResult;
}

export const SkillCheckPage: React.FC<SkillCheckPageProps> = ({
  onNavigate,
  onCompleteSkillCheck,
  lastResult,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isFinished, setIsFinished] = useState(Boolean(lastResult));
  const [result, setResult] = useState<SkillCheckResult | null>(lastResult || null);

  const questions = initialSkillCheckQuestions;
  const currentQ = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  const handleSelectOption = (optionId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Calculate final score
      let totalWeight = 0;
      questions.forEach(q => {
        const chosenId = selectedAnswers[q.id];
        const opt = q.options.find(o => o.id === chosenId);
        totalWeight += opt ? opt.trustScoreWeight : 50;
      });

      const calculatedScore = Math.round(totalWeight / questions.length);

      const newResult: SkillCheckResult = {
        completedAt: 'Just now',
        digitalTrustScore: calculatedScore,
        strengths: ['Password Awareness', 'Privacy Awareness'],
        needsImprovement: ['Phishing Detection', 'Social Engineering'],
        recommendedPathId: 'cyber-safety-fundamentals',
        recommendedPathTitle: 'Cyber Safety Fundamentals',
        categoryScores: {
          'Password Security': 86,
          'Privacy Awareness': 74,
          'Phishing Detection': 61,
          'Social Engineering': 54,
          'Safe Browsing': 78,
        },
      };

      setResult(newResult);
      setIsFinished(true);
      onCompleteSkillCheck(newResult);
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setIsFinished(false);
    setResult(null);
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#080d19] p-4 sm:p-6 lg:p-8 flex flex-col justify-center items-center text-slate-100">
      <div className="w-full max-w-2xl space-y-6">
        {!isFinished ? (
          /* Active Assessment Flow */
          <div className="space-y-6">
            {/* Header & Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5 text-blue-400">
                  <CheckSquare className="w-4 h-4" />
                  INITIAL SKILL CHECK
                </span>
                <span>
                  Question {currentIndex + 1} of {questions.length}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Let's understand your cyber habits.
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Select the decision you would genuinely take in this practical situation.
              </p>
            </div>

            {/* Scenario Card */}
            <div className="p-6 rounded-2xl bg-[#0e172a] border border-slate-800 shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-950/70 border border-blue-800/60 text-blue-300">
                  {currentQ.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Scenario #{currentQ.id}
                </span>
              </div>

              {/* Realistic situation box */}
              <div className="p-4 rounded-xl bg-[#0a0f1d] border border-slate-800/80 text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
                {currentQ.scenario}
              </div>

              {/* Options */}
              <div className="space-y-3 pt-2">
                {currentQ.options.map(opt => {
                  const isSelected = selectedAnswers[currentQ.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-blue-950/50 border-blue-500 text-white shadow-xs'
                          : 'bg-[#0b1222] border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono ${
                          isSelected
                            ? 'border-blue-400 bg-blue-500 text-white'
                            : 'border-slate-700 text-slate-400'
                        }`}
                      >
                        {isSelected ? '✓' : ''}
                      </div>
                      <span className="flex-1 leading-relaxed">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="px-3.5 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-30 text-xs transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={handleNext}
                  disabled={!selectedAnswers[currentQ.id]}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-medium text-xs transition-colors flex items-center gap-2 shadow-xs"
                >
                  <span>{currentIndex === questions.length - 1 ? 'Analyze Habits' : 'Next Question'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Assessment Results Profile Screen */
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-800 text-blue-300 text-xs font-mono">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                ASSESSMENT PROFILE GENERATED
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Your Cyber Habit Profile
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                Here is your baseline defensive posture based on your responses.
              </p>
            </div>

            {/* Results Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0e172a] border border-slate-800 shadow-xl space-y-6">
              {/* Score Display */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-xl bg-[#0a0f1d] border border-slate-800/80 gap-6">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                    INITIAL METRIC
                  </span>
                  <div className="text-lg font-bold text-white">
                    Digital Trust Score: {result?.digitalTrustScore ?? 0}/100
                  </div>
                  <p className="text-xs text-slate-400 max-w-xs">
                    Your baseline readiness to detect social engineering and protect personal student credentials.
                  </p>
                </div>
                <TrustScoreGauge score={result?.digitalTrustScore ?? 0} delta={result?.digitalTrustScore ?? 0} size="md" />
              </div>

              {/* Strengths & Needs Improvement Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="p-4 rounded-xl bg-[#0a0f1d] border border-slate-800 space-y-2.5">
                  <div className="flex items-center gap-2 text-blue-400 text-xs font-mono font-semibold uppercase">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Strengths</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-200">
                    {result?.strengths.map((s, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Needs Improvement */}
                <div className="p-4 rounded-xl bg-[#0a0f1d] border border-slate-800 space-y-2.5">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-semibold uppercase">
                    <AlertCircle className="w-4 h-4" />
                    <span>Needs Improvement</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-200">
                    {result?.needsImprovement.map((w, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommended Path Box */}
              <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono text-blue-300 uppercase tracking-wider block mb-0.5">
                    RECOMMENDED PATH
                  </span>
                  <div className="text-sm font-semibold text-white">
                    {result?.recommendedPathTitle || 'Cyber Safety Fundamentals'}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Targeted directly at your identified improvement areas in phishing and social engineering.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('learning-paths', { pathId: result?.recommendedPathId || 'cyber-safety-fundamentals' })}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors shrink-0 flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Start My Learning Path</span>
                </button>
              </div>

              {/* Secondary Navigation */}
              <div className="flex items-center justify-between pt-2 text-xs">
                <button
                  onClick={handleRetake}
                  className="text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retake Assessment</span>
                </button>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Go to Student Dashboard →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
