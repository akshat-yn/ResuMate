import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  UploadCloud,
  FileCheck2,
  Briefcase,
  Wand2,
  History,
  Settings,
  Sparkles,
  ShieldCheck,
  X,
  Menu
} from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'upload', label: 'Upload & Parse', icon: UploadCloud },
  { id: 'results', label: 'Analysis Report', icon: FileCheck2 },
  { id: 'job-match', label: 'Job Match', icon: Briefcase },
  { id: 'improver', label: 'AI Improver', icon: Wand2, highlight: true },
  { id: 'history', label: 'History', icon: History },
  { id: 'profile', label: 'Settings', icon: Settings },
];

// Desktop sidebar (hidden on mobile)
function DesktopSidebar({ currentPage, onNavigate, hasActiveAnalysis }) {
  return (
    <aside className="w-64 border-r border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 h-[calc(100vh-4rem)] sticky top-16 hidden lg:flex flex-col justify-between p-4 shadow-sm transition-colors duration-200">
      <div className="space-y-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 mb-2">
            Workspace
          </p>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              const badge = item.id === 'results' && hasActiveAnalysis ? 'Active' : null;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span>{item.id === 'upload' ? 'Upload & Parse' : item.id === 'results' ? 'Analysis Report' : item.id === 'job-match' ? 'Job Description Match' : item.id === 'improver' ? 'AI Bullet Improver' : item.id === 'profile' ? 'Profile & Settings' : item.label}</span>
                  </div>
                  {badge && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {badge}
                    </span>
                  )}
                  {item.highlight && !badge && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                      AI
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800/60 dark:to-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-slate-800 dark:text-slate-200">
          <div className="flex items-center gap-2 mb-1.5 text-brand-700 dark:text-brand-400 font-bold text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ATS Optimization Tip</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
            Quantify at least 3 bullet points with numbers or percentages to boost your ATS Experience score by up to 20%.
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 px-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>ATS Engine v2.5 Active</span>
        </div>
      </div>
    </aside>
  );
}

// Mobile drawer (slide-in from left)
function MobileDrawer({ isOpen, onClose, currentPage, onNavigate, hasActiveAnalysis }) {
  // Close on ESC key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 shadow-2xl flex flex-col lg:hidden transition-transform duration-300">
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
              Resu<span className="text-brand-600 dark:text-brand-400">Mate</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 mb-3">
            Workspace
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            const badge = item.id === 'results' && hasActiveAnalysis ? 'Active' : null;
            const fullLabels = {
              'upload': 'Upload & Parse',
              'results': 'Analysis Report',
              'job-match': 'Job Description Match',
              'improver': 'AI Bullet Improver',
              'profile': 'Profile & Settings',
            };
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); onClose(); }}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{fullLabels[item.id] || item.label}</span>
                </div>
                {badge && (
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {badge}
                  </span>
                )}
                {item.highlight && !badge && (
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Drawer footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800/60 dark:to-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
            <div className="flex items-center gap-2 text-brand-700 dark:text-brand-400 font-bold text-xs mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ATS Tip</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Quantify bullet points with numbers to boost your ATS score by up to 20%.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 px-1 mt-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>ATS Engine v2.5 Active</span>
          </div>
        </div>
      </div>
    </>
  );
}

// Mobile bottom navigation bar (5 key tabs, visible < lg)
function MobileBottomNav({ currentPage, onNavigate, hasActiveAnalysis }) {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload', icon: UploadCloud },
    { id: 'results', label: 'Report', icon: FileCheck2 },
    { id: 'job-match', label: 'Match', icon: Briefcase },
    { id: 'improver', label: 'Improve', icon: Wand2 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 flex safe-bottom">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentPage === tab.id;
        const hasNotif = tab.id === 'results' && hasActiveAnalysis;
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 relative transition-colors ${
              isActive
                ? 'text-brand-600 dark:text-brand-400'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {hasNotif && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              )}
              {tab.id === 'improver' && !hasNotif && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-purple-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </div>
            <span className={`text-[10px] font-semibold leading-none ${isActive ? 'text-brand-600 dark:text-brand-400' : ''}`}>
              {tab.label}
            </span>
            {isActive && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-brand-600 dark:bg-brand-400" />
            )}
          </button>
        );
      })}
    </nav>
  );
}

export default function Sidebar({ currentPage, onNavigate, hasActiveAnalysis, onToggleMobileMenu, isMobileMenuOpen }) {
  return (
    <>
      <DesktopSidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
        hasActiveAnalysis={hasActiveAnalysis}
      />
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => onToggleMobileMenu(false)}
        currentPage={currentPage}
        onNavigate={onNavigate}
        hasActiveAnalysis={hasActiveAnalysis}
      />
      <MobileBottomNav
        currentPage={currentPage}
        onNavigate={onNavigate}
        hasActiveAnalysis={hasActiveAnalysis}
      />
    </>
  );
}
