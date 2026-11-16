import React, { useState } from 'react';
import { UploadCloud, Sparkles, FileText, ArrowRight, AlertCircle, CheckCircle2, ChevronDown } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import LoadingState from '../components/LoadingState';
import { ResumeExtractor } from '../services/extractor';
import { GeminiService } from '../services/geminiService';
import { HistoryService } from '../services/historyService';
import { SAMPLE_RESUMES } from '../data/sampleResumes';
import { useAuth } from '../context/AuthContext';

export default function UploadPage({ onNavigate, onAnalysisComplete }) {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [targetRole, setTargetRole] = useState(user?.target_role || 'Software Engineer');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [useTextMode, setUseTextMode] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [showSampleDropdown, setShowSampleDropdown] = useState(false);

  const handleStartAnalysis = async () => {
    setError(null);
    if (!useTextMode && !selectedFile) {
      setError('Please select or drop a resume file (PDF, DOCX, or TXT).');
      return;
    }
    if (useTextMode && pastedText.trim().length < 50) {
      setError('Please paste your resume text (minimum 50 characters).');
      return;
    }

    setIsProcessing(true);
    setUploadProgress(25);

    try {
      let rawText = '';
      let filename = 'resume.pdf';

      if (!useTextMode && selectedFile) {
        setUploadProgress(50);
        const extracted = await ResumeExtractor.extractText(selectedFile);
        rawText = extracted.text;
        filename = selectedFile.name;
      } else {
        setUploadProgress(50);
        rawText = pastedText;
        filename = 'pasted_resume.txt';
      }

      setUploadProgress(75);
      const analysisResult = await GeminiService.analyzeResume(rawText, filename);

      setUploadProgress(100);
      HistoryService.save(analysisResult);

      if (onAnalysisComplete) {
        onAnalysisComplete(analysisResult);
      }
      onNavigate('results');
    } catch (err) {
      setError(err.message || 'Failed to complete resume analysis.');
      setIsProcessing(false);
    }
  };

  const handleSelectSample = (sample) => {
    setUseTextMode(true);
    setPastedText(sample.text);
    setTargetRole(sample.role);
    setShowSampleDropdown(false);
  };

  if (isProcessing) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-8 max-w-2xl mx-auto transition-colors">
        <LoadingState title="Analyzing Resume with ResuMate Engine" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Upload & Analyze Resume
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Upload your resume file or paste text to receive immediate ATS compatibility scores and personalized recommendations.
          </p>
        </div>

        {/* Multi-sample Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSampleDropdown(!showSampleDropdown)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Sample Resumes</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {showSampleDropdown && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-30 p-2 space-y-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 px-3 py-1">
                Choose a Sample Resume
              </p>
              {SAMPLE_RESUMES.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex flex-col"
                >
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{sample.role}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{sample.tag}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Target Role Card */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Target Job Role (Optional)
            </label>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Helps calibrate recommendations for your desired career trajectory.
            </p>
          </div>
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Senior Full Stack Engineer"
            className="w-full sm:w-64 px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>
      </div>

      {/* Upload Dropzone / Text Paste */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setUseTextMode(false)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                !useTextMode
                  ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Upload Document (PDF / DOCX)
            </button>
            <button
              onClick={() => setUseTextMode(true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                useTextMode
                  ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Paste Resume Text
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-[11px]">Quick Load:</span>
            {SAMPLE_RESUMES.slice(0, 2).map((s, idx) => (
              <button
                key={s.id}
                onClick={() => handleSelectSample(s)}
                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Sample #{idx + 1}
              </button>
            ))}
          </div>
        </div>

        {!useTextMode ? (
          <FileUpload
            onFileSelected={(file) => setSelectedFile(file)}
            isUploading={isProcessing}
            uploadProgress={uploadProgress}
            error={error}
          />
        ) : (
          <div className="space-y-2">
            <textarea
              rows={12}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste your entire resume text here including work experience, education, and skills..."
              className="w-full p-4 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 leading-relaxed text-slate-800 dark:text-slate-200"
            />
            <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500">
              <span>Plain text format</span>
              <span>{pastedText.split(/\s+/).filter(Boolean).length} words</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>100% Confidential • Secure In-Memory Analysis</span>
          </div>

          <button
            onClick={handleStartAnalysis}
            disabled={isProcessing || (!selectedFile && (!useTextMode || !pastedText.trim()))}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md shadow-brand-600/30 transition-all hover:scale-[1.01] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Run Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
