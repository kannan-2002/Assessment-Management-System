import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AssessmentProvider } from './contexts/AssessmentContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AssessmentTypesPage from './pages/AssessmentTypesPage';
import CreateAssessmentPage from './pages/CreateAssessmentPage';
import TakeAssessmentPage from './pages/TakeAssessmentPage';
import AssessmentResultsPage from './pages/AssessmentResultsPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <AssessmentProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/*" element={
                <ProtectedRoute>
                  <Navbar />
                  <main className="pt-16">
                    <Routes>
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/dashboard" element={<DashboardPage />} />
                      <Route path="/assessment-types" element={<AssessmentTypesPage />} />
                      <Route path="/create-assessment" element={<CreateAssessmentPage />} />
                      <Route path="/take-assessment/:id" element={<TakeAssessmentPage />} />
                      <Route path="/results/:id" element={<AssessmentResultsPage />} />
                    </Routes>
                  </main>
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </AssessmentProvider>
    </AuthProvider>
  );
}

export default App;