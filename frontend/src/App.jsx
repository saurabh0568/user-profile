import React, { useState } from 'react';
import EmailGatekeeper from './components/EmailGatekeeper';
import OnboardingWizard from './components/OnboardingWizard';
import Dashboard from './components/Dashboard';
import ProfilePage from './components/ProfilePage';
import './index.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('emailGate'); // 'emailGate' | 'onboarding' | 'dashboard' | 'profile'
  const [userEmail, setUserEmail] = useState('');
  const [completedAnswers, setCompletedAnswers] = useState(null);

  // If email exists in DB, move directly to dashboard
  const handleExistingUser = (profileData) => {
    setUserEmail(profileData?.email || '');
    setCompletedAnswers(profileData);
    setCurrentPage('dashboard');
  };

  // If email is new, move to user onboarding wizard
  const handleNewUser = (email) => {
    setUserEmail(email);
    setCompletedAnswers({ email });
    setCurrentPage('onboarding');
  };

  // Called when onboarding submits successfully
  const handleOnboardingComplete = (answers) => {
    setCompletedAnswers(answers);
    setCurrentPage('dashboard');
  };

  // Navigate from Dashboard to Profile
  const handleGoToProfile = () => {
    setCurrentPage('profile');
  };

  // Reset/Switch email to return to email check screen
  const handleSwitchEmail = () => {
    setUserEmail('');
    setCompletedAnswers(null);
    setCurrentPage('emailGate');
  };

  if (currentPage === 'onboarding') {
    return (
      <OnboardingWizard
        email={userEmail}
        onComplete={handleOnboardingComplete}
        onBackToEmail={handleSwitchEmail}
      />
    );
  }

  if (currentPage === 'dashboard') {
    return (
      <Dashboard
        answers={completedAnswers}
        onGoToProfile={handleGoToProfile}
        onSwitchEmail={handleSwitchEmail}
      />
    );
  }

  if (currentPage === 'profile') {
    return (
      <ProfilePage
        answers={completedAnswers}
        onReset={handleSwitchEmail}
        onBackToDashboard={() => setCurrentPage('dashboard')}
      />
    );
  }

  return (
    <EmailGatekeeper
      onExistingUser={handleExistingUser}
      onNewUser={handleNewUser}
    />
  );
}
