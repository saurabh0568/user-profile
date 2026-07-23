import React, { useState, useEffect } from 'react';
import {
  Flame, User, Target, ShieldAlert, Leaf,
  Edit3, Save, X, Check, Loader2, AlertCircle, ArrowLeft
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   OPTION CONSTANTS — matching questionsData.js exactly
═══════════════════════════════════════════════════════════════ */
const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say'];
const GOAL_OPTIONS = ['Lose Weight', 'Build Muscle', 'Gain Strength', 'Boost Endurance', 'General Fitness', 'Prepare for an Event'];
const DAYS_PER_WEEK_OPTIONS = ['1', '2', '3', '4', '5', '6', '7'];
const SESSION_DURATION_OPTIONS = ['45 minutes', '60 minutes', '90 minutes'];
const LOCATION_OPTIONS = ['Home', 'Gym', 'Outdoors', 'Mixed / varies'];
const SLEEP_OPTIONS = ['Under 5 hours', '5-6 hours', '6-7 hours', '7-8 hours', '8+ hours'];
const DIET_OPTIONS = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Eggetarian', 'Other'];
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const EQUIPMENT_LIST = ['Bodyweight only', 'Dumbbells', 'Barbell', 'Kettlebell', 'Resistance Bands', 'Gym Machines', 'Sled', 'Rower / SkiErg / AirBike'];
const YES_NO = ['Yes', 'No'];
const MEDICAL_OPTIONS = ['Yes', 'No', 'Prefer not to say'];
const WEIGHT_UNITS = ['kg', 'lb'];
const HEIGHT_UNITS = ['cm', 'ft-in'];

/* ═══════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════ */
function parseJsonArray(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try { return JSON.parse(val); } catch { return []; }
  }
  return [];
}

/* ═══════════════════════════════════════════════════════════════
   PROFILE PAGE COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function ProfilePage({ answers, onReset, onBackToDashboard }) {
  const [profile, setProfile] = useState(null);
  const [editData, setEditData] = useState({});
  const [editingSection, setEditingSection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [toast, setToast] = useState(null);

  const email = answers?.email || '';

  // ── Fetch profile on mount ────────────────────────────────
  useEffect(() => {
    if (!email) {
      setProfile(answers || {});
      setIsLoading(false);
      return;
    }
    fetchProfile();
  }, []);

  // ── Auto-dismiss toast ────────────────────────────────────
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchProfile = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await fetch(`/api/profile/${encodeURIComponent(email)}/summary`);
      if (!res.ok) throw new Error('Failed to load profile');
      const data = await res.json();
      const p = data.profile || data;
      p.best_days = parseJsonArray(p.best_days);
      p.equipment_access = parseJsonArray(p.equipment_access);
      setProfile(p);
    } catch (err) {
      console.error('Profile fetch error:', err);
      if (answers) {
        const fallback = { ...answers };
        fallback.best_days = parseJsonArray(fallback.best_days);
        fallback.equipment_access = parseJsonArray(fallback.equipment_access);
        setProfile(fallback);
      } else {
        setFetchError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── Edit handlers ─────────────────────────────────────────
  const startEditing = (section) => {
    setEditData({ ...profile });
    setEditingSection(section);
  };

  const cancelEditing = () => {
    setEditingSection(null);
    setEditData({});
  };

  const handleChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleChip = (field, value) => {
    setEditData((prev) => {
      const current = parseJsonArray(prev[field]);
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter((v) => v !== value) };
      }
      return { ...prev, [field]: [...current, value] };
    });
  };

  // ── Save handler ──────────────────────────────────────────
  const saveSection = async () => {
    setIsSaving(true);
    try {
      const enc = encodeURIComponent(email);

      if (editingSection === 'basic') {
        const res = await fetch(`/api/profile/${enc}/personal-info`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: editData.first_name,
            last_name: editData.last_name,
            date_of_birth: editData.date_of_birth,
            gender: editData.gender,
            weight: editData.weight,
            weight_unit: editData.weight_unit,
            height: editData.height,
            height_unit: editData.height_unit,
          }),
        });
        if (!res.ok) throw new Error('Failed to update personal info.');
      }

      if (editingSection === 'fitness') {
        const fitnessRes = await fetch(`/api/profile/${enc}/fitness`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            main_goal: editData.main_goal,
            event_name: editData.event_name || '',
            event_date: editData.event_date || '',
            days_per_week: editData.days_per_week,
            best_days: parseJsonArray(editData.best_days),
            session_duration: editData.session_duration,
            training_location: editData.training_location,
          }),
        });
        if (!fitnessRes.ok) throw new Error('Failed to update fitness profile.');

        const equipRes = await fetch(`/api/profile/${enc}/equipment`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            equipment_access: parseJsonArray(editData.equipment_access),
          }),
        });
        if (!equipRes.ok) throw new Error('Failed to update equipment.');
      }

      if (editingSection === 'health') {
        const res = await fetch(`/api/profile/${enc}/injury`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            has_injury: editData.has_injury,
            injury_details: editData.injury_details || '',
            has_medical_condition: editData.has_medical_condition,
            medical_condition_details: editData.medical_condition_details || '',
          }),
        });
        if (!res.ok) throw new Error('Failed to update health information.');
      }

      if (editingSection === 'nutrition') {
        const fullPayload = {
          ...profile,
          sleep_hours: editData.sleep_hours,
          dietary_preference: editData.dietary_preference,
          has_food_allergies: editData.has_food_allergies,
          food_allergies_details: editData.food_allergies_details || '',
          best_days: parseJsonArray(profile.best_days),
          equipment_access: parseJsonArray(profile.equipment_access),
          is_completed: true,
          current_step: profile.current_step || 23,
        };
        delete fullPayload.created_at;
        delete fullPayload.updated_at;

        const res = await fetch('/api/onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fullPayload),
        });
        if (!res.ok) throw new Error('Failed to update nutrition info.');
      }

      setProfile((prev) => ({ ...prev, ...editData }));
      setEditingSection(null);
      setEditData({});
      setToast({ type: 'success', message: 'Profile updated successfully!' });
    } catch (err) {
      console.error('Save error:', err);
      setToast({ type: 'error', message: err.message || 'Failed to save changes.' });
    } finally {
      setIsSaving(false);
    }
  };

  /* ═══════════════════════════════════════════════════════════
     RENDER — LOADING STATE
  ═══════════════════════════════════════════════════════════ */
  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="wizard-header">
          <div className="brand-bar">
            <div className="brand-title">
              <Flame size={24} color="#F5C400" fill="#F5C400" /> FitAI X
            </div>
            <span className="brand-badge">Profile</span>
          </div>
        </div>
        <div className="profile-loading">
          <div className="skeleton-avatar" />
          <div className="skeleton-line skeleton-w60" />
          <div className="skeleton-line skeleton-w40" />
          <div className="skeleton-card" />
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════
     RENDER — ERROR STATE
  ═══════════════════════════════════════════════════════════ */
  if (fetchError && !profile) {
    return (
      <div className="profile-page">
        <div className="wizard-header">
          <div className="brand-bar">
            <div className="brand-title">
              <Flame size={24} color="#F5C400" fill="#F5C400" /> FitAI X
            </div>
            <span className="brand-badge">Profile</span>
          </div>
        </div>
        <div className="profile-error-card">
          <AlertCircle size={40} />
          <h2>Unable to Load Profile</h2>
          <p>{fetchError}</p>
          <button className="dashboard-btn" onClick={fetchProfile} style={{ maxWidth: '240px', margin: '0 auto' }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  /* ═══════════════════════════════════════════════════════════
     DERIVED VALUES
  ═══════════════════════════════════════════════════════════ */
  const initials = `${(profile.first_name || '')[0] || ''}${(profile.last_name || '')[0] || ''}`.toUpperCase();
  const bestDays = parseJsonArray(profile.best_days);
  const equipment = parseJsonArray(profile.equipment_access);
  const isEditing = (s) => editingSection === s;

  /* ═══════════════════════════════════════════════════════════
     REUSABLE RENDER HELPERS
  ═══════════════════════════════════════════════════════════ */
  const ViewField = ({ label, value, fullWidth }) => (
    <div className={`profile-field${fullWidth ? ' profile-field-full' : ''}`}>
      <span className="profile-field-label">{label}</span>
      <span className="profile-field-value">{value || '—'}</span>
    </div>
  );

  const FormInput = ({ label, field, type = 'text', placeholder = '' }) => (
    <div className="profile-form-group">
      <label className="profile-form-label">{label}</label>
      <input
        type={type}
        className="profile-input"
        value={editData[field] || ''}
        onChange={(e) => handleChange(field, e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );

  const FormSelect = ({ label, field, options }) => (
    <div className="profile-form-group">
      <label className="profile-form-label">{label}</label>
      <select
        className="profile-select"
        value={editData[field] || ''}
        onChange={(e) => handleChange(field, e.target.value)}
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  const ChipSelector = ({ label, field, options }) => {
    const selected = parseJsonArray(editData[field]);
    return (
      <div className="profile-form-group profile-form-group-full">
        <label className="profile-form-label">{label}</label>
        <div className="profile-chips">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`profile-chip${selected.includes(opt) ? ' active' : ''}`}
              onClick={() => toggleChip(field, opt)}
            >
              {selected.includes(opt) && <Check size={12} />} {opt}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const SectionActions = () => (
    <div className="profile-actions">
      <button
        type="button"
        className="profile-cancel-btn"
        onClick={cancelEditing}
        disabled={isSaving}
      >
        <X size={16} /> Cancel
      </button>
      <button
        type="button"
        className="profile-save-btn"
        onClick={saveSection}
        disabled={isSaving}
      >
        {isSaving ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
        {isSaving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );

  /* ═══════════════════════════════════════════════════════════
     MAIN RENDER
  ═══════════════════════════════════════════════════════════ */
  return (
    <div className="profile-page">
      {/* ── Toast notification ───────────────────────────── */}
      {toast && (
        <div className={`profile-toast profile-toast-${toast.type}`}>
          <div className="profile-toast-icon">
            {toast.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          </div>
          <span className="profile-toast-msg">{toast.message}</span>
          <button className="profile-toast-close" onClick={() => setToast(null)}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Brand header ─────────────────────────────────── */}
      <div className="wizard-header">
        <div className="brand-bar">
          <div className="brand-title">
            <Flame size={24} color="#F5C400" fill="#F5C400" /> FitAI X
          </div>
          <span className="brand-badge">Profile</span>
        </div>
      </div>

      {/* ── Profile hero ─────────────────────────────────── */}
      <div className="profile-hero">
        <div className="profile-avatar">{initials || '?'}</div>
        <h1 className="profile-hero-name">{profile.first_name} {profile.last_name}</h1>
        <p className="profile-hero-email">{profile.email}</p>
      </div>

      {/* ════════════════════════════════════════════════════
         SECTION 1: BASIC PROFILE
      ════════════════════════════════════════════════════ */}
      <div className="profile-card">
        <div className="profile-card-header">
          <div className="profile-card-title"><User size={16} /> Basic Profile</div>
          {!isEditing('basic') && (
            <button className="profile-edit-btn" onClick={() => startEditing('basic')}>
              <Edit3 size={14} /> Edit
            </button>
          )}
        </div>

        {isEditing('basic') ? (
          <div className="profile-edit-form">
            <div className="profile-form-grid">
              <FormInput label="First Name" field="first_name" placeholder="e.g. Arjun" />
              <FormInput label="Last Name" field="last_name" placeholder="e.g. Sharma" />
              <FormInput label="Date of Birth" field="date_of_birth" type="date" />
              <FormSelect label="Gender" field="gender" options={GENDER_OPTIONS} />
              <div className="profile-form-group">
                <label className="profile-form-label">Weight</label>
                <div className="profile-unit-row">
                  <input
                    type="text"
                    className="profile-input"
                    value={editData.weight || ''}
                    onChange={(e) => handleChange('weight', e.target.value)}
                    placeholder="e.g. 68.5"
                  />
                  <select
                    className="profile-select profile-select-sm"
                    value={editData.weight_unit || 'kg'}
                    onChange={(e) => handleChange('weight_unit', e.target.value)}
                  >
                    {WEIGHT_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div className="profile-form-group">
                <label className="profile-form-label">Height</label>
                <div className="profile-unit-row">
                  <input
                    type="text"
                    className="profile-input"
                    value={editData.height || ''}
                    onChange={(e) => handleChange('height', e.target.value)}
                    placeholder="e.g. 172"
                  />
                  <select
                    className="profile-select profile-select-sm"
                    value={editData.height_unit || 'cm'}
                    onChange={(e) => handleChange('height_unit', e.target.value)}
                  >
                    {HEIGHT_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <SectionActions />
          </div>
        ) : (
          <div className="profile-fields">
            <ViewField label="Email Address" value={profile.email} />
            <ViewField label="Full Name" value={`${profile.first_name || ''} ${profile.last_name || ''}`.trim()} />
            <ViewField label="Date of Birth" value={profile.date_of_birth} />
            <ViewField label="Gender" value={profile.gender} />
            <ViewField label="Weight" value={profile.weight ? `${profile.weight} ${profile.weight_unit || 'kg'}` : null} />
            <ViewField label="Height" value={profile.height ? `${profile.height} ${profile.height_unit || 'cm'}` : null} />
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════
         SECTION 2: FITNESS & SCHEDULE
      ════════════════════════════════════════════════════ */}
      <div className="profile-card">
        <div className="profile-card-header">
          <div className="profile-card-title"><Target size={16} /> Fitness & Schedule</div>
          {!isEditing('fitness') && (
            <button className="profile-edit-btn" onClick={() => startEditing('fitness')}>
              <Edit3 size={14} /> Edit
            </button>
          )}
        </div>

        {isEditing('fitness') ? (
          <div className="profile-edit-form">
            <div className="profile-form-grid">
              <FormSelect label="Primary Goal" field="main_goal" options={GOAL_OPTIONS} />
              <FormSelect label="Training Location" field="training_location" options={LOCATION_OPTIONS} />

              {editData.main_goal === 'Prepare for an Event' && (
                <>
                  <FormInput label="Event Name" field="event_name" placeholder="e.g. HYROX, Boston Marathon" />
                  <FormInput label="Event Date" field="event_date" type="date" />
                </>
              )}

              <FormSelect label="Days per Week" field="days_per_week" options={DAYS_PER_WEEK_OPTIONS} />
              <FormSelect label="Session Duration" field="session_duration" options={SESSION_DURATION_OPTIONS} />
            </div>
            <ChipSelector label="Preferred Days" field="best_days" options={DAYS_OF_WEEK} />
            <ChipSelector label="Equipment Access" field="equipment_access" options={EQUIPMENT_LIST} />
            <SectionActions />
          </div>
        ) : (
          <div className="profile-fields">
            <ViewField label="Primary Goal" value={profile.main_goal} />
            <ViewField label="Training Location" value={profile.training_location} />
            {profile.main_goal === 'Prepare for an Event' && (
              <>
                <ViewField label="Event Name" value={profile.event_name} />
                <ViewField label="Event Date" value={profile.event_date} />
              </>
            )}
            <ViewField label="Days per Week" value={profile.days_per_week ? `${profile.days_per_week} day${parseInt(profile.days_per_week) > 1 ? 's' : ''} / week` : null} />
            <ViewField label="Session Duration" value={profile.session_duration} />
            <ViewField label="Preferred Days" value={bestDays.length > 0 ? bestDays.join(', ') : null} fullWidth />
            <ViewField label="Equipment" value={equipment.length > 0 ? equipment.join(', ') : 'None'} fullWidth />
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════
         SECTION 3: HEALTH & SAFETY
      ════════════════════════════════════════════════════ */}
      <div className="profile-card">
        <div className="profile-card-header">
          <div className="profile-card-title"><ShieldAlert size={16} /> Health & Safety</div>
          {!isEditing('health') && (
            <button className="profile-edit-btn" onClick={() => startEditing('health')}>
              <Edit3 size={14} /> Edit
            </button>
          )}
        </div>

        {isEditing('health') ? (
          <div className="profile-edit-form">
            <div className="profile-form-grid">
              <FormSelect label="Any Injury or Pain?" field="has_injury" options={YES_NO} />
              {editData.has_injury === 'Yes' && (
                <FormInput label="Injury Details" field="injury_details" placeholder="e.g. Right knee pain" />
              )}
              <FormSelect label="Medical Condition?" field="has_medical_condition" options={MEDICAL_OPTIONS} />
              {editData.has_medical_condition === 'Yes' && (
                <FormInput label="Condition Details" field="medical_condition_details" placeholder="e.g. Asthma" />
              )}
            </div>
            <SectionActions />
          </div>
        ) : (
          <div className="profile-fields">
            <ViewField
              label="Injury / Pain"
              value={profile.has_injury === 'Yes' ? `Yes — ${profile.injury_details || 'Unspecified'}` : (profile.has_injury || 'No')}
            />
            <ViewField
              label="Medical Condition"
              value={profile.has_medical_condition === 'Yes' ? `Yes — ${profile.medical_condition_details || 'Unspecified'}` : (profile.has_medical_condition || 'No')}
            />
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════
         SECTION 4: NUTRITION & LIFESTYLE
      ════════════════════════════════════════════════════ */}
      <div className="profile-card">
        <div className="profile-card-header">
          <div className="profile-card-title"><Leaf size={16} /> Nutrition & Lifestyle</div>
          {!isEditing('nutrition') && (
            <button className="profile-edit-btn" onClick={() => startEditing('nutrition')}>
              <Edit3 size={14} /> Edit
            </button>
          )}
        </div>

        {isEditing('nutrition') ? (
          <div className="profile-edit-form">
            <div className="profile-form-grid">
              <FormSelect label="Sleep (per night)" field="sleep_hours" options={SLEEP_OPTIONS} />
              <FormSelect label="Dietary Preference" field="dietary_preference" options={DIET_OPTIONS} />
              <FormSelect label="Food Allergies?" field="has_food_allergies" options={YES_NO} />
              {editData.has_food_allergies === 'Yes' && (
                <FormInput label="Allergy Details" field="food_allergies_details" placeholder="e.g. Peanuts, lactose" />
              )}
            </div>
            <SectionActions />
          </div>
        ) : (
          <div className="profile-fields">
            <ViewField label="Sleep (per night)" value={profile.sleep_hours} />
            <ViewField label="Dietary Preference" value={profile.dietary_preference} />
            <ViewField
              label="Food Allergies"
              value={profile.has_food_allergies === 'Yes' ? `Yes — ${profile.food_allergies_details || 'Unspecified'}` : (profile.has_food_allergies || 'No')}
            />
          </div>
        )}
      </div>

      {/* ── Footer actions ───────────────────────────────── */}
      <div className="profile-footer">
        {onBackToDashboard && (
          <button type="button" className="btn-secondary" onClick={onBackToDashboard}>
            <ArrowLeft size={16} /> Dashboard
          </button>
        )}
        <button
          type="button"
          className="profile-reset-btn"
          onClick={onReset}
        >
          Reset Profile
        </button>
      </div>
    </div>
  );
}
