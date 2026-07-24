import React from 'react';
import { Flame, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Dashboard({ answers, onGoToProfile, onSwitchEmail }) {
  const firstName = answers?.first_name || '';
  const email = answers?.email || '';

  return (
    <div className="dashboard-page">
      {/* Brand Header */}
      <div className="dashboard-header">
        <div className="brand-bar">
          <div className="brand-title">
            <Flame size={24} color="#F5C400" fill="#F5C400" /> FitAI X
          </div>
          <span className="brand-badge">Dashboard</span>
        </div>
      </div>

      {/* Centered Card */}
      <div className="dashboard-center">
        <div className="dashboard-card">
          {/* Gold Check Icon */}
          <div className="dashboard-icon">
            <CheckCircle2 size={40} />
          </div>

          {/* Title */}
          <h1 className="dashboard-title">
            Welcome to FitAI Pro{firstName ? `, ${firstName}` : ''}.
          </h1>

          {/* Subtitle */}
          <p className="dashboard-subtitle">
            {email ? `Signed in as ${email}. ` : ''}Your onboarding has been completed successfully.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', marginTop: '16px' }}>
            <button
              type="button"
              className="dashboard-btn"
              onClick={onGoToProfile}
            >
              Go to Profile <ArrowRight size={18} />
            </button>

            {onSwitchEmail && (
              <button
                type="button"
                className="btn-secondary"
                onClick={onSwitchEmail}
                style={{ padding: '12px', fontSize: '14px', borderRadius: '12px' }}
              >
                Switch Account / Enter Different Email
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
