import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Target,
  FileCheck2,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Award
} from 'lucide-react';
import ScoreGauge from '../components/ScoreGauge';

export default function LandingPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-brand-100/40 dark:from-brand-950/20 via-purple-50/20 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen ATS Compatibility Engine & Career Suite</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] mb-6">
              Land 3x More Interviews With{' '}
              <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ResuMate
              </span>{' '}
              AI Optimization
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
              Analyze your resume against real recruiter ATS filters in seconds. Get precise 0–100 compatibility scores, identify missing skills, compare against job descriptions, and turn basic bullet points into high-impact accomplishments.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('upload')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-lg shadow-brand-600/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <span>Analyze Your Resume Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('login')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm border border-slate-200 dark:border-slate-800 shadow-xs transition-colors"
              >
                Explore Live Demo
              </button>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Transparent 6-Pillar ATS Engine
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-brand-600" /> 100% In-Memory Privacy
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-600" /> Never Hallucinates Experience
              </span>
            </div>
          </div>

          {/* Interactive Preview Card */}
          <div className="mt-14 max-w-4xl mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl p-6 sm:p-8 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 ml-2">Sample Executive Resume Report</span>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Score: 88/100
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <ScoreGauge score={88} size={150} strokeWidth={12} />
              </div>

              <div className="md:col-span-2 space-y-3.5">
                <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Key Strength</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    Outstanding measurable impact: 4 quantifiable metrics detected (e.g., 'reduced API query latency by 42%').
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300 mb-1">
                    <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Improvement Opportunity</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    Replace passive phrasing ('helped manage', 'responsible for') with power verbs ('engineered', 'orchestrated').
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    Skills: 23/25
                  </span>
                  <span className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    Experience: 18/20
                  </span>
                  <span className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    Keywords: 17/20
                  </span>
                  <span className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    Structure: 15/15
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audiences Grid */}
      <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Designed For Every Stage of Your Career
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              Whether you're breaking into tech, climbing the corporate ladder, or hiring top talent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                title: 'Students & Freshers',
                desc: 'Bridge academic projects into corporate keywords and highlight relevant coursework.',
                icon: Award,
              },
              {
                title: 'Job Seekers',
                desc: 'Optimize keywords for specific job descriptions and pass automated applicant filters.',
                icon: Target,
              },
              {
                title: 'Experienced Pros',
                desc: 'Highlight leadership accomplishments, executive action verbs, and business impact.',
                icon: TrendingUp,
              },
              {
                title: 'Recruiters & Mentors',
                desc: 'Instantly evaluate candidate resumes and generate structured PDF reports.',
                icon: Briefcase,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Feature Pillars */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              A Complete AI Career Suite
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              Every tool you need to optimize and stand out in the applicant tracking system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">ATS Compatibility Engine</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Transparent 6-category scoring: skills relevance, experience quality, keyword density, structure, readability, and education.
              </p>
              <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 flex items-center gap-1">
                Rule-Based + AI Validation
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Job Description Matcher</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Paste any job vacancy to see exactly which skills match (green) and which skills or keywords are missing (red).
              </p>
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                Keyword & Skill Gap Analysis
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">AI Bullet Point Improver</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Transform mundane job duties into STAR-method achievements with executive verbs, without fabricating fake experiences.
              </p>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                Side-by-Side Comparison
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 py-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">ResuMate</span>
            <span>• Smart Resume Analyzer & ATS Optimizer</span>
          </div>
          <p>© {new Date().getFullYear()} ResuMate Inc. Built for modern job seekers.</p>
        </div>
      </footer>
    </div>
  );
}
