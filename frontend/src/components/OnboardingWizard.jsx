import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Flame } from 'lucide-react';
import { questionsData } from '../data/questionsData';
import QuestionCard from './QuestionCard';
import SummaryCard from './SummaryCard';

export default function OnboardingWizard({ email = '', onComplete, onBackToEmail }) {
  const [answers, setAnswers] = useState({
    email: email,
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    weight: '',
    weight_unit: 'kg',
    height: '',
    height_unit: 'cm',
    main_goal: '',
    event_name: '',
    event_date: '',
    days_per_week: '',
    best_days: [],
    session_duration: '',
    training_location: '',
    equipment_access: [],
    has_injury: '',
    injury_details: '',
    has_medical_condition: '',
    medical_condition_details: '',
    sleep_hours: '',
    dietary_preference: '',
    has_food_allergies: '',
    food_allergies_details: '',
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (email) {
      setAnswers((prev) => ({ ...prev, email }));
    }
  }, [email]);

  // Determine active questions based on dynamic conditional functions
  const activeQuestions = questionsData.filter((q) => {
    if (q.conditional) {
      return q.conditional(answers);
    }
    return true;
  });

  const currentQuestion = activeQuestions[currentIndex] || activeQuestions[0];
  
  // Progress starts at 0% and increases after filling questions
  const progressPercent = isCompleted 
    ? 100 
    : Math.round((currentIndex / activeQuestions.length) * 100);

  // Validate current question field before advancing
  const validateCurrentField = async () => {
    if (!currentQuestion) return true;

    const val = answers[currentQuestion.field];

    // Check basic presence for required fields
    if (currentQuestion.required) {
      if (currentQuestion.type === 'multi_choice') {
        if (!Array.isArray(val) || val.length === 0) {
          setError('Please select at least one option.');
          return false;
        }
      } else if (currentQuestion.type === 'event_target') {
        if (!answers.event_name || !answers.event_name.trim()) {
          setError('Please enter the event name.');
          return false;
        }
        if (!answers.event_date) {
          setError('Please select the target date.');
          return false;
        }
      } else {
        if (!val || (typeof val === 'string' && !val.trim())) {
          setError('This field is required before continuing.');
          return false;
        }
      }
    }

    // Letters only validation
    if (currentQuestion.inputType === 'text_letters' && val) {
      const letterRegex = /^[a-zA-Z\s\-']+$/;
      if (!letterRegex.test(val)) {
        setError('Please enter letters only (no numbers or special characters).');
        return false;
      }
    }

    // Decimal float / number validation
    if (currentQuestion.inputType === 'float' && val) {
      const floatRegex = /^\d+(\.\d+)?$/;
      if (!floatRegex.test(val)) {
        setError('Please enter a valid decimal number (e.g., 68.5 or 172).');
        return false;
      }
    }

    // Date validation (modern calendar selector)
    if (currentQuestion.type === 'date' && val) {
      const dateVal = new Date(val);
      if (isNaN(dateVal.getTime())) {
        setError('Please select a valid date.');
        return false;
      }
    }

    // Exact days selection verification for combined questions
    if (currentQuestion.field === 'best_days' && val) {
      const expectedDays = parseInt(answers.days_per_week) || 7;
      if (val.length !== expectedDays) {
        setError(`Please select exactly ${expectedDays} workout day${expectedDays > 1 ? 's' : ''} based on your training selection.`);
        return false;
      }
    }

    setError('');
    return true;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentField();
    if (!isValid) return;

    // Auto-save draft progress if email is available
    if (answers.email) {
      saveProgressToBackend(false);
    }

    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      submitFinalOnboarding();
    }
  };

  const handleBack = () => {
    setError('');
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else if (onBackToEmail) {
      onBackToEmail();
    }
  };

  const handleChange = (field, value) => {
    setError('');
    setAnswers((prev) => {
      const updated = { ...prev, [field]: value };
      
      // Auto-clear best_days if user changes days_per_week to keep count synchronized
      if (field === 'days_per_week') {
        updated.best_days = [];
      }
      return updated;
    });
  };

  const saveProgressToBackend = async (completedStatus = false) => {
    if (!answers.email || !answers.email.trim()) return;

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...answers,
          is_completed: completedStatus,
          current_step: currentIndex + 1,
        }),
      });

      if (!response.ok) {
        console.warn('Auto-save response status:', response.status);
      }
    } catch (err) {
      console.error('Auto-save request error:', err);
    }
  };

  const submitFinalOnboarding = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...answers,
          is_completed: true,
          current_step: activeQuestions.length,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsCompleted(true);
        if (onComplete) onComplete(answers);
      } else {
        setError(data.error || 'Failed to submit onboarding form.');
      }
    } catch (err) {
      console.error('Final submission error:', err);
      setError('Network error connecting to database server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsCompleted(false);
    setCurrentIndex(0);
    setError('');
    setAnswers({
      email: '',
      first_name: '',
      last_name: '',
      date_of_birth: '',
      gender: '',
      weight: '',
      weight_unit: 'kg',
      height: '',
      height_unit: 'cm',
      main_goal: '',
      event_name: '',
      event_date: '',
      days_per_week: '',
      best_days: [],
      session_duration: '',
      training_location: '',
      equipment_access: [],
      has_injury: '',
      injury_details: '',
      has_medical_condition: '',
      medical_condition_details: '',
      sleep_hours: '',
      dietary_preference: '',
      has_food_allergies: '',
      food_allergies_details: '',
    });
  };

  // Keyboard shortcut listener (Enter = Next, except for multi-choice/dual layouts)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isCompleted) return;
      const skipEnter = 
        currentQuestion?.type === 'multi_choice' || 
        currentQuestion?.type === 'event_target';
      
      if (e.key === 'Enter' && !skipEnter) {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, answers, isCompleted]);

  return (
    <div className="app-viewport">
      {/* Header & Progress */}
      <div className="wizard-header">
        <div className="brand-bar">
          <div className="brand-title">
            <Flame size={24} color="#F5C400" fill="#F5C400" /> FitAI X
          </div>
          <span className="brand-badge">Onboarding</span>
        </div>

        {!isCompleted && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="step-indicator">
                Question {currentQuestion.id} of Section {currentQuestion.section.split('.')[0]}
              </span>
              <span className="step-indicator" style={{ color: 'var(--accent-cyan)' }}>
                {progressPercent}% Complete
              </span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Main Question Container */}
      <div className="question-container">
        {isCompleted ? (
          <SummaryCard answers={answers} onReset={handleReset} />
        ) : (
          <QuestionCard
            question={currentQuestion}
            answers={answers}
            onChange={handleChange}
            error={error}
          />
        )}
      </div>

      {/* Footer Navigation Buttons */}
      {!isCompleted && (
        <div className="wizard-footer">
          <button
            type="button"
            className="btn-secondary"
            onClick={handleBack}
            disabled={(currentIndex === 0 && !onBackToEmail) || isSubmitting}
          >
            <ChevronLeft size={18} /> Back
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={handleNext}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              'Verifying...'
            ) : currentIndex === activeQuestions.length - 1 ? (
              <>Submit <CheckCircle size={18} /></>
            ) : (
              <>Next <ChevronRight size={18} /></>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
