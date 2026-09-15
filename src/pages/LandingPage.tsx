import React from 'react';
import { ActivePage } from '../types';
import { Shield, Sparkles, ArrowRight, LogIn } from 'lucide-react';
import { ByteMascot } from '../components/common/ByteMascot';

interface LandingPageProps {
  onNavigate: (page: ActivePage) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#243047] flex flex-col justify-center items-center px-4 py-8 font-sans selection:bg-blue-200">
      <div className="w-full max-w-md text-center space-y-8">
        {/* Friendly Byte Mascot Banner */}
        <div className="inline-flex justify-center animate-bounce-subtle">
          <ByteMascot mood="happy" size="lg" />
        </div>

        {/* Brand & Heading */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-black text-[#4F7CFF]">
            <Shield className="w-4 h-4 text-[#4F7CFF]" />
            <span>CYBERMENTOR 🛡️</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-[#243047] tracking-tight leading-tight">
            Learn to be smarter and safer online.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-sm mx-auto">
            Play fun cyber missions, learn how to spot online tricks, and build smart digital habits.
          </p>
        </div>

        {/* Primary Actions */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => onNavigate('auth')}
            className="w-full py-4 rounded-2xl bg-[#4F7CFF] hover:bg-[#3D6CE6] text-white font-black text-sm sm:text-base shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            <span>Start Learning</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('auth')}
            className="w-full py-3.5 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-700 font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-2xs"
          >
            <LogIn className="w-4 h-4 text-slate-500" />
            <span>Log In</span>
          </button>
        </div>

        {/* Friendly Footer Link */}
        <div className="text-xs font-semibold text-slate-500">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('auth')}
            className="text-[#4F7CFF] hover:underline font-black"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};
