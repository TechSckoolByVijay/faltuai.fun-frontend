import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './auth/useAuth.js';

// Contexts
import { ThemeProvider } from './contexts/ThemeContext.jsx';

// Components
import AppShell from './components/AppShell.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Pages
import LandingPage from './pages/LandingPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import LoginCallback from './pages/LoginCallback.jsx';

// Features
import ResumeRoastPage from './features/resume_roast/ResumeRoastPage.jsx';
import CringeMeterPage from './features/cringe_meter/CringeMeterPage.jsx';
import EmailSmoothenerPage from './features/email_smoothener/EmailSmoothenerPage.jsx';
import AdminAnalyticsPage from './features/admin/AdminAnalyticsPage.jsx';
import IdeaSparkPage from './features/idea_spark/IdeaSparkPage.jsx';
import NameCraftPage from './features/name_craft/NameCraftPage.jsx';
import SkillAssessmentStart from './features/skill_assessment/SkillAssessmentStart.jsx';
import SkillAssessmentQuiz from './features/skill_assessment/SkillAssessmentQuiz.jsx';
import SkillAssessmentResults from './features/skill_assessment/SkillAssessmentResults.jsx';

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

  const withShell = (component) => (
    <ProtectedRoute>
      <AppShell>{component}</AppShell>
    </ProtectedRoute>
  );

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
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth/callback" element={<LoginCallback />} />
            <Route path="/debug" element={<DebugInfo />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={withShell(<Dashboard />)}
            />
            
            <Route 
              path="/resume-roast" 
              element={withShell(<ResumeRoastPage />)}
            />

            <Route
              path="/cringe-meter"
              element={withShell(<CringeMeterPage />)}
            />

            <Route
              path="/email-smoothener"
              element={withShell(<EmailSmoothenerPage />)}
            />

            <Route
              path="/idea-spark"
              element={withShell(<IdeaSparkPage />)}
            />

            <Route
              path="/name-craft"
              element={withShell(<NameCraftPage />)}
            />

            <Route
              path="/admin/analytics"
              element={withShell(<AdminAnalyticsPage />)}
            />
            
            <Route 
              path="/skill-assessment" 
              element={withShell(<SkillAssessmentStart />)}
            />
            
            <Route 
              path="/skill-assessment/quiz/:assessmentId" 
              element={withShell(<SkillAssessmentQuiz />)}
            />
            
            <Route 
              path="/skill-assessment/results/:assessmentId" 
              element={withShell(<SkillAssessmentResults />)}
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
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;