import React from 'react';
import { Sparkles, FileText, LogOut, ArrowRight, Sun, Moon, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ onNavigate, currentPage, onToggleMobileMenu }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isAuthOrLanding = ['landing', 'login', 'register'].includes(currentPage);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Left: Hamburger (mobile only, logged-in dashboard pages only) + Brand */}
        <div className="flex items-center gap-2">
          {user && !isAuthOrLanding && (
            <button
              onClick={() => onToggleMobileMenu(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mr-1"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Brand Logo - ResuMate */}
          <button
            onClick={() => onNavigate(user ? 'dashboard' : 'landing')}
            className="flex items-center gap-2.5 group text-left"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                  Resu<span className="text-brand-600 dark:text-brand-400">Mate</span>
                </span>
                <span className="hidden sm:inline text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/70 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                  AI
                </span>
              </div>
              <p className="hidden sm:block text-[10px] font-medium text-slate-400 dark:text-slate-400 leading-none">
                Smart ATS & Career Suite
              </p>
            </div>
          </button>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark / Light Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all border border-slate-200/60 dark:border-slate-700/80 flex items-center justify-center"
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-brand-600" />
            )}
          </button>

          {user ? (
            <>
              <button
                onClick={() => onNavigate('upload')}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-xs shadow-sm shadow-brand-600/30 transition-all hover:shadow"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Upload Resume</span>
                <span className="md:hidden">Upload</span>
              </button>

              {/* User avatar / profile */}
              <div className="flex items-center gap-2 pl-1 sm:pl-2 sm:border-l sm:border-slate-200 dark:sm:border-slate-800">
                <button
                  onClick={() => onNavigate('profile')}
                  className="flex items-center gap-2 px-1.5 sm:px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                  title="Profile & Settings"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-indigo-500 to-brand-700 text-white flex items-center justify-center text-xs font-bold uppercase shadow-inner">
                    {user.full_name ? user.full_name.charAt(0) : 'U'}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">{user.full_name}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-400 truncate max-w-[100px]">{user.target_role || 'Job Seeker'}</p>
                  </div>
                </button>

                <button
                  onClick={() => { logout(); onNavigate('landing'); }}
                  className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => onNavigate('login')}
                className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
