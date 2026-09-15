import React, { useState } from 'react';
import { ActivePage, SkillCheckResult } from '../types';
import { initialSkillCheckQuestions } from '../data/mockData';
import { TrustScoreGauge } from '../components/common/TrustScoreGauge';
import {
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Compass,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { ByteMascot } from '../components/common/ByteMascot';

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
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      let totalWeight = 0;
      questions.forEach((q) => {
        const chosenId = selectedAnswers[q.id];
        const opt = q.options.find((o) => o.id === chosenId);
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
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col justify-center items-center text-[#243047] font-sans">
      <div className="w-full max-w-2xl space-y-6">
        {!isFinished ? (
          /* Active Assessment Flow */
          <div className="space-y-6">
            {/* Header & Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1.5 text-[#4F7CFF]">
                  <Zap className="w-4 h-4" />
                  <span>QUICK CYBER CHECK</span>
                </span>
                <span>
                  Challenge {currentIndex + 1} of {questions.length}
                </span>
              </div>
              <div className="w-full h-3 bg-slate-200/80 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-[#4F7CFF] to-[#8B6CFF] transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Situation Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-[#4F7CFF] border border-blue-100">
                  {currentQ.category}
                </span>
                <span className="text-xs text-slate-600 font-bold">
                  Quest #{currentQ.id}
                </span>
              </div>

              {/* Realistic situation box */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 text-sm sm:text-base text-[#243047] leading-relaxed font-medium">
                "{currentQ.scenario}"
              </div>

              <p className="text-xs font-bold text-slate-500">
                What would you choose to do?
              </p>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt) => {
                  const isSelected = selectedAnswers[currentQ.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`w-full text-left p-4 rounded-2xl border-2 text-xs sm:text-sm transition-all flex items-start gap-3.5 ${
                        isSelected
                          ? 'bg-blue-50 border-[#4F7CFF] text-[#243047] font-bold shadow-2xs scale-[1.01]'
                          : 'bg-white border-slate-200 hover:border-blue-200 hover:bg-slate-50 text-slate-700 font-medium'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? 'border-[#4F7CFF] bg-[#4F7CFF] text-white'
                            : 'border-slate-300 text-transparent'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="flex-1 leading-relaxed">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  onClick={handleNext}
                  disabled={!selectedAnswers[currentQ.id]}
                  className="px-6 py-2.5 rounded-xl bg-[#4F7CFF] hover:bg-[#3D6CE6] disabled:opacity-40 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-xs"
                >
                  <span>
                    {currentIndex === questions.length - 1
                      ? 'See My Cyber Profile'
                      : 'Next Challenge'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Assessment Results Profile Screen */
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <ByteMascot mood="excited" size="lg" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#243047]">
                Your Cyber Superhero Profile
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Awesome work completing the check! Here are your cyber instincts and superpowers.
              </p>
            </div>

            {/* Results Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
              {/* Score Display Gauge */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                <TrustScoreGauge
                  score={result?.digitalTrustScore ?? 74}
                  delta={result?.digitalTrustScore ?? 74}
                  size="md"
                  showWhyDetail={true}
                />
              </div>

              {/* Strengths & Next Skills to practice */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 text-xs font-black uppercase">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Your Superpowers</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-emerald-950 font-medium">
                    {result?.strengths.map((s, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-emerald-600">✓</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                  <div className="flex items-center gap-2 text-amber-800 text-xs font-black uppercase">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Next Skills to Level Up</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-amber-950 font-medium">
                    {result?.needsImprovement.map((w, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-amber-600">★</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommended Adventure Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-500 to-[#8B6CFF] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                <div>
                  <span className="text-[11px] font-black text-yellow-300 uppercase tracking-wider block mb-0.5">
                    RECOMMENDED ADVENTURE FOR YOU
                  </span>
                  <div className="text-base font-extrabold text-white">
                    {result?.recommendedPathTitle || 'Cyber Safety Fundamentals'}
                  </div>
                  <p className="text-xs text-blue-100 mt-0.5">
                    Dive into fun missions to master spotting scams and tricky messages!
                  </p>
                </div>
                <button
                  onClick={() =>
                    onNavigate('learning-paths', {
                      pathId: result?.recommendedPathId || 'cyber-safety-fundamentals',
                    })
                  }
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-blue-50 text-[#4F7CFF] font-black text-xs transition-all shrink-0 flex items-center gap-2 shadow-xs"
                >
                  <Compass className="w-4 h-4" />
                  <span>Start Adventure</span>
                </button>
              </div>

              {/* Retake / Home links */}
              <div className="flex items-center justify-between pt-2 text-xs font-bold">
                <button
                  onClick={handleRetake}
                  className="text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Check Again</span>
                </button>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="text-[#4F7CFF] hover:underline"
                >
                  Go to Adventure Home →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
