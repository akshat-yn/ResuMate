import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import UploadPage from './pages/UploadPage';
import AnalysisResultsPage from './pages/AnalysisResultsPage';
import JobMatchPage from './pages/JobMatchPage';
import ResumeImproverPage from './pages/ResumeImproverPage';
import HistoryPage from './pages/HistoryPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';

function AppContent() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState(user ? 'dashboard' : 'landing');
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnalysisComplete = (result) => {
    setActiveAnalysis(result);
    setCurrentPage('results');
  };

  const isAuthOrLanding = ['landing', 'login', 'register'].includes(currentPage);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200`}>
      <Navbar
        onNavigate={handleNavigate}
        currentPage={currentPage}
        onToggleMobileMenu={setIsMobileMenuOpen}
      />

      {isAuthOrLanding ? (
        <main className="flex-1">
          {currentPage === 'landing' && <LandingPage onNavigate={handleNavigate} />}
          {currentPage === 'login' && <LoginPage onNavigate={handleNavigate} />}
          {currentPage === 'register' && <RegisterPage onNavigate={handleNavigate} />}
        </main>
      ) : (
        <div className="flex-1 max-w-7xl w-full mx-auto flex">
          <Sidebar
            currentPage={currentPage}
            onNavigate={handleNavigate}
            hasActiveAnalysis={Boolean(activeAnalysis)}
            isMobileMenuOpen={isMobileMenuOpen}
            onToggleMobileMenu={setIsMobileMenuOpen}
          />

          {/* Main content — extra bottom padding on mobile to clear the bottom nav */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-24 lg:pb-8">
            {currentPage === 'dashboard' && (
              <Dashboard
                onNavigate={handleNavigate}
                activeAnalysis={activeAnalysis}
                onSelectAnalysis={setActiveAnalysis}
              />
            )}
            {currentPage === 'upload' && (
              <UploadPage
                onNavigate={handleNavigate}
                onAnalysisComplete={handleAnalysisComplete}
              />
            )}
            {currentPage === 'results' && (
              <AnalysisResultsPage
                analysis={activeAnalysis}
                onNavigate={handleNavigate}
              />
            )}
            {currentPage === 'job-match' && (
              <JobMatchPage
                activeAnalysis={activeAnalysis}
                onNavigate={handleNavigate}
              />
            )}
            {currentPage === 'improver' && <ResumeImproverPage />}
            {currentPage === 'history' && (
              <HistoryPage
                onNavigate={handleNavigate}
                onSelectAnalysis={setActiveAnalysis}
              />
            )}
            {currentPage === 'profile' && <ProfileSettingsPage />}
          </main>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
