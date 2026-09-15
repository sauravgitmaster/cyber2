import React, { useState } from 'react';
import { ActivePage, UserProfile } from '../types';
import { Shield, Lock, Mail, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { ByteMascot } from '../components/common/ByteMascot';

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
    setUser((prev) => ({
      ...prev,
      name: fullName || 'Saurav',
      email: email || 'saurav.m@school.edu',
      studentId: studentId || 'STU-2024-8842',
      institution: institution || 'Greenwood Middle School',
    }));
    onNavigate('dashboard');
  };

  const handleQuickDemo = () => {
    setUser((prev) => ({
      ...prev,
      name: 'Saurav',
      email: 'saurav.m@school.edu',
      studentId: 'STU-2024-8842',
      institution: 'Greenwood Middle School',
    }));
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col justify-center items-center px-4 py-12 text-[#243047] font-sans">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex justify-center mb-1">
            <ByteMascot mood="happy" size="lg" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#243047]">
            {isSignUp ? 'Join the Cyber Adventure!' : 'Welcome Back, Explorer!'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Sign in to track your Cyber Smart Score and earn badges with Byte.
          </p>
        </div>

        {/* Auth Form Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
          {/* Quick Demo Login Pill */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex items-center justify-between">
            <div className="text-xs">
              <span className="font-black text-[#243047] block">Student Quick-Start</span>
              <span className="text-slate-500 font-medium">Instant test session as Saurav (Lv. 07)</span>
            </div>
            <button
              onClick={handleQuickDemo}
              className="px-3.5 py-1.5 rounded-xl bg-[#4F7CFF] hover:bg-[#3D6CE6] text-white font-black text-xs transition-colors shadow-2xs"
            >
              Start Demo
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase">
              Or student account
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-[#243047] font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#4F7CFF] focus:bg-white transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Student Email (.edu or school domain)
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@school.edu"
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-[#243047] font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#4F7CFF] focus:bg-white transition-colors"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Secret Passphrase
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  defaultValue="••••••••••••"
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-[#243047] font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#4F7CFF] focus:bg-white transition-colors"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {isSignUp && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Student ID
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="STU-2024-8842"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-[#243047] font-medium focus:outline-none focus:border-[#4F7CFF] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    School / Class
                  </label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="Middle School"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-[#243047] font-medium focus:outline-none focus:border-[#4F7CFF] focus:bg-white"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#4F7CFF] hover:bg-[#3D6CE6] text-white font-black text-xs transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <span>{isSignUp ? 'Create My Account' : 'Sign In to My Adventures'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-[#4F7CFF] hover:underline font-bold transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : 'New explorer? Create your student passport'}
            </button>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => onNavigate('landing')}
            className="text-xs text-slate-500 hover:text-slate-800 font-bold transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
