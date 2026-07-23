import React from 'react';
import { Check } from 'lucide-react';

export default function QuestionCard({ question, answers, onChange, error }) {
  if (!question) return null;

  // Render text type input
  const handleTextChange = (e) => {
    onChange(question.field, e.target.value);
  };

  const handleSingleSelect = (val) => {
    onChange(question.field, val);
  };

  const handleMultiSelect = (val) => {
    const currentList = Array.isArray(answers[question.field]) ? answers[question.field] : [];
    
    if (currentList.includes(val)) {
      onChange(question.field, currentList.filter((item) => item !== val));
    } else {
      // Check maximum limit for combined question 3.2 best_days
      if (question.field === 'best_days') {
        const maxDays = parseInt(answers.days_per_week) || 7;
        if (currentList.length >= maxDays) {
          // Prevent adding more than the limit
          return;
        }
      }
      onChange(question.field, [...currentList, val]);
    }
  };

  const handleUnitChange = (unitField, unitVal) => {
    onChange(unitField, unitVal);
  };

  return (
    <div className="question-card">
      <span className="section-badge">{question.section}</span>
      <h2 className="question-title">{question.title}</h2>
      <p className="question-subtitle">{question.subtitle}</p>

      {/* 1. TEXT INPUT TYPE */}
      {question.type === 'text' && (
        <div className="input-group">
          <input
            type={question.inputType === 'email' ? 'email' : 'text'}
            className="text-input"
            placeholder={question.placeholder}
            value={answers[question.field] || ''}
            onChange={handleTextChange}
            autoFocus
          />
        </div>
      )}

      {/* 2. DATE TYPE (MODERN CALENDAR SELECTOR) */}
      {question.type === 'date' && (
        <div className="input-group">
          <input
            type="date"
            className="text-input date-picker-input"
            value={answers[question.field] || ''}
            onChange={handleTextChange}
            autoFocus
          />
        </div>
      )}

      {/* 3. NUMBER WITH UNIT TOGGLE (WEIGHT & HEIGHT) */}
      {question.type === 'number_unit' && (
        <div className="unit-input-wrapper">
          <input
            type="text"
            className="text-input"
            placeholder={question.placeholder}
            value={answers[question.field] || ''}
            onChange={handleTextChange}
            autoFocus
          />
          <div className="unit-toggle-box">
            {question.units.map((unit) => (
              <button
                key={unit}
                type="button"
                className={`unit-btn ${ (answers[question.unitField] || question.defaultUnit) === unit ? 'active' : ''}`}
                onClick={() => handleUnitChange(question.unitField, unit)}
              >
                {unit}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. EVENT TARGET (DUAL EVENT NAME AND DATE SELECTOR) */}
      {question.type === 'event_target' && (
        <div className="input-group dual-fields-container">
          <div className="field-block">
            <label className="field-label">Event Name</label>
            <input
              type="text"
              className="text-input"
              placeholder={question.placeholder}
              value={answers.event_name || ''}
              onChange={(e) => onChange('event_name', e.target.value)}
              autoFocus
            />
          </div>
          <div className="field-block" style={{ marginTop: '16px' }}>
            <label className="field-label">Target Date</label>
            <input
              type="date"
              className="text-input date-picker-input"
              value={answers.event_date || ''}
              onChange={(e) => onChange('event_date', e.target.value)}
            />
          </div>
        </div>
      )}

      {/* 5. SINGLE CHOICE */}
      {question.type === 'single_choice' && (
        <div className="options-grid">
          {question.options.map((opt) => {
            const isSelected = answers[question.field] === opt.value;
            return (
              <div
                key={opt.value}
                className={`option-card ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSingleSelect(opt.value)}
              >
                <div className="option-left">
                  <span className="option-key">{opt.key}</span>
                  <span className="option-label">{opt.label}</span>
                </div>
                <div className="radio-indicator">
                  {isSelected && <div className="radio-indicator-inner" />}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 6. MULTI CHOICE */}
      {question.type === 'multi_choice' && (() => {
        const selectedList = Array.isArray(answers[question.field]) ? answers[question.field] : [];
        const maxDays = question.field === 'best_days' ? (parseInt(answers.days_per_week) || 7) : null;
        const remaining = maxDays !== null ? maxDays - selectedList.length : null;

        return (
          <>
            {maxDays !== null && (
              <div className="days-hint">
                {remaining > 0
                  ? `✦ Select ${remaining} more day${remaining > 1 ? 's' : ''} (${selectedList.length} / ${maxDays} selected)`
                  : `✔ All ${maxDays} day${maxDays > 1 ? 's' : ''} selected`}
              </div>
            )}
            <div className="options-grid-multi">
              {question.options.map((opt) => {
                const isSelected = selectedList.includes(opt.value);
                return (
                  <div
                    key={opt.value}
                    className={`option-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleMultiSelect(opt.value)}
                  >
                    <div className="option-left">
                      <span className="option-key">{opt.key}</span>
                      <span className="option-label">{opt.label}</span>
                    </div>
                    <div className="checkbox-indicator">
                      {isSelected && <Check size={14} strokeWidth={3} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        );
      })()}

      {error && <p className="error-msg">⚠️ {error}</p>}
    </div>
  );
}
