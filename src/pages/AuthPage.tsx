import React, { useState } from 'react';
import { ActivePage, UserProfile } from '../types';
import { Shield, Lock, Mail, ArrowRight, CheckCircle2, KeyRound } from 'lucide-react';

interface AuthPageProps {
  onNavigate: (page: ActivePage) => void;
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onNavigate, user, setUser }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState(user.email);
  const [fullName, setFullName] = useState(user.name);
  const [studentId, setStudentId] = useState(user.studentId);
  const [institution, setInstitution] = useState(user.institution);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      name: fullName || 'Saurav',
      email: email || 'saurav.m@university.edu',
      studentId: studentId || 'STU-2024-8842',
      institution: institution || 'State Institute of Technology',
    }));
    onNavigate('dashboard');
  };

  const handleQuickDemo = () => {
    setUser(prev => ({
      ...prev,
      name: 'Saurav',
      email: 'saurav.m@university.edu',
      studentId: 'STU-2024-8842',
      institution: 'State Institute of Technology',
    }));
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#080d19] flex flex-col justify-center items-center px-4 py-12 text-slate-100">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 items-center justify-center text-blue-400 mb-2">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {isSignUp ? 'Enroll Student Account' : 'Sign in to CyberMentor AI'}
          </h1>
          <p className="text-xs text-slate-400">
            Access your personalized cyber education framework & trust score
          </p>
        </div>

        {/* Auth Form Card */}
        <div className="p-6 rounded-2xl bg-[#0e172a] border border-slate-800 shadow-xl space-y-5">
          {/* Quick Demo Login Pill */}
          <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-900/60 flex items-center justify-between">
            <div className="text-xs">
              <span className="font-semibold text-white block">Student Demo Session</span>
              <span className="text-slate-400 text-[11px]">Instant access as Saurav (Lv. 07)</span>
            </div>
            <button
              onClick={handleQuickDemo}
              className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors"
            >
              One-Click Demo
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-[#0e172a] px-2 text-[11px] font-mono text-slate-400 uppercase">
              Or university credentials
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Full Student Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Saurav Mukherjee"
                  className="w-full px-3.5 py-2 text-xs bg-[#0a0f1d] border border-slate-700/80 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Institutional Email (.edu or campus domain)
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full pl-9 pr-3.5 py-2 text-xs bg-[#0a0f1d] border border-slate-700/80 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Password or SSO Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  defaultValue="••••••••••••"
                  className="w-full pl-9 pr-3.5 py-2 text-xs bg-[#0a0f1d] border border-slate-700/80 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {isSignUp && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Student ID
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={e => setStudentId(e.target.value)}
                    placeholder="STU-2024-8842"
                    className="w-full px-3 py-2 text-xs bg-[#0a0f1d] border border-slate-700/80 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Institution
                  </label>
                  <input
                    type="text"
                    value={institution}
                    onChange={e => setInstitution(e.target.value)}
                    placeholder="State Tech"
                    className="w-full px-3 py-2 text-xs bg-[#0a0f1d] border border-slate-700/80 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>{isSignUp ? 'Complete Registration' : 'Sign In with University ID'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              {isSignUp ? 'Already have an account? Sign in' : 'New student? Create your profile'}
            </button>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => onNavigate('landing')}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            ← Back to Framework Overview
          </button>
        </div>
      </div>
    </div>
  );
};
