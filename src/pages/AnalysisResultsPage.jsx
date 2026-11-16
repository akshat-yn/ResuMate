import React, { useState } from 'react';
import {
  Download,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Info,
  ArrowRight
} from 'lucide-react';
import ScoreGauge from '../components/ScoreGauge';
import CategoryBreakdown from '../components/CategoryBreakdown';
import SkillBadges from '../components/SkillBadges';
import { downloadAnalysisPdf } from '../services/pdfExport';

export default function AnalysisResultsPage({ analysis, onNavigate }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [downloading, setDownloading] = useState(false);

  if (!analysis) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-xl mx-auto space-y-4 transition-colors">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
          <Info className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">No Active Analysis Report</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Please upload or select a resume from your history to view its full ATS analysis report.
        </p>
        <button
          onClick={() => onNavigate('upload')}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition-all shadow-sm"
        >
          Go to Upload Page
        </button>
      </div>
    );
  }

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadAnalysisPdf(analysis, analysis.parsed_data?.personal_info?.name || 'Applicant');
    } finally {
      setDownloading(false);
    }
  };

  const parsed = analysis.parsed_data || {};
  const personal = parsed.personal_info || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded border border-brand-200/60 dark:border-brand-800/60">
              Report Generated
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {new Date(analysis.created_at).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>{personal.name || analysis.filename}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            File: <strong>{analysis.filename}</strong> • Evaluated with ResuMate ATS Engine
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 shadow-xs transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>{downloading ? 'Exporting PDF...' : 'Download PDF Report'}</span>
          </button>

          <button
            onClick={() => onNavigate('job-match')}
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md shadow-brand-600/20 transition-all flex items-center gap-2"
          >
            <Briefcase className="w-4 h-4" />
            <span>Match Job Vacancy</span>
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3 text-slate-600 dark:text-slate-300 text-xs transition-colors">
        <Info className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>ATS Compatibility Notice:</strong> {analysis.disclaimer}
        </p>
      </div>

      {/* Main Score Hero Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 sm:p-8 transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 pb-6 md:pb-0 md:pr-6">
            <ScoreGauge score={analysis.overall_score} size={180} strokeWidth={14} />
          </div>

          <div className="md:col-span-2 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                Executive ATS Score Assessment
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Your resume scored <strong>{Math.round(analysis.overall_score)}/100</strong>. This score represents your document's readability, keyword optimization, quantifiable metrics, and structure when processed by modern Applicant Tracking Systems.
              </p>
            </div>

            {analysis.missing_sections && analysis.missing_sections.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Missing Essential Sections:</strong>{' '}
                  {analysis.missing_sections.join(', ')}. Adding these boosts parsing accuracy.
                </span>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                <span className="block text-base font-extrabold text-slate-800 dark:text-slate-100">
                  {parsed.technical_skills?.length || 0}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Tech Skills</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                <span className="block text-base font-extrabold text-slate-800 dark:text-slate-100">
                  {parsed.work_experience?.length || 0}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Work Roles</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                <span className="block text-base font-extrabold text-slate-800 dark:text-slate-100">
                  {analysis.strengths?.length || 0}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Key Strengths</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1">
        {[
          { id: 'overview', label: 'Score Pillars & Analysis' },
          { id: 'grammar', label: 'Action Verbs & Syntax' },
          { id: 'sections', label: 'Extracted Sections' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-t-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-slate-900 border-t border-x border-slate-200 dark:border-slate-800 text-brand-700 dark:text-brand-300 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Transparent 6-Category ATS Weighting
            </h3>
            <CategoryBreakdown scores={analysis.category_scores} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6">
              <div className="flex items-center gap-2 mb-4 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Identified Strengths ({analysis.strengths?.length || 0})</span>
              </div>
              <ul className="space-y-3">
                {(analysis.strengths || []).map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                      ✓
                    </span>
                    <span className="leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6">
              <div className="flex items-center gap-2 mb-4 text-rose-800 dark:text-rose-300 font-bold text-xs">
                <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                <span>Areas for Optimization ({analysis.weaknesses?.length || 0})</span>
              </div>
              <ul className="space-y-3">
                {(analysis.weaknesses || []).map((w, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <span className="w-4 h-4 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                      !
                    </span>
                    <span className="leading-relaxed">{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6">
            <div className="flex items-center gap-2 mb-4 text-brand-800 dark:text-brand-300 font-bold text-xs">
              <Sparkles className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <span>Strategic Action Recommendations</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(analysis.recommendations || []).map((r, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-3">
                  <span className="font-extrabold text-brand-600 dark:text-brand-400 text-sm">{idx + 1}.</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Action Verbs */}
      {activeTab === 'grammar' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Weak Verbs Detected & High-Impact Replacements
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Replace passive or overused verbs with active leadership phrasing.
                </p>
              </div>
              <button
                onClick={() => onNavigate('improver')}
                className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                <span>AI Rewriter</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {analysis.weak_verbs && analysis.weak_verbs.length > 0 ? (
              <div className="space-y-3">
                {analysis.weak_verbs.map((verb, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold uppercase text-[10px]">
                          Weak Verb: {verb.original_verb}
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">{verb.context}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-slate-500 dark:text-slate-400 font-semibold text-[11px]">Recommended:</span>
                      {verb.suggested_alternatives.map((alt, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold text-[11px]">
                          {alt}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl">
                ✓ No weak action verbs detected. Your descriptions maintain an active executive voice!
              </p>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Extracted Sections */}
      {activeTab === 'sections' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Parsed Skills & Competencies</h3>
            <SkillBadges
              title="Technical Skills"
              skills={parsed.technical_skills || []}
              variant="neutral"
            />
            <SkillBadges
              title="Soft Skills"
              skills={parsed.soft_skills || []}
              variant="preferred"
            />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Work History Items</h3>
            {(parsed.work_experience || []).map((exp, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                    {exp.role || 'Position'} • <span className="text-brand-600 dark:text-brand-400">{exp.company}</span>
                  </h4>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">{exp.duration}</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 pl-1">
                  {(exp.bullet_points || []).map((b, bIdx) => (
                    <li key={bIdx} className="leading-relaxed">{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
