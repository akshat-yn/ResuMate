import React, { useState } from 'react';
import {
  Wand2,
  Sparkles,
  Copy,
  Check,
  Award,
  Loader2,
  Lightbulb
} from 'lucide-react';
import { GeminiService } from '../services/geminiService';

const SAMPLE_BULLETS = [
  {
    type: 'bullet_point',
    label: 'Backend Developer (Passive duty)',
    text: 'Helped build backend APIs and worked with database tables for our web application.',
  },
  {
    type: 'bullet_point',
    label: 'Frontend Developer (Vague metric)',
    text: 'Responsible for making website faster and fixing bugs reported by users.',
  },
  {
    type: 'summary',
    label: 'General Summary (Generic)',
    text: 'Hardworking software engineer with good experience in coding and looking for a challenging role in tech.',
  },
];

export default function ResumeImproverPage() {
  const [sectionType, setSectionType] = useState('bullet_point');
  const [originalText, setOriginalText] = useState(SAMPLE_BULLETS[0].text);
  const [targetRole, setTargetRole] = useState('Senior Software Engineer');
  const [jobDescription, setJobDescription] = useState('');
  const [isImproving, setIsImproving] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const handleImprove = async () => {
    setError(null);
    if (!originalText.trim() || originalText.length < 5) {
      setError('Please provide text to rewrite.');
      return;
    }

    setIsImproving(true);
    try {
      const res = await GeminiService.improveContent(
        sectionType,
        originalText,
        targetRole,
        jobDescription || undefined
      );
      setResult(res);
    } catch (err) {
      setError(err.message || 'Failed to rewrite text.');
    } finally {
      setIsImproving(false);
    }
  };

  const copyToClipboard = () => {
    if (!result?.improved_text) return;
    navigator.clipboard.writeText(result.improved_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Resume Bullet Point & Summary Improver
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Transform passive responsibilities into impactful, executive STAR accomplishments with power action verbs.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold self-start sm:self-auto">
          <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Hallucination-Free Guarantee</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            {[
              { id: 'bullet_point', label: 'Work Experience Bullet' },
              { id: 'summary', label: 'Professional Summary' },
              { id: 'project', label: 'Project Description' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSectionType(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  sectionType === t.id
                    ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 dark:text-slate-500 text-[11px]">Quick Samples:</span>
            {SAMPLE_BULLETS.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSectionType(sample.type);
                  setOriginalText(sample.text);
                }}
                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-medium"
              >
                #{idx + 1}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Original Resume Text
          </label>
          <textarea
            rows={4}
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            placeholder="e.g. Worked on the backend APIs and helped optimize database queries..."
            className="w-full p-3.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 leading-relaxed font-mono"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Target Position Title
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Staff Backend Engineer"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Optional Job Vacancy Keywords
            </label>
            <input
              type="text"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="e.g. Docker, Redis, high throughput, AWS"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        {error && (
          <p className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-lg border border-rose-200 dark:border-rose-900">
            {error}
          </p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Adheres to strict STAR methodology (Situation, Task, Action, Result)</span>
          </div>

          <button
            onClick={handleImprove}
            disabled={isImproving || !originalText.trim()}
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md shadow-brand-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isImproving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Enhancing bullet point...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Rewrite with Action Verbs</span>
              </>
            )}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 sm:p-8 space-y-6 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <span>Side-by-Side Comparison</span>
            </h3>

            <button
              onClick={copyToClipboard}
              className="px-3.5 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100 dark:hover:bg-brand-900/60 text-brand-700 dark:text-brand-300 font-semibold text-xs transition-colors flex items-center gap-1.5 border border-brand-200/60 dark:border-brand-800/60"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-700 dark:text-emerald-300">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Improved Version</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">
                  Original Version
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
                  "{result.original_text}"
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/80 text-[10px] text-slate-500 dark:text-slate-400 italic">
                Notice: Passive duty phrasing and missing quantifiable business outcome.
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                    AI-Enhanced Version (Executive)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    High ATS Weight
                  </span>
                </div>
                <p className="text-xs text-slate-900 dark:text-slate-100 leading-relaxed font-medium">
                  "{result.improved_text}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-200/70 dark:border-emerald-800/60 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Power Verbs:</span>
                {(result.action_verbs_used || []).map((v, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {result.key_improvements && result.key_improvements.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">Why this rewrite performs better:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 pl-1 text-[11px]">
                {result.key_improvements.map((imp, idx) => (
                  <li key={idx}>{imp}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
