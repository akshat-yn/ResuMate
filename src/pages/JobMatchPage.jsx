import React, { useState } from 'react';
import { Briefcase, Sparkles, ArrowRight, CheckCircle2, AlertCircle, Loader2, Target, Key } from 'lucide-react';
import ScoreGauge from '../components/ScoreGauge';
import SkillBadges from '../components/SkillBadges';
import { GeminiService } from '../services/geminiService';

export default function JobMatchPage({ activeAnalysis, onNavigate }) {
  const [jobTitle, setJobTitle] = useState('Senior Full Stack Engineer');
  const [jobDescription, setJobDescription] = useState('');
  const [isMatching, setIsMatching] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [error, setError] = useState(null);

  const sampleJob = `We are looking for an experienced Senior Full Stack Software Engineer to join our core product team.

Responsibilities:
• Architect, design, and build scalable REST APIs using Python, FastAPI, and PostgreSQL.
• Develop responsive client web applications with modern frontend technologies, TypeScript, and Tailwind CSS.
• Deploy microservices into containerized environments with Docker and AWS Kubernetes (EKS).
• Set up Redis caching layers to improve real-time query latencies.
• Implement automated unit testing and end-to-end CI/CD workflows using GitHub Actions.

Requirements:
• 4+ years of professional software engineering experience.
• Strong proficiency in Python, SQL, C++, and Git.
• Hands-on experience with Docker, Redis, and Cloud platforms (AWS or GCP).
• Familiarity with microservice architectures, system design, and performance profiling.`;

  const handleMatch = async () => {
    setError(null);
    if (!jobDescription.trim() || jobDescription.length < 30) {
      setError('Please enter or paste a valid job description (at least 30 characters).');
      return;
    }

    setIsMatching(true);
    try {
      const resumeText = activeAnalysis?.parsed_data?.work_experience
        ? JSON.stringify(activeAnalysis.parsed_data)
        : 'Senior Full Stack Software Engineer with skills in Python, SQL, C++, Git, and Docker.';

      const res = await GeminiService.matchJob(resumeText, jobDescription, jobTitle);
      setMatchResult(res);
    } catch (err) {
      setError(err.message || 'Failed to match resume with job description.');
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Job Description Matching & Skill Gap
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Compare your resume directly against an employer's vacancy description to discover your match score, missing skills, and targeted keywords.
          </p>
        </div>

        <button
          onClick={() => {
            setJobTitle('Senior Full Stack Software Engineer');
            setJobDescription(sampleJob);
          }}
          className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Insert Sample Job Description</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Target Job Title
          </label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Senior Backend Engineer"
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Job Description / Requirements
          </label>
          <textarea
            rows={8}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the complete job description, required responsibilities, and qualifications..."
            className="w-full p-3.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 leading-relaxed font-mono"
          />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Comparing against: <strong>{activeAnalysis?.filename || 'Active Resume Profile'}</strong>
          </span>

          <button
            onClick={handleMatch}
            disabled={isMatching || !jobDescription.trim()}
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md shadow-brand-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isMatching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Comparing skills...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Calculate Match Score</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {matchResult && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 sm:p-8 transition-colors">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 pb-6 md:pb-0 md:pr-6">
                <ScoreGauge score={matchResult.match_score} size={170} strokeWidth={13} />
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-2">Job Relevancy Match</span>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Target Role Alignment: {matchResult.job_title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                    Your skills match <strong>{Math.round(matchResult.match_score)}%</strong> of the stated requirements. Address the missing skills and keywords below to maximize your interview conversion rate.
                  </p>
                </div>

                {matchResult.tailored_summary_suggestion && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-brand-50 dark:from-slate-800/80 dark:to-indigo-950/40 border border-brand-100 dark:border-brand-900/60 text-xs">
                    <span className="font-bold text-brand-900 dark:text-brand-300 block mb-1">
                      💡 AI-Tailored Professional Summary Recommendation:
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">
                      "{matchResult.tailored_summary_suggestion}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-emerald-200/80 dark:border-emerald-900/50 shadow-xs p-6">
              <div className="flex items-center gap-2 mb-4 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Matching Skills ({matchResult.matching_skills?.length || 0})</span>
              </div>
              <SkillBadges
                skills={matchResult.matching_skills || []}
                variant="success"
                emptyMessage="No direct matching skills detected."
              />
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-rose-200/80 dark:border-rose-900/50 shadow-xs p-6">
              <div className="flex items-center gap-2 mb-4 text-rose-800 dark:text-rose-300 font-bold text-xs">
                <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                <span>Missing Required Skills ({matchResult.missing_skills?.length || 0})</span>
              </div>
              <SkillBadges
                skills={matchResult.missing_skills || []}
                variant="danger"
                emptyMessage="Awesome! No critical skills missing from this posting."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6">
              <div className="flex items-center gap-2 mb-3 text-brand-800 dark:text-brand-300 font-bold text-xs">
                <Key className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <span>Missing High-Yield ATS Keywords</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Incorporate these specific phrases into your bullet points:
              </p>
              <div className="flex flex-wrap gap-2">
                {(matchResult.missing_keywords || []).map((kw, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                  >
                    + {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6">
              <div className="flex items-center gap-2 mb-3 text-slate-800 dark:text-slate-200 font-bold text-xs">
                <Target className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <span>Experience Alignment Suggestions</span>
              </div>
              <ul className="space-y-2.5">
                {(matchResult.experience_alignment_tips || []).map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <span className="text-brand-600 dark:text-brand-400 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
