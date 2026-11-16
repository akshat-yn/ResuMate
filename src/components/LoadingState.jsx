import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, Loader2 } from 'lucide-react';

const STEPS = [
  'Extracting document text and metadata in browser...',
  'Parsing professional sections, contact info, and skills...',
  'Evaluating ATS rule-based scoring (6 weighted categories)...',
  'Analyzing syntax, weak verbs, and quantifiable metrics...',
  'Generating personalized recommendations and report...'
];

export default function LoadingState({ title = 'Analyzing Your Resume' }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-12 px-6 flex flex-col items-center justify-center text-center max-w-md mx-auto">
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-brand-400 blur-xl opacity-30 animate-pulse" />
        <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-brand-500/30">
          <Sparkles className="w-10 h-10 animate-spin" style={{ animationDuration: '6s' }} />
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-8">
        Evaluating your qualifications against executive ATS benchmarks in real time.
      </p>

      <div className="w-full space-y-3 text-left">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`flex items-center gap-3 p-2.5 rounded-xl text-xs font-medium transition-all ${
                isCurrent
                  ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-900 dark:text-brand-200 border border-brand-200 dark:border-brand-800 shadow-xs'
                  : isDone
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-slate-400 dark:text-slate-500 opacity-60'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-brand-600 dark:text-brand-400 animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600 shrink-0" />
              )}
              <span className="truncate">{step}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
