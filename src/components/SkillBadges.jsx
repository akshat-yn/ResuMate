import React from 'react';
import { Check, X, Star } from 'lucide-react';

export default function SkillBadges({
  title,
  skills = [],
  variant = 'neutral',
  emptyMessage = 'No items found'
}) {
  const getBadgeStyle = () => {
    switch (variant) {
      case 'success':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60';
      case 'danger':
        return 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/60';
      case 'preferred':
        return 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700';
    }
  };

  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mr-1 inline" />;
      case 'danger':
        return <X className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 mr-1 inline" />;
      case 'preferred':
        return <Star className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 mr-1 inline fill-indigo-200 dark:fill-indigo-900" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      {title && (
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title} ({skills.length})
          </h4>
        </div>
      )}

      {skills.length === 0 ? (
        <p className="text-xs text-slate-400 italic">{emptyMessage}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, i) => (
            <span
              key={i}
              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${getBadgeStyle()}`}
            >
              {getIcon()}
              <span>{skill}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
