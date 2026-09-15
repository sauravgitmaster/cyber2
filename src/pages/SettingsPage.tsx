import React, { useState } from 'react';
import { ActivePage, UserProfile } from '../types';
import {
  Settings,
  Shield,
  Bell,
  Sliders,
  RotateCcw,
  Check,
  Save,
  Moon,
  Lock,
} from 'lucide-react';

interface SettingsPageProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  onResetData: () => void;
  onNavigate: (page: ActivePage) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  user,
  setUser,
  onResetData,
  onNavigate,
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [institution, setInstitution] = useState(user.institution);
  const [major, setMajor] = useState(user.major);

  const [mfaReminders, setMfaReminders] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [drillDifficulty, setDrillDifficulty] = useState('Adaptive');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      name,
      email,
      institution,
      major,
    }));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto text-slate-100 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">
              CONFIGURATIONS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Settings & Preferences
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your student profile, educational simulator difficulty, and privacy controls.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3.5 py-1.5 rounded-lg bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs font-mono flex items-center gap-1.5">
            <Check className="w-4 h-4" />
            <span>Preferences saved</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Details */}
        <div className="p-6 rounded-2xl bg-[#0e172a] border border-slate-800 shadow-xl space-y-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span>Student Identity & Institution</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Student Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#0a0f1d] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                University Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#0a0f1d] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
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
                className="w-full px-3 py-2 text-xs bg-[#0a0f1d] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Major / Program
              </label>
              <input
                type="text"
                value={major}
                onChange={e => setMajor(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#0a0f1d] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Simulation Preferences */}
        <div className="p-6 rounded-2xl bg-[#0e172a] border border-slate-800 shadow-xl space-y-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-400" />
            <span>Simulator Rigor & Guidance</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0a0f1d] border border-slate-800">
              <div>
                <span className="font-semibold text-white block">Drill Difficulty Calibration</span>
                <span className="text-slate-400 text-[11px]">
                  Automatically adjusts scenario deception subtlety based on your Trust Score.
                </span>
              </div>
              <select
                value={drillDifficulty}
                onChange={e => setDrillDifficulty(e.target.value)}
                className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded text-slate-200 text-xs font-mono"
              >
                <option value="Adaptive">Adaptive (Recommended)</option>
                <option value="Beginner">Beginner (Explicit Clues)</option>
                <option value="Advanced">Advanced (Subtle Indicators)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0a0f1d] border border-slate-800">
              <div>
                <span className="font-semibold text-white block">Immediate AI Debrief</span>
                <span className="text-slate-400 text-[11px]">
                  Open comprehensive technical feedback automatically after committing a decision.
                </span>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 accent-blue-600 rounded"
              />
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="p-6 rounded-2xl bg-[#0e172a] border border-slate-800 shadow-xl space-y-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-400" />
            <span>Notification & Reminders</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0a0f1d] border border-slate-800">
              <div>
                <span className="font-semibold text-white block">Weekly Trust Score Digest</span>
                <span className="text-slate-400 text-[11px]">
                  Receive weekly summary of score changes and recommended modules.
                </span>
              </div>
              <input
                type="checkbox"
                checked={weeklyDigest}
                onChange={e => setWeeklyDigest(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0a0f1d] border border-slate-800">
              <div>
                <span className="font-semibold text-white block">MFA Push Drill Reminders</span>
                <span className="text-slate-400 text-[11px]">
                  Simulate surprise push prompts to build vigilance against MFA fatigue.
                </span>
              </div>
              <input
                type="checkbox"
                checked={mfaReminders}
                onChange={e => setMfaReminders(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors flex items-center gap-2 shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>

      {/* Danger Zone: Reset Data */}
      <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-3">
        <h3 className="text-sm font-semibold text-rose-300">Data Management</h3>
        <p className="text-xs text-slate-400">
          Reset local student session progress, restore baseline Trust Score (0), and reset module progress.
        </p>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset your local student state?')) {
              onResetData();
            }
          }}
          className="px-3.5 py-1.5 rounded-lg bg-rose-900/40 hover:bg-rose-900/60 border border-rose-700 text-rose-200 text-xs font-mono transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Student State</span>
        </button>
      </div>
    </div>
  );
};
