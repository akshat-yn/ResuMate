import React, { useState, useEffect } from 'react';
import {
  Trash2,
  ExternalLink,
  GitCompare,
  FileCheck2,
  X
} from 'lucide-react';
import { HistoryService } from '../services/historyService';

export default function HistoryPage({ onNavigate, onSelectAnalysis }) {
  const [history, setHistory] = useState([]);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [compareResult, setCompareResult] = useState(null);

  useEffect(() => {
    setHistory(HistoryService.getAll());
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this analysis report?')) return;
    const updated = HistoryService.delete(id);
    setHistory(updated);
    setSelectedForCompare(selectedForCompare.filter((item) => item !== id));
  };

  const toggleSelectCompare = (id) => {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(selectedForCompare.filter((item) => item !== id));
    } else {
      if (selectedForCompare.length >= 2) {
        setSelectedForCompare([selectedForCompare[1], id]);
      } else {
        setSelectedForCompare([...selectedForCompare, id]);
      }
    }
  };

  const runComparison = () => {
    if (selectedForCompare.length !== 2) return;
    try {
      const res = HistoryService.compare(selectedForCompare[0], selectedForCompare[1]);
      setCompareResult(res);
    } catch (e) {
      alert('Failed to compare selected versions.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Analysis History & Version Compare
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track your ATS score improvement across iterations and compare two resumes side by side.
          </p>
        </div>

        {selectedForCompare.length === 2 && (
          <button
            onClick={runComparison}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/20 transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Compare Selected Versions</span>
          </button>
        )}
      </div>

      {compareResult && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-brand-500/80 p-6 shadow-xl space-y-4 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-brand-700 dark:text-brand-300 font-bold text-xs sm:text-sm">
              <GitCompare className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <span>Side-by-Side Version Comparison</span>
            </div>
            <button
              onClick={() => setCompareResult(null)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block text-[10px]">
                Version 1 (Initial)
              </span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                {compareResult.analysis_1?.filename}
              </p>
              <div className="text-2xl font-extrabold text-slate-700 dark:text-slate-200">
                {Math.round(compareResult.analysis_1?.overall_score)}/100
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-brand-50/50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900 text-xs space-y-2">
              <span className="font-bold text-brand-800 dark:text-brand-300 uppercase tracking-wider block text-[10px]">
                Version 2 (Revision)
              </span>
              <p className="font-semibold text-brand-900 dark:text-brand-200 text-sm">
                {compareResult.analysis_2?.filename}
              </p>
              <div className="text-2xl font-extrabold text-brand-700 dark:text-brand-300 flex items-center gap-2">
                <span>{Math.round(compareResult.analysis_2?.overall_score)}/100</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    compareResult.score_difference >= 0
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                      : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                  }`}
                >
                  {compareResult.score_difference >= 0 ? '+' : ''}
                  {compareResult.score_difference} pts
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 text-xs space-y-1.5">
            <span className="font-bold text-emerald-900 dark:text-emerald-300 block text-xs">Observed Improvements:</span>
            <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 text-[11px]">
              {compareResult.improvements?.map((imp, idx) => (
                <li key={idx}>{imp}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 transition-colors">
        {history.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 space-y-3">
            <p>No previous resume evaluations found.</p>
            <button
              onClick={() => onNavigate('upload')}
              className="px-4 py-2 rounded-xl bg-brand-600 text-white font-semibold text-xs"
            >
              Analyze Your First Resume
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-3 w-10 text-center">Compare</th>
                  <th className="py-3 px-3">Resume Document</th>
                  <th className="py-3 px-3">Analysis Date</th>
                  <th className="py-3 px-3">Overall ATS Score</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {history.map((item) => {
                  const isChecked = selectedForCompare.includes(item.id);
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                        isChecked ? 'bg-brand-50/40 dark:bg-brand-950/30' : ''
                      }`}
                    >
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectCompare(item.id)}
                          className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <FileCheck2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                        <span>{item.filename}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                        {new Date(item.created_at).toLocaleString()}
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
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => {
                              onSelectAnalysis(item);
                              onNavigate('results');
                            }}
                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Open Full Report"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
