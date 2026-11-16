import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  Briefcase,
  Wand2,
  FileCheck2,
  ArrowRight,
  Sparkles,
  Clock,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { HistoryService } from '../services/historyService';
import ScoreGauge from '../components/ScoreGauge';

export default function Dashboard({ onNavigate, activeAnalysis, onSelectAnalysis }) {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(HistoryService.getAll());
  }, [activeAnalysis]);

  const latest = activeAnalysis || history[0];
  const latestScore = latest?.overall_score ?? 84;
  const latestFilename = latest?.filename ?? 'Sample Resume';

  const chartData = [
    { name: 'Skills', score: latest?.category_scores?.skills_relevance ?? 22, max: 25 },
    { name: 'Experience', score: latest?.category_scores?.experience_quality ?? 17, max: 20 },
    { name: 'Keywords', score: latest?.category_scores?.keyword_optimization ?? 16, max: 20 },
    { name: 'Structure', score: latest?.category_scores?.resume_structure ?? 14, max: 15 },
    { name: 'Readability', score: latest?.category_scores?.readability ?? 8, max: 10 },
    { name: 'Education', score: latest?.category_scores?.education_relevance ?? 9, max: 10 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-navy-800 to-indigo-950 p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-brand-500/25 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-200 text-xs font-semibold mb-3 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>ResuMate AI Strategist Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.full_name || 'Professional'}!
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
            Targeting: <span className="text-white font-semibold">{user?.target_role || 'Software Engineer'}</span>.
            Your ATS compatibility is calibrated to pass executive applicant tracking screeners.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('upload')}
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/30 transition-all flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload New Resume</span>
            </button>
            <button
              onClick={() => onNavigate('job-match')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm transition-colors flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              <span>Match With Job Vacancy</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: ATS Overview & Breakdown Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: ATS Compatibility Gauge */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Latest ATS Compatibility
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-semibold truncate max-w-[140px] border border-brand-200/60 dark:border-brand-800/60">
                {latestFilename}
              </span>
            </div>
            <div className="py-2">
              <ScoreGauge score={latestScore} size={160} strokeWidth={13} />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Based on 6 weighted categories</span>
            <button
              onClick={() => {
                if (latest) onSelectAnalysis(latest);
                onNavigate('results');
              }}
              className="text-brand-600 dark:text-brand-400 font-bold hover:underline flex items-center gap-1"
            >
              <span>Full Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: 6-Category Bar Distribution Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Category Performance vs Max Weight
                </h2>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                  Evaluated across skills, experience, keywords, structure, readability & education
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span className="inline-block w-3 h-3 rounded-sm bg-brand-600" /> Current Score
              </div>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} domain={[0, 25]} />
                  <Tooltip
                    formatter={(val, name, props) => [`${val} / ${props.payload.max} pts`, 'Score']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                  />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.score / entry.max >= 0.8 ? '#4F46E5' : '#F59E0B'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Formula: Skills (25) + Exp (20) + Keywords (20) + Struct (15) + Read (10) + Edu (10)</span>
            <button
              onClick={() => {
                if (latest) onSelectAnalysis(latest);
                onNavigate('results');
              }}
              className="text-brand-600 dark:text-brand-400 font-semibold hover:underline"
            >
              Inspect Weaknesses
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigate('job-match')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition-all text-left flex items-start justify-between group"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              Job Description Match
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Compare your resume against a target job posting to find matching and missing skills.
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-brand-600 dark:group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
        </button>

        <button
          onClick={() => onNavigate('improver')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition-all text-left flex items-start justify-between group"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
              <Wand2 className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              AI Bullet Point Improver
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Rewrite passive duty descriptions into high-impact STAR-method accomplishments.
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-brand-600 dark:group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
        </button>

        <button
          onClick={() => onNavigate('history')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition-all text-left flex items-start justify-between group"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              Version History & Compare
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Review past analyses and compare two resume versions to track your score gains.
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-brand-600 dark:group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
        </button>
      </div>

      {/* Recent Analyses Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Recent Analyses
            </h3>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
          >
            View All History
          </button>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No previous resumes uploaded yet. Upload your first resume to see your score report!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold uppercase">
                  <th className="py-2.5 px-3">Resume Document</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">ATS Score</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {history.slice(0, 4).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                      <span>{item.filename}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-xs ${
                          item.overall_score >= 80
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : item.overall_score >= 60
                            ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                            : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                        }`}
                      >
                        {Math.round(item.overall_score)}/100
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          onSelectAnalysis(item);
                          onNavigate('results');
                        }}
                        className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 hover:underline"
                      >
                        View Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
