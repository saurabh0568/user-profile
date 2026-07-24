import React, { useState } from 'react';
import { Flame, ArrowRight, Loader2, Mail, CheckCircle2 } from 'lucide-react';

export default function EmailGatekeeper({ onExistingUser, onNewUser }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError('Please enter a valid email address (e.g. name@example.com).');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Check if email exists in database
      const checkRes = await fetch(`/api/onboarding/check/${encodeURIComponent(cleanEmail)}`);
      const checkData = await checkRes.json();

      if (!checkRes.ok) {
        throw new Error(checkData.error || 'Failed to verify email address.');
      }

      if (checkData.exists) {
        // Email exists in Neon database -> fetch profile data & move to dashboard
        const profileRes = await fetch(`/api/onboarding/${encodeURIComponent(cleanEmail)}`);
        const profileData = await profileRes.json();

        if (profileRes.ok && profileData.data) {
          onExistingUser(profileData.data);
        } else {
          // Fallback if data couldn't be fetched cleanly
          onExistingUser({ email: cleanEmail });
        }
      } else {
        // Email is new -> proceed to onboarding wizard
        onNewUser(cleanEmail);
      }
    } catch (err) {
      console.error('Email check error:', err);
      setError(err.message || 'An error occurred while connecting to the database.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-viewport">
      {/* Brand Header */}
      <div className="header" style={{ marginBottom: '30px', textAlign: 'center' }}>
        <div className="brand-bar" style={{ justifyContent: 'center' }}>
          <div className="brand-title" style={{ fontSize: '24px' }}>
            <Flame size={28} color="#F5C400" fill="#F5C400" /> FitAI X
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="question-card" style={{ width: '100%', maxWidth: '520px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(245, 196, 0, 0.12)',
              border: '1px solid rgba(245, 196, 0, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--gold)'
            }}>
              <Mail size={20} />
            </div>
            <span className="section-badge" style={{ margin: 0 }}>Account Verification</span>
          </div>

          <h2 className="question-title" style={{ fontSize: '24px', marginBottom: '8px' }}>
            Enter your email to get started
          </h2>
          <p className="question-subtitle" style={{ fontSize: '14px', lineHeight: '1.5', marginBottom: '24px' }}>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="input-group" style={{ marginBottom: '16px' }}>
              <input
                type="email"
                className="text-input"
                placeholder="e.g. name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoFocus
              />
            </div>

            {error && (
              <div style={{
                color: 'var(--red)',
                fontSize: '13px',
                marginBottom: '16px',
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>⚠️ {error}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
              style={{
                width: '100%',
                maxWidth: 'none',
                justifyContent: 'center',
                padding: '14px',
                fontSize: '16px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #F5C400 0%, #FFB300 100%)',
                color: '#000000',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 8px 20px -8px rgba(245, 196, 0, 0.6)',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> Checking Database...
                </>
              ) : (
                <>
                  Continue <ArrowRight size={18} color="#000000" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Footer info */}
      <div style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '12px', marginTop: '20px' }}>
        🔒 Powered by FitAI X & Neon Cloud PostgreSQL
      </div>
    </div>
  );
}
