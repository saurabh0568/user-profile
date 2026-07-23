import React, { useState } from 'react';
import { CheckCircle2, RefreshCw, Code, User, Target, Calendar, ShieldAlert } from 'lucide-react';

export default function SummaryCard({ answers, onReset }) {
  const [showJson, setShowJson] = useState(false);

  return (
    <div className="question-card">
      <div className="summary-header">
        <div className="check-icon-circle">
          <CheckCircle2 size={36} />
        </div>
        <h2 className="summary-title">Onboarding Complete!</h2>
        <p className="summary-subtitle">
          Your profile has been saved to the <strong>Neon PostgreSQL Cloud Database</strong>.
        </p>
      </div>

      <div className="summary-container">
        {/* Basic Profile */}
        <div className="summary-section-box">
          <div className="summary-section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User size={16} /> Basic Profile
          </div>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-item-label">Email Address (Primary Key)</span>
              <span className="summary-item-value">{answers.email || '-'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-item-label">Full Name</span>
              <span className="summary-item-value">{answers.first_name} {answers.last_name}</span>
            </div>
            <div className="summary-item">
              <span className="summary-item-label">Date of Birth</span>
              <span className="summary-item-value">{answers.date_of_birth || '-'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-item-label">Gender</span>
              <span className="summary-item-value">{answers.gender || '-'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-item-label">Weight</span>
              <span className="summary-item-value">{answers.weight} {answers.weight_unit}</span>
            </div>
            <div className="summary-item">
              <span className="summary-item-label">Height</span>
              <span className="summary-item-value">{answers.height} {answers.height_unit}</span>
            </div>
          </div>
        </div>

        {/* Goal */}
        <div className="summary-section-box">
          <div className="summary-section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Target size={16} /> Fitness Goal
          </div>
          <div className="summary-grid">
            <div className="summary-item" style={{ gridColumn: '1 / -1' }}>
              <span className="summary-item-label">Primary Goal</span>
              <span className="summary-item-value">{answers.main_goal || '-'}</span>
            </div>
            {answers.main_goal === 'Prepare for an Event' && (
              <>
                <div className="summary-item">
                  <span className="summary-item-label">Event Name</span>
                  <span className="summary-item-value">{answers.event_name || '-'}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-item-label">Target Date</span>
                  <span className="summary-item-value">{answers.event_date || '-'}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Availability & Equipment */}
        <div className="summary-section-box">
          <div className="summary-section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={16} /> Schedule & Equipment
          </div>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-item-label">Weekly Training Plan</span>
              <span className="summary-item-value">{answers.days_per_week} Day{parseInt(answers.days_per_week) > 1 ? 's' : ''} / Week</span>
            </div>
            <div className="summary-item">
              <span className="summary-item-label">Selected Workout Days</span>
              <span className="summary-item-value">
                {Array.isArray(answers.best_days) && answers.best_days.length > 0
                  ? answers.best_days.join(', ')
                  : 'None selected'}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-item-label">Session Duration</span>
              <span className="summary-item-value">{answers.session_duration || '-'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-item-label">Training Location</span>
              <span className="summary-item-value">{answers.training_location || '-'}</span>
            </div>
            <div className="summary-item" style={{ gridColumn: '1 / -1' }}>
              <span className="summary-item-label">Available Equipment</span>
              <span className="summary-item-value">
                {Array.isArray(answers.equipment_access) && answers.equipment_access.length > 0
                  ? answers.equipment_access.join(', ')
                  : 'None'}
              </span>
            </div>
          </div>
        </div>

        {/* Health & Diet */}
        <div className="summary-section-box">
          <div className="summary-section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldAlert size={16} /> Health & Nutrition
          </div>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-item-label">Sleep (per night)</span>
              <span className="summary-item-value">{answers.sleep_hours || '-'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-item-label">Diet Preference</span>
              <span className="summary-item-value">{answers.dietary_preference || '-'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-item-label">Injury / Pain?</span>
              <span className="summary-item-value">
                {answers.has_injury === 'Yes' ? `Yes (${answers.injury_details || 'Unspecified'})` : 'No'}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-item-label">Medical Condition?</span>
              <span className="summary-item-value">
                {answers.has_medical_condition === 'Yes' ? `Yes (${answers.medical_condition_details || 'Unspecified'})` : answers.has_medical_condition || 'No'}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-item-label">Food Allergies?</span>
              <span className="summary-item-value">
                {answers.has_food_allergies === 'Yes' ? `Yes (${answers.food_allergies_details || 'Unspecified'})` : 'No'}
              </span>
            </div>
          </div>
        </div>

        {/* JSON Inspector Toggle */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button
            type="button"
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => setShowJson(!showJson)}
          >
            <Code size={16} /> {showJson ? 'Hide API Payload' : 'Inspect Saved DB Payload'}
          </button>
          <button
            type="button"
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={onReset}
          >
            <RefreshCw size={16} /> Reset Profile
          </button>
        </div>

        {showJson && (
          <div style={{ background: '#05070c', padding: '16px', borderRadius: '12px', overflowX: 'auto', border: '1px solid var(--border-color)' }}>
            <pre style={{ fontSize: '0.8rem', color: '#00f2fe', fontFamily: 'monospace' }}>
              {JSON.stringify(answers, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
