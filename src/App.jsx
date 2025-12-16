import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './auth/useAuth.js';

// Contexts
import { ThemeProvider } from './contexts/ThemeContext.jsx';

// Components
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Pages
import LandingPage from './pages/LandingPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import LoginCallback from './pages/LoginCallback.jsx';

// Features
import ResumeRoastPage from './features/resume_roast/ResumeRoastPage.jsx';
import SkillAssessmentStart from './features/skill_assessment/SkillAssessmentStart.jsx';
import SkillAssessmentQuiz from './features/skill_assessment/SkillAssessmentQuiz.jsx';
import SkillAssessmentResults from './features/skill_assessment/SkillAssessmentResults.jsx';
import StockAnalysisStart from './features/stock_analysis/StockAnalysisStart.jsx';
import StockAnalysisReport from './features/stock_analysis/StockAnalysisReport.jsx';

// Debug
import DebugInfo from './debug.jsx';

// Styles
import './index.css';

/**
 * Main App Component
 * Uses HashRouter for GitHub Pages compatibility
 */
function App() {
  const { loading } = useAuth();

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="App min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50 transition-colors duration-300">
          <Navbar />
          <main>
            <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth/callback" element={<LoginCallback />} />
            <Route path="/debug" element={<DebugInfo />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/resume-roast" 
              element={
                <ProtectedRoute>
                  <ResumeRoastPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/skill-assessment" 
              element={
                <ProtectedRoute>
                  <SkillAssessmentStart />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/skill-assessment/quiz/:assessmentId" 
              element={
                <ProtectedRoute>
                  <SkillAssessmentQuiz />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/skill-assessment/results/:assessmentId" 
              element={
                <ProtectedRoute>
                  <SkillAssessmentResults />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/stock-analysis" 
              element={
                <ProtectedRoute>
                  <StockAnalysisStart />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/stock-analysis/report/:analysisId" 
              element={
                <ProtectedRoute>
                  <StockAnalysisReport />
                </ProtectedRoute>
              } 
            />
            
            {/* TODO: Add more feature routes here */}
            {/* 
            <Route 
              path="/feature2" 
              element={
                <ProtectedRoute>
                  <Feature2Page />
                </ProtectedRoute>
              } 
            />
            */}
            
            {/* Catch-all route - redirect to home */}
            <Route path="*" element={<LandingPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;