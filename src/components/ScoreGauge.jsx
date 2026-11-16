import React from 'react';
import { motion } from 'framer-motion';

export default function ScoreGauge({ score = 0, size = 180, strokeWidth = 14, showTier = true }) {
  const normalizedScore = Math.min(100, Math.max(0, score));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  let strokeColor = '#10B981';
  let tierText = 'Excellent ATS Match';
  let tierBadge = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';

  if (normalizedScore < 60) {
    strokeColor = '#EF4444';
    tierText = 'Needs Optimization';
    tierBadge = 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
  } else if (normalizedScore < 80) {
    strokeColor = '#F59E0B';
    tierText = 'Competitive';
    tierBadge = 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-slate-200 dark:stroke-slate-800 transition-colors"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white"
          >
            {Math.round(normalizedScore)}
          </motion.span>
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
            out of 100
          </span>
        </div>
      </div>

      {showTier && (
        <div className="mt-3 text-center">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${tierBadge}`}>
            {tierText}
          </span>
        </div>
      )}
    </div>
  );
}
