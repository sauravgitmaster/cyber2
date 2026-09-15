import React, { useState } from 'react';
import { ActivePage, UserProfile } from '../types';
import { ArrowRight, LogIn, Sparkles, Mail, Lock, User as UserIcon, AlertCircle } from 'lucide-react';
import { ByteMascot } from '../components/common/ByteMascot';
import { AvatarUploader } from '../components/common/AvatarUploader';

interface AuthPageProps {
  onNavigate: (page: ActivePage) => void;
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  onAuthSuccess?: (user: UserProfile, isFirstTime: boolean) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onNavigate,
  user,
  setUser,
  onAuthSuccess,
}) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [name, setName] = useState(user.name === 'Alex Rivera' ? '' : user.name);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(user.avatar || '🤖');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/login';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || 'Cyber Explorer',
          email: email.trim(),
          password,
          avatar,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      const updatedUser: UserProfile = {
        ...user,
        name: data.user.name || name || 'Cyber Explorer',
        email: data.user.email || email,
        avatar: data.user.avatar || avatar,
        level: data.user.level || 1,
        levelTitle: data.user.levelTitle || 'Rookie',
        digitalTrustScore: data.user.digitalTrustScore || 70,
        currentXP: data.user.currentXP || 100,
        streakDays: data.user.streakDays || 1,
      };

      setUser(updatedUser);

      if (onAuthSuccess) {
        onAuthSuccess(updatedUser, isSignUp);
      } else {
        if (isSignUp) {
          // New user goes to Quick Cyber Check!
          onNavigate('skill-check');
        } else {
          onNavigate('dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    const demoUser: UserProfile = {
      ...user,
      name: 'Saurav',
      email: 'saurav@school.edu',
      avatar: '🤖',
      level: 4,
      levelTitle: 'Cyber Scout',
      digitalTrustScore: 78,
      currentXP: 420,
      streakDays: 4,
    };
    setUser(demoUser);
    if (onAuthSuccess) {
      onAuthSuccess(demoUser, false);
    } else {
      onNavigate('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col justify-center items-center px-4 py-10 text-[#243047] font-sans">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Mascot */}
        <div className="text-center space-y-2">
          <div className="inline-flex justify-center mb-1">
            <ByteMascot mood="happy" size="md" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#243047]">
            {isSignUp ? "Let's create your profile!" : 'Welcome Back!'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {isSignUp
              ? 'Get your personal cyber detective profile and track your score.'
              : 'Sign in to continue your missions with Byte.'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
          {/* Avatar Upload (Only on Sign Up) */}
          {isSignUp && (
            <div className="pb-2 flex flex-col items-center">
              <span className="text-xs font-black text-slate-500 mb-2">Pick your avatar (optional)</span>
              <AvatarUploader
                currentAvatar={avatar}
                onAvatarChange={(newAv) => setAvatar(newAv)}
                size="md"
              />
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isSignUp && (
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Name or Nickname
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex or DetectiveCyber"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-[#243047] font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#4F7CFF] focus:bg-white transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-[#243047] font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#4F7CFF] focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-[#243047] font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#4F7CFF] focus:bg-white transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-[#4F7CFF] hover:bg-[#3D6CE6] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 mt-2"
            >
              <span>{loading ? 'Please wait...' : isSignUp ? 'Create My Profile' : 'Log In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo button */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-medium">Just trying it out?</span>
            <button
              type="button"
              onClick={handleQuickDemo}
              className="text-xs text-[#4F7CFF] hover:underline font-black"
            >
              Try Demo Account →
            </button>
          </div>

          {/* Toggle Login/Sign Up */}
          <div className="pt-1 text-center">
            {isSignUp ? (
              <p className="text-xs text-slate-500 font-medium">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false);
                    setError(null);
                  }}
                  className="text-[#4F7CFF] font-black hover:underline"
                >
                  Log In
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-500 font-medium">
                New here?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setError(null);
                  }}
                  className="text-[#4F7CFF] font-black hover:underline"
                >
                  Create an account
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
