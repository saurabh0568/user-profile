import React, { useState } from 'react';
import OnboardingWizard from './components/OnboardingWizard';
import Dashboard from './components/Dashboard';
import ProfilePage from './components/ProfilePage';
import './index.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('onboarding');
  const [completedAnswers, setCompletedAnswers] = useState(null);

  // Called when onboarding submits successfully
  const handleOnboardingComplete = (answers) => {
    setCompletedAnswers(answers);
    setCurrentPage('dashboard');
  };

  // Navigate from Dashboard to Profile
  const handleGoToProfile = () => {
    setCurrentPage('profile');
  };

  // Reset everything and go back to onboarding
  const handleReset = () => {
    setCompletedAnswers(null);
    setCurrentPage('onboarding');
  };

  if (currentPage === 'dashboard') {
    return <Dashboard answers={completedAnswers} onGoToProfile={handleGoToProfile} />;
  }

  if (currentPage === 'profile') {
    return <ProfilePage answers={completedAnswers} onReset={handleReset} onBackToDashboard={() => setCurrentPage('dashboard')} />;
  }

  return <OnboardingWizard onComplete={handleOnboardingComplete} />;
}
