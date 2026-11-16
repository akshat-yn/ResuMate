import React, { useState } from 'react';
import { User, Mail, Briefcase, Check, Cpu, Key, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GeminiService } from '../services/geminiService';

export default function ProfileSettingsPage() {
  const { user, updateProfileState } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [targetRole, setTargetRole] = useState(user?.target_role || 'Software Engineer');
  const [experienceLevel, setExperienceLevel] = useState(user?.experience_level || 'Mid Level (3-6 yrs)');
  const [geminiKey, setGeminiKey] = useState(GeminiService.getApiKey());
  const [geminiModel, setGeminiModel] = useState(GeminiService.getModel());
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfileState({
      full_name: fullName,
      target_role: targetRole,
      experience_level: experienceLevel,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSaveAiSettings = (e) => {
    e.preventDefault();
    GeminiService.setApiKey(geminiKey);
    GeminiService.setModel(geminiModel);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const isAiActive = Boolean(geminiKey.trim());

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          User Profile & AI Configuration
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your candidate targets, personal preferences, and optional Google Gemini AI key.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-xs">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Form: Profile Details */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6 transition-colors">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Candidate Profile
          </h2>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  disabled
                  value={user?.email || 'demo@resumate.io'}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Role</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. Lead Full Stack Architect"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Seniority Level
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                >
                  <option value="Student / Fresher">Student / Fresher</option>
                  <option value="Entry Level (0-2 yrs)">Entry Level (0-2 yrs)</option>
                  <option value="Mid Level (3-6 yrs)">Mid Level (3-6 yrs)</option>
                  <option value="Senior Level (7+ yrs)">Senior Level (7+ yrs)</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md shadow-brand-600/20 transition-all"
              >
                Save Profile Changes
              </button>
            </div>
          </form>

          {/* AI Settings Form */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Google Gemini API Key (Optional)
              </h2>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isAiActive
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                }`}
              >
                {isAiActive ? 'Live Gemini AI Active' : 'Built-in Engine Mode'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              ResuMate works out-of-the-box using its built-in ATS scoring engine. If you want direct live Gemini generation, add your API key here. It is stored securely in your browser's local storage.
            </p>

            <form onSubmit={handleSaveAiSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Gemini API Key
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Gemini Model
                </label>
                <select
                  value={geminiModel}
                  onChange={(e) => setGeminiModel(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                >
                  <option value="gemini-2.5-flash">gemini-2.5-flash (Fast & recommended)</option>
                  <option value="gemini-1.5-flash">gemini-1.5-flash</option>
                  <option value="gemini-1.5-pro">gemini-1.5-pro (High reasoning)</option>
                </select>
              </div>

              <div>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold text-xs shadow-md transition-all"
                >
                  Save AI Settings
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Info Box */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 text-xs transition-colors">
            <div className="flex items-center gap-2 text-brand-700 dark:text-brand-400 font-bold uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              <span>Engine Status</span>
            </div>

            <div className="space-y-2.5 text-slate-600 dark:text-slate-400 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span>Engine:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">ResuMate ATS Matrix</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span>Data Privacy:</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">Local Device Sandbox</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span>Storage:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Browser Storage</span>
              </div>
              <div className="flex items-center justify-between">
                <span>ATS Rules:</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">Active (6 Pillars)</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs text-xs space-y-2 transition-colors">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">Confidentiality Guarantee</span>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
              Uploaded resumes are processed directly inside your browser memory. Your documents never touch external servers unless you connect your own Gemini API key.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
