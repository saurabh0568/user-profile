import React, { useState, useEffect } from 'react';
import {
  Flame, User, Target, ShieldAlert, Leaf,
  Edit3, Save, X, Check, Loader2, AlertCircle, ArrowLeft,
  Camera, Upload, Link, CheckCircle2, RefreshCw, Settings, Sparkles, Download,
  Smartphone, Moon, Sun, Lock, CreditCard, Bell, Eye, LogOut, CheckSquare
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
   SIDEBAR TABS DEFINITION — Covering all 14 Sections from Image 2
═══════════════════════════════════════════════════════════════ */
const TABS = [
  { id: 'personal', label: 'Personal Information', icon: User, badge: 'Profile' },
  { id: 'fitness', label: 'Fitness & Goals', icon: Target, badge: 'Workout' },
  { id: 'health', label: 'Injury History', icon: ShieldAlert, badge: 'Medical' },
  { id: 'ai', label: 'AI Preferences & Alerts', icon: Sparkles, badge: 'Smart AI' },
  { id: 'devices', label: 'Connected Devices', icon: Smartphone, badge: 'Sync' },
  { id: 'theme', label: 'Theme & Privacy', icon: Moon, badge: 'Display' },
  { id: 'subscription', label: 'Subscription Plan', icon: CreditCard, badge: 'Membership' },
  { id: 'security', label: 'Security & Export', icon: Lock, badge: 'Account' },
];

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
];

const DEVICE_ICONS = {
  apple: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF2D55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  ),
  garmin: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00A0D1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="12 6 15 12 12 18 9 12 12 6" />
    </svg>
  ),
  strava: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#FC4C02">
      <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l3.436 6.782h3.066L11.813 0 5.031 13.527h3.066z"/>
    </svg>
  ),
  whoop: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F5C400" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  fitbit: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00B0B9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="7" />
      <line x1="12" y1="18" x2="12" y2="18.01" strokeWidth="3" />
    </svg>
  ),
  oura: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  )
};

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
  const [settings, setSettings] = useState({});
  const [editData, setEditData] = useState({});
  const [editingSection, setEditingSection] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [toast, setToast] = useState(null);
  const [daysError, setDaysError] = useState('');

  // Cloudinary Avatar Modal state
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState('');

  // Theme State
  const [themeMode, setThemeMode] = useState('dark');

  // Connected Devices state
  const [devices, setDevices] = useState([
    { id: 'apple', iconKey: 'apple', name: 'Apple Health', category: 'Health & Activity', connected: true, lastSync: '5 mins ago' },
    { id: 'garmin', iconKey: 'garmin', name: 'Garmin Connect', category: 'GPS & Heart Rate', connected: true, lastSync: '1 hour ago' },
    { id: 'strava', iconKey: 'strava', name: 'Strava', category: 'Running & Cycling', connected: false, lastSync: 'Never' },
    { id: 'whoop', iconKey: 'whoop', name: 'Whoop 4.0', category: 'Recovery & Strain', connected: true, lastSync: '10 mins ago' },
    { id: 'fitbit', iconKey: 'fitbit', name: 'Fitbit', category: 'Activity Tracker', connected: false, lastSync: 'Never' },
    { id: 'oura', iconKey: 'oura', name: 'Oura Ring Gen 3', category: 'Sleep & Temperature', connected: false, lastSync: 'Never' },
  ]);

  const email = answers?.email || '';

  const isManualScrolling = React.useRef(false);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    isManualScrolling.current = true;
    const targetEl = document.getElementById(`section-${tabId}`);
    if (targetEl) {
      const yOffset = -24;
      const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setTimeout(() => {
      isManualScrolling.current = false;
    }, 800);
  };

  useEffect(() => {
    if (!email) {
      setProfile(answers || {});
      setIsLoading(false);
      return;
    }
    fetchProfile();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    if (isLoading || !profile) return;

    const handleScroll = () => {
      if (isManualScrolling.current) return;

      const scrollPosition = window.scrollY + 180;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;

      if (window.scrollY + windowHeight >= documentHeight - 60) {
        setActiveTab(TABS[TABS.length - 1].id);
        return;
      }

      for (let i = TABS.length - 1; i >= 0; i--) {
        const tab = TABS[i];
        const el = document.getElementById(`section-${tab.id}`);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top - 60) {
            setActiveTab(tab.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, profile]);

  const toggleTheme = (mode) => {
    setThemeMode(mode);
    if (mode === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    setToast({ type: 'success', message: `Theme switched to ${mode.toUpperCase()} mode` });
  };

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
      setSettings(data.settings || {});
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

  // ── Cloudinary Avatar Upload Logic ───────────────────────
  const saveAvatarUrlToBackend = async (url) => {
    setIsUploadingAvatar(true);
    setAvatarError('');
    try {
      const res = await fetch(`/api/profile/${encodeURIComponent(email)}/avatar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar_url: url }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details || data.error || 'Failed to update avatar in database.');
      }

      setProfile((prev) => ({ ...prev, avatar_url: url }));
      setShowAvatarModal(false);
      setToast({ type: 'success', message: 'Profile picture updated via Cloudinary!' });
    } catch (err) {
      console.error('Save avatar error:', err);
      setAvatarError(err.message || 'Failed to save avatar.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    setAvatarError('');

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result;

        // Try backend Cloudinary endpoint (uses credentials in .env)
        try {
          const res = await fetch('/api/upload/cloudinary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileData: base64Data }),
          });

          const data = await res.json();
          if (res.ok && data.secure_url) {
            await saveAvatarUrlToBackend(data.secure_url);
            return;
          }
        } catch (backendErr) {
          console.warn('Backend Cloudinary upload endpoint fallback:', backendErr);
        }

        // Direct save fallback
        await saveAvatarUrlToBackend(base64Data);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('File upload error:', err);
      setAvatarError('Failed to process image file.');
      setIsUploadingAvatar(false);
    }
  };

  // ── Toggle Device Connection ─────────────────────────────
  const toggleDeviceConnection = (id) => {
    setDevices((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const nextState = !d.connected;
          return {
            ...d,
            connected: nextState,
            lastSync: nextState ? 'Just now' : 'Never',
          };
        }
        return d;
      })
    );
    setToast({ type: 'success', message: 'Device status updated successfully' });
  };

  // ── Edit handlers ─────────────────────────────────────────
  const startEditing = (section) => {
    setEditData({ ...profile, ...settings });
    setEditingSection(section);
    setDaysError('');
  };

  const cancelEditing = () => {
    setEditingSection(null);
    setEditData({});
    setDaysError('');
  };

  const handleChange = (field, value) => {
    setEditData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'days_per_week') {
        const maxDays = parseInt(value) || 7;
        const currentSelected = parseJsonArray(prev.best_days);
        if (currentSelected.length > maxDays) {
          setDaysError(`⚠️ You have selected ${currentSelected.length} workout days, but 'Days per Week' is set to ${value}. You can only select up to ${value} days.`);
        } else {
          setDaysError('');
        }
      }
      return updated;
    });
  };

  const toggleChip = (field, value) => {
    setEditData((prev) => {
      const current = parseJsonArray(prev[field]);
      if (field === 'best_days') {
        const maxDays = parseInt(prev.days_per_week) || 7;
        if (!current.includes(value)) {
          if (current.length >= maxDays) {
            setDaysError(`⚠️ You can select only ${maxDays} workout day${maxDays > 1 ? 's' : ''} according to your 'Days per Week' setting (${maxDays} day${maxDays > 1 ? 's' : ''}/week).`);
            return prev;
          }
          setDaysError('');
        } else {
          if (current.length - 1 <= maxDays) {
            setDaysError('');
          }
        }
      }

      if (current.includes(value)) {
        return { ...prev, [field]: current.filter((v) => v !== value) };
      }
      return { ...prev, [field]: [...current, value] };
    });
  };

  // ── Save Section ──────────────────────────────────────────
  const saveSection = async () => {
    setIsSaving(true);
    try {
      const enc = encodeURIComponent(email);

      if (editingSection === 'personal') {
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
        if (!res.ok) throw new Error('Failed to update health info.');
      }

      setProfile((prev) => ({ ...prev, ...editData }));
      setEditingSection(null);
      setEditData({});
      setToast({ type: 'success', message: 'Profile changes saved!' });
    } catch (err) {
      console.error('Save error:', err);
      setToast({ type: 'error', message: err.message || 'Failed to save changes.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      const res = await fetch(`/api/profile/${encodeURIComponent(email)}/export`);
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fitai_profile_${email.replace(/[^a-z0-9]/gi, '_')}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setToast({ type: 'success', message: 'Profile data exported successfully.' });
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to export profile data.' });
    }
  };

  if (isLoading) {
    return (
      <div className="profile-container-wide">
        <div className="profile-header-bar">
          <div className="brand-bar" style={{ marginBottom: 0 }}>
            <div className="brand-title">
              <Flame size={26} color="#F5C400" fill="#F5C400" /> FitAI X
            </div>
            <span className="brand-badge">Profile</span>
          </div>
        </div>
        <div className="profile-loading" style={{ padding: '60px', textAlign: 'center' }}>
          <Loader2 size={40} className="animate-spin" style={{ animation: 'spin 1s linear infinite', color: 'var(--gold)', margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text2)' }}>Loading user profile & settings from Neon DB...</p>
        </div>
      </div>
    );
  }

  if (fetchError && !profile) {
    return (
      <div className="profile-container-wide">
        <div className="profile-header-bar">
          <div className="brand-bar" style={{ marginBottom: 0 }}>
            <div className="brand-title">
              <Flame size={26} color="#F5C400" fill="#F5C400" /> FitAI X
            </div>
            <span className="brand-badge">Profile</span>
          </div>
        </div>
        <div className="profile-error-card">
          <AlertCircle size={40} />
          <h2>Unable to Load Profile</h2>
          <p>{fetchError}</p>
          <button className="btn-primary" onClick={fetchProfile} style={{ maxWidth: '240px', margin: '0 auto' }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const initials = `${(profile.first_name || '')[0] || ''}${(profile.last_name || '')[0] || ''}`.toUpperCase() || 'U';
  const bestDays = parseJsonArray(profile.best_days);
  const equipment = parseJsonArray(profile.equipment_access);
  const isEditing = (s) => editingSection === s;

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
        {field === 'best_days' && daysError && (
          <div style={{
            marginTop: '10px',
            padding: '8px 12px',
            borderRadius: '8px',
            background: 'rgba(245, 196, 0, 0.12)',
            border: '1px solid rgba(245, 196, 0, 0.4)',
            color: 'var(--gold-bright)',
            fontSize: '12.5px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={15} color="var(--gold-bright)" style={{ flexShrink: 0 }} />
            <span>{daysError}</span>
          </div>
        )}
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

  return (
    <div className="profile-container-wide">
      {/* ── Toast Notification ──────────────────────────── */}
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

      {/* ── Header ─────────────────────────────────────── */}
      <div className="profile-header-bar">
        <div className="brand-bar" style={{ marginBottom: 0 }}>
          <div className="brand-title">
            <Flame size={26} color="#F5C400" fill="#F5C400" /> FitAI X
          </div>
          <span className="brand-badge">Profile & Settings</span>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Quick Theme Switcher */}
          <div className="theme-toggle-pill">
            <button
              type="button"
              className={`theme-pill-btn ${themeMode === 'dark' ? 'active' : ''}`}
              onClick={() => toggleTheme('dark')}
              title="Dark Mode"
            >
              <Moon size={14} />
            </button>
            <button
              type="button"
              className={`theme-pill-btn ${themeMode === 'light' ? 'active' : ''}`}
              onClick={() => toggleTheme('light')}
              title="Light Mode"
            >
              <Sun size={14} />
            </button>
          </div>

          {onBackToDashboard && (
            <button type="button" className="btn-secondary" onClick={onBackToDashboard} style={{ padding: '9px 16px', fontSize: '13px' }}>
              <ArrowLeft size={16} /> Dashboard
            </button>
          )}

          <button type="button" className="profile-reset-btn" onClick={onReset} style={{ padding: '9px 16px', fontSize: '13px' }}>
            <LogOut size={14} style={{ marginRight: '4px' }} /> Switch Account
          </button>
        </div>
      </div>

      {/* ── Mobile Scrollable Tab Bar ───────────────────── */}
      <div className="profile-mobile-tabs">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              data-tab={tab.id}
              type="button"
              className={`profile-mobile-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.id)}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Main Responsive Layout Grid ─────────────────── */}
      <div className="profile-layout-grid">
        {/* ════════════════════════════════════════════════
           LEFT SIDEBAR TABS (DESKTOP / LAPTOP)
        ════════════════════════════════════════════════ */}
        <div className="profile-sidebar">
          {/* User Profile Card & Cloudinary Avatar */}
          <div className="profile-user-card">
            <div className="profile-avatar-container">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Profile Avatar"
                  className="profile-avatar-img"
                />
              ) : (
                <div className="profile-avatar-initials">{initials}</div>
              )}
              <button
                type="button"
                className="avatar-upload-badge"
                title="Change Avatar (Cloudinary)"
                onClick={() => setShowAvatarModal(true)}
              >
                <Camera size={14} />
              </button>
            </div>

            <h2 className="profile-user-name">{profile.first_name || 'Athlete'} {profile.last_name || ''}</h2>
            <p className="profile-user-email">{profile.email}</p>
            <div className="profile-badge-tag">
              <Sparkles size={12} /> FitAI Pro Member
            </div>
          </div>

          {/* Sidebar Tabs List */}
          <div className="profile-sidebar-tabs">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`sidebar-tab-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleTabClick(tab.id)}
                >
                  <div className="sidebar-tab-icon">
                    <Icon size={18} />
                  </div>
                  <div className="sidebar-tab-text">
                    <span className="sidebar-tab-title">{tab.label}</span>
                    <span className="sidebar-tab-sub">{tab.badge}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ════════════════════════════════════════════════
           RIGHT MAIN CONTENT AREA — SINGLE CONTINUOUS LARGE CARD
        ════════════════════════════════════════════════ */}
        <div className="profile-main-content">
          <div className="profile-single-card">

            {/* 1. PERSONAL INFORMATION */}
            <div id="section-personal" className="profile-section-block">
              <div className="profile-card-header">
                <div className="profile-card-title">
                  <User size={18} color="var(--gold)" /> Personal Information
                </div>
                {!isEditing('personal') && (
                  <button className="profile-edit-btn" onClick={() => startEditing('personal')}>
                    <Edit3 size={14} /> Edit
                  </button>
                )}
              </div>

              {isEditing('personal') ? (
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

            {/* 2. FITNESS PROFILE, GOALS & EQUIPMENT */}
            <div id="section-fitness" className="profile-section-block">
              <div className="profile-card-header">
                <div className="profile-card-title">
                  <Target size={18} color="var(--gold)" /> Fitness Profile, Goals & Equipment
                </div>
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
                        <FormInput label="Event Name" field="event_name" placeholder="e.g. HYROX, Marathon" />
                        <FormInput label="Event Date" field="event_date" type="date" />
                      </>
                    )}

                    <FormSelect label="Days per Week" field="days_per_week" options={DAYS_PER_WEEK_OPTIONS} />
                    <FormSelect label="Session Duration" field="session_duration" options={SESSION_DURATION_OPTIONS} />
                  </div>

                  <ChipSelector label="Preferred Workout Days" field="best_days" options={DAYS_OF_WEEK} />
                  <ChipSelector label="Available Equipment" field="equipment_access" options={EQUIPMENT_LIST} />
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
                  <ViewField label="Days per Week" value={profile.days_per_week ? `${profile.days_per_week} days / week` : null} />
                  <ViewField label="Session Duration" value={profile.session_duration} />
                  <ViewField label="Preferred Workout Days" value={bestDays.length > 0 ? bestDays.join(', ') : 'Not specified'} fullWidth />
                  <ViewField label="Available Equipment" value={equipment.length > 0 ? equipment.join(', ') : 'Bodyweight only'} fullWidth />
                </div>
              )}
            </div>

            {/* 3. INJURY HISTORY & HEALTH */}
            <div id="section-health" className="profile-section-block">
              <div className="profile-card-header">
                <div className="profile-card-title">
                  <ShieldAlert size={18} color="var(--gold)" /> Injury History & Medical Safety
                </div>
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
                    label="Injury / Pain Record"
                    value={profile.has_injury === 'Yes' ? `Yes — ${profile.injury_details || 'Unspecified details'}` : (profile.has_injury || 'No injuries reported')}
                    fullWidth
                  />
                  <ViewField
                    label="Medical Condition Record"
                    value={profile.has_medical_condition === 'Yes' ? `Yes — ${profile.medical_condition_details || 'Unspecified details'}` : (profile.has_medical_condition || 'No medical conditions reported')}
                    fullWidth
                  />
                </div>
              )}
            </div>

            {/* 4. AI PREFERENCES & NOTIFICATIONS */}
            <div id="section-ai" className="profile-section-block">
              <div className="profile-card-header">
                <div className="profile-card-title">
                  <Sparkles size={18} color="var(--gold)" /> AI Coaching Preferences & Notifications
                </div>
              </div>

              <div className="profile-fields">
                <ViewField label="AI Coaching Style" value="Balanced & Adaptive" />
                <ViewField label="Auto-Progress Weight" value="Enabled (Based on RPE)" />
                <ViewField label="Push Notifications" value="Enabled (Reminders 30m prior)" />
                <ViewField label="Weekly Email Summary" value="Enabled (Sent every Sunday)" />
              </div>

              <div style={{ marginTop: '20px', padding: '16px', borderRadius: '12px', background: 'rgba(245, 196, 0, 0.05)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontWeight: '700', color: 'var(--gold)' }}>
                  <Bell size={16} /> Intelligent Advice Frequency
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: '1.5' }}>
                  FitAI X continuously analyzes your session completion, sleep quality, and recovery curves to automatically calibrate workout load.
                </p>
              </div>
            </div>

            {/* 5. CONNECTED DEVICES */}
            <div id="section-devices" className="profile-section-block">
              <div className="profile-card-header">
                <div className="profile-card-title">
                  <Smartphone size={18} color="var(--gold)" /> Connected Wearables & Fitness Apps
                </div>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '20px' }}>
                Sync heart rate, sleep metrics, HRV, and workout data directly from your favorite wearable hardware.
              </p>

              <div className="devices-grid">
                {devices.map((dev) => (
                  <div key={dev.id} className="device-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="device-icon">{DEVICE_ICONS[dev.iconKey]}</div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)' }}>{dev.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text2)' }}>{dev.category}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '11px', color: dev.connected ? 'var(--green)' : 'var(--text-dim)', fontWeight: '600' }}>
                        {dev.connected ? `Connected (${dev.lastSync})` : 'Not Connected'}
                      </span>

                      <button
                        type="button"
                        className={`device-connect-btn ${dev.connected ? 'connected' : ''}`}
                        onClick={() => toggleDeviceConnection(dev.id)}
                      >
                        {dev.connected ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. THEME SETTINGS & PRIVACY */}
            <div id="section-theme" className="profile-section-block">
              <div className="profile-card-header">
                <div className="profile-card-title">
                  <Moon size={18} color="var(--gold)" /> Theme Settings & Privacy
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label className="profile-form-label" style={{ marginBottom: '10px', display: 'block' }}>
                  Interface Theme
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  <button
                    type="button"
                    className={`theme-select-card ${themeMode === 'dark' ? 'selected' : ''}`}
                    onClick={() => toggleTheme('dark')}
                  >
                    <Moon size={24} color={themeMode === 'dark' ? 'var(--gold)' : 'var(--text2)'} />
                    <div style={{ fontSize: '14px', fontWeight: '700', marginTop: '8px' }}>Dark Gold Theme</div>
                    <div style={{ fontSize: '11px', color: 'var(--text2)' }}>High-contrast dark mode</div>
                  </button>

                  <button
                    type="button"
                    className={`theme-select-card ${themeMode === 'light' ? 'selected' : ''}`}
                    onClick={() => toggleTheme('light')}
                  >
                    <Sun size={24} color={themeMode === 'light' ? 'var(--gold)' : 'var(--text2)'} />
                    <div style={{ fontSize: '14px', fontWeight: '700', marginTop: '8px' }}>Light Mode</div>
                    <div style={{ fontSize: '11px', color: 'var(--text2)' }}>Clean high-visibility light theme</div>
                  </button>
                </div>
              </div>

              <div style={{ paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                <div className="profile-card-title" style={{ fontSize: '15px', marginBottom: '12px' }}>
                  <Eye size={16} color="var(--gold)" /> Privacy Settings
                </div>
                <div className="profile-fields">
                  <ViewField label="Profile Visibility" value="Private (Only visible to you & AI coach)" />
                  <ViewField label="Analytics Data Sharing" value="Opted-in (Anonymized telemetry)" />
                </div>
              </div>
            </div>

            {/* 7. SUBSCRIPTION */}
            <div id="section-subscription" className="profile-section-block">
              <div className="profile-card-header">
                <div className="profile-card-title">
                  <CreditCard size={18} color="var(--gold)" /> Subscription & Membership
                </div>
              </div>

              <div className="subscription-banner">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <span className="subscription-badge"><Sparkles size={12} /> PRO ATHLETE PLAN</span>
                    <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text)', marginTop: '8px' }}>FitAI Pro Annual</h2>
                    <p style={{ fontSize: '13px', color: 'var(--text2)', marginTop: '4px' }}>Billed annually ($99/year) · Renews August 2027</p>
                  </div>
                  <button type="button" className="btn-primary" style={{ width: 'auto', padding: '10px 18px', fontSize: '13px' }}>
                    Manage Plan
                  </button>
                </div>

                <div className="subscription-perks-grid">
                  <div className="perk-item"><CheckCircle2 size={16} color="var(--gold)" /> Personalized AI Workout & Recovery Plans</div>
                  <div className="perk-item"><CheckCircle2 size={16} color="var(--gold)" /> Heart Rate & HRV Health Analytics</div>
                  <div className="perk-item"><CheckCircle2 size={16} color="var(--gold)" /> Injury Prevention & Mobility Guidance</div>
                  <div className="perk-item"><CheckCircle2 size={16} color="var(--gold)" /> Custom Nutrition & Sleep Calibrations</div>
                </div>
              </div>
            </div>

            {/* 8. SECURITY & EXPORT */}
            <div id="section-security" className="profile-section-block">
              <div className="profile-card-header">
                <div className="profile-card-title">
                  <Lock size={18} color="var(--gold)" /> Security, Data Export & Account
                </div>
              </div>

              <div className="profile-fields" style={{ marginBottom: '24px' }}>
                <ViewField label="Primary Key Email" value={profile.email} fullWidth />
                <ViewField label="Two-Factor Auth (2FA)" value="Disabled" />
                <ViewField label="Active Sessions" value="1 Active (This Browser)" />
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleExportData}
                  style={{ width: 'auto', padding: '12px 20px', fontSize: '13px' }}
                >
                  <Download size={16} /> Export All Data (JSON)
                </button>

                <button
                  type="button"
                  className="profile-reset-btn"
                  onClick={onReset}
                  style={{ padding: '12px 20px', fontSize: '13px' }}
                >
                  <LogOut size={16} style={{ marginRight: '6px' }} /> Switch Account / Logout
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════
         CLOUDINARY AVATAR UPLOAD MODAL
      ════════════════════════════════════════════════ */}
      {showAvatarModal && (
        <div className="avatar-modal-backdrop" onClick={() => setShowAvatarModal(false)}>
          <div className="avatar-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="avatar-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="modal-icon-badge"><Camera size={20} /></div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text)' }}>Update Profile Picture</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text2)' }}>Powered by Cloudinary Storage</p>
                </div>
              </div>
              <button className="profile-toast-close" onClick={() => setShowAvatarModal(false)}>
                <X size={18} />
              </button>
            </div>

            {avatarError && (
              <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--red)', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
                ⚠️ {avatarError}
              </div>
            )}

            {/* Option 1: File Upload directly to Cloudinary API */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '8px' }}>
                Option 1: Upload Image via Cloudinary
              </label>
              <label className="cloudinary-drop-zone">
                <Upload size={28} color="var(--gold)" />
                <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', marginTop: '8px' }}>
                  {isUploadingAvatar ? 'Uploading to Cloudinary...' : 'Click to select photo or drag & drop'}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>
                  PNG, JPG, WEBP formats supported
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploadingAvatar}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            {/* Option 2: Choose preset fitness avatar */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '8px' }}>
                Option 2: Select Pro Avatar Preset
              </label>
              <div className="preset-avatar-grid">
                {PRESET_AVATARS.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Avatar ${idx}`}
                    className={`preset-avatar-item ${profile.avatar_url === url ? 'selected' : ''}`}
                    onClick={() => saveAvatarUrlToBackend(url)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
