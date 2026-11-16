import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';

export default function FileUpload({ onFileSelected, isUploading, uploadProgress, error }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [localError, setLocalError] = useState(null);
  const fileInputRef = useRef(null);

  const MAX_SIZE_MB = 10;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file) => {
    setLocalError(null);
    if (!file) return;

    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > MAX_SIZE_MB) {
      setLocalError(`File size exceeds ${MAX_SIZE_MB}MB limit (current: ${sizeMb.toFixed(1)}MB).`);
      return;
    }

    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx' && ext !== 'txt') {
      setLocalError('Invalid file format. Please upload a PDF, DOCX, or TXT file.');
      return;
    }

    setSelectedFile(file);
    if (onFileSelected) {
      onFileSelected(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setLocalError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';
  };

  const activeError = localError || error;

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => !selectedFile && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all ${
          selectedFile
            ? 'border-brand-500 bg-brand-50/20 dark:bg-brand-950/20'
            : dragActive
            ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/40 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 hover:border-brand-400 bg-white dark:bg-slate-900/60 hover:bg-slate-50/50 dark:hover:bg-slate-900 cursor-pointer'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleChange}
          className="hidden"
          disabled={isUploading}
        />

        {!selectedFile ? (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 mb-4 rounded-2xl bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-inner">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
              Drag & Drop your resume here, or <span className="text-brand-600 dark:text-brand-400 underline">browse</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-4">
              Supports standard <strong>PDF</strong>, <strong>DOCX</strong>, and <strong>TXT</strong> files up to 10MB.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 100% Private & In-Memory
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Instant ATS Scoring
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 mb-3 rounded-2xl bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 flex items-center justify-center">
              <FileText className="w-7 h-7" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 max-w-xs sm:max-w-md truncate">
                {selectedFile.name}
              </h4>
              {!isUploading && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                  className="p-1 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              {formatFileSize(selectedFile.size)} • {selectedFile.name.split('.').pop().toUpperCase()}
            </p>

            {isUploading && (
              <div className="w-full max-w-xs space-y-2">
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-600 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress || 60}%` }}
                  />
                </div>
                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-brand-700 dark:text-brand-300">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing document...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {activeError && (
        <div className="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{activeError}</span>
        </div>
      )}
    </div>
  );
}
