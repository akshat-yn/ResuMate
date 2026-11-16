import React from 'react';
import { motion } from 'framer-motion';

export default function CategoryBreakdown({ scores }) {
  if (!scores) return null;

  const categories = [
    {
      key: 'skills_relevance',
      label: 'Skills Relevance',
      max: 25,
      score: scores.skills_relevance || 0,
      description: 'Technical and soft skill coverage, context within experience, and variety.',
    },
    {
      key: 'experience_quality',
      label: 'Experience Quality',
      max: 20,
      score: scores.experience_quality || 0,
      description: 'Measurable accomplishments, power action verbs, and impact metrics.',
    },
    {
      key: 'keyword_optimization',
      label: 'Keyword Optimization',
      max: 20,
      score: scores.keyword_optimization || 0,
      description: 'ATS searchability, industry buzzwords, and balanced word density.',
    },
    {
      key: 'resume_structure',
      label: 'Resume Structure',
      max: 15,
      score: scores.resume_structure || 0,
      description: 'Presence of essential sections (Summary, Experience, Education, Skills).',
    },
    {
      key: 'readability',
      label: 'Readability & Layout',
      max: 10,
      score: scores.readability || 0,
      description: 'Bullet point usage, brevity, layout parseability, and white space.',
    },
    {
      key: 'education_relevance',
      label: 'Education Relevance',
      max: 10,
      score: scores.education_relevance || 0,
      description: 'Degrees, accreditation, graduation years, and relevant field of study.',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((cat, idx) => {
        const percentage = Math.round((cat.score / cat.max) * 100);
        let barColor = 'bg-emerald-500';
        let badgeBg = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';

        if (percentage < 60) {
          barColor = 'bg-rose-500';
          badgeBg = 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
        } else if (percentage < 80) {
          barColor = 'bg-amber-500';
          badgeBg = 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
        }

        return (
          <motion.div
            key={cat.key}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.4 }}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{cat.label}</span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${badgeBg}`}>
                  {cat.score} / {cat.max} pts
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                {cat.description}
              </p>
            </div>

            <div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${barColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 font-medium">
                <span>ATS Compatibility</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">{percentage}%</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
