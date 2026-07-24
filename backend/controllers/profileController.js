import { pool } from '../db.js';
import crypto from 'crypto';

// GET /api/config/cloudinary
export const getCloudinaryConfig = async (req, res) => {
  res.json({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || ''
  });
};

// POST /api/upload/cloudinary
export const uploadCloudinaryImage = async (req, res) => {
  const { fileData } = req.body;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!fileData) {
    return res.status(400).json({ error: 'fileData parameter is required.' });
  }

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(500).json({ error: 'Cloudinary environment variables missing in .env' });
  }

  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const strToSign = `timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(strToSign).digest('hex');

    const params = new URLSearchParams();
    params.append('file', fileData);
    params.append('api_key', apiKey);
    params.append('timestamp', timestamp.toString());
    params.append('signature', signature);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: params,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Cloudinary upload failed');
    }

    res.json({ secure_url: data.secure_url, public_id: data.public_id });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ error: 'Cloudinary upload error', details: error.message });
  }
};

// GET /api/profile/:email/summary
export const getProfileSummary = async (req, res) => {
  const { email } = req.params;
  const cleanEmail = email.trim().toLowerCase();

  try {
    const userResult = await pool.query(
      'SELECT * FROM onboarding_responses WHERE email = $1',
      [cleanEmail]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'Profile not found.' });
    }

    const settingsResult = await pool.query(
      'SELECT * FROM user_settings WHERE email = $1',
      [cleanEmail]
    );

    const user = userResult.rows[0];
    const settings = settingsResult.rows.length > 0 ? settingsResult.rows[0] : {};

    res.json({
      profile: user,
      settings: settings
    });
  } catch (error) {
    console.error('Error fetching profile summary:', error);
    res.status(500).json({ error: 'Failed to retrieve profile summary', details: error.message });
  }
};

// PUT /api/profile/:email/personal-info
export const updatePersonalInfo = async (req, res) => {
  const { email } = req.params;
  const cleanEmail = email.trim().toLowerCase();
  const { first_name, last_name, date_of_birth, gender, weight, weight_unit, height, height_unit } = req.body;

  try {
    const result = await pool.query(
      `UPDATE onboarding_responses SET 
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        date_of_birth = COALESCE($3, date_of_birth),
        gender = COALESCE($4, gender),
        weight = COALESCE($5, weight),
        weight_unit = COALESCE($6, weight_unit),
        height = COALESCE($7, height),
        height_unit = COALESCE($8, height_unit),
        updated_at = NOW()
      WHERE email = $9 RETURNING *`,
      [first_name, last_name, date_of_birth, gender, weight, weight_unit, height, height_unit, cleanEmail]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: 'Profile not found.' });
    res.json({ message: 'Personal info updated successfully', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update personal info', details: error.message });
  }
};

// PUT /api/profile/:email/avatar
export const updateAvatar = async (req, res) => {
  const { email } = req.params;
  const cleanEmail = email.trim().toLowerCase();
  const { avatar_url } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO onboarding_responses (email, avatar_url, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (email) DO UPDATE SET 
         avatar_url = EXCLUDED.avatar_url,
         updated_at = NOW()
       RETURNING *`,
      [cleanEmail, avatar_url]
    );

    res.json({ message: 'Avatar updated successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Avatar DB update error:', error);
    res.status(500).json({ error: 'Failed to update avatar in database', details: error.message });
  }
};

// PUT /api/profile/:email/fitness
export const updateFitnessProfile = async (req, res) => {
  const { email } = req.params;
  const cleanEmail = email.trim().toLowerCase();
  const { main_goal, event_name, event_date, days_per_week, best_days, session_duration, training_location } = req.body;

  try {
    const result = await pool.query(
      `UPDATE onboarding_responses SET 
        main_goal = COALESCE($1, main_goal),
        event_name = COALESCE($2, event_name),
        event_date = COALESCE($3, event_date),
        days_per_week = COALESCE($4, days_per_week),
        best_days = COALESCE($5, best_days),
        session_duration = COALESCE($6, session_duration),
        training_location = COALESCE($7, training_location),
        updated_at = NOW()
      WHERE email = $8 RETURNING *`,
      [main_goal, event_name, event_date, days_per_week, best_days ? JSON.stringify(best_days) : null, session_duration, training_location, cleanEmail]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: 'Profile not found.' });
    res.json({ message: 'Fitness profile updated successfully', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update fitness profile', details: error.message });
  }
};

// PUT /api/profile/:email/equipment
export const updateEquipment = async (req, res) => {
  const { email } = req.params;
  const cleanEmail = email.trim().toLowerCase();
  const { equipment_access } = req.body;

  try {
    const result = await pool.query(
      `UPDATE onboarding_responses SET 
        equipment_access = $1,
        updated_at = NOW()
      WHERE email = $2 RETURNING *`,
      [JSON.stringify(equipment_access || []), cleanEmail]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: 'Profile not found.' });
    res.json({ message: 'Equipment updated successfully', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update equipment', details: error.message });
  }
};

// PUT /api/profile/:email/injury
export const updateInjuryHistory = async (req, res) => {
  const { email } = req.params;
  const cleanEmail = email.trim().toLowerCase();
  const { has_injury, injury_details, has_medical_condition, medical_condition_details } = req.body;

  try {
    const result = await pool.query(
      `UPDATE onboarding_responses SET 
        has_injury = COALESCE($1, has_injury),
        injury_details = COALESCE($2, injury_details),
        has_medical_condition = COALESCE($3, has_medical_condition),
        medical_condition_details = COALESCE($4, medical_condition_details),
        updated_at = NOW()
      WHERE email = $5 RETURNING *`,
      [has_injury, injury_details, has_medical_condition, medical_condition_details, cleanEmail]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: 'Profile not found.' });
    res.json({ message: 'Injury history updated successfully', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update injury history', details: error.message });
  }
};

// GET /api/profile/:email/settings
export const getSettings = async (req, res) => {
  const { email } = req.params;
  const cleanEmail = email.trim().toLowerCase();

  try {
    const result = await pool.query(
      'SELECT * FROM user_settings WHERE email = $1',
      [cleanEmail]
    );

    if (result.rows.length === 0) {
      // Return default settings if none exist
      return res.json({
        data: {
          ai_preferences: {},
          notifications: {},
          theme_settings: {},
          privacy: {},
          security: {},
          connected_devices: [],
          subscription: {}
        }
      });
    }

    res.json({ data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve settings', details: error.message });
  }
};

// PUT /api/profile/:email/settings
export const updateSettings = async (req, res) => {
  const { email } = req.params;
  const cleanEmail = email.trim().toLowerCase();
  const { ai_preferences, notifications, theme_settings, privacy, security, connected_devices, subscription } = req.body;

  try {
    // Upsert logic for user_settings
    const queryText = `
      INSERT INTO user_settings (
        email, ai_preferences, notifications, theme_settings, privacy, security, connected_devices, subscription, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, NOW()
      )
      ON CONFLICT (email) DO UPDATE SET
        ai_preferences = COALESCE(EXCLUDED.ai_preferences, user_settings.ai_preferences),
        notifications = COALESCE(EXCLUDED.notifications, user_settings.notifications),
        theme_settings = COALESCE(EXCLUDED.theme_settings, user_settings.theme_settings),
        privacy = COALESCE(EXCLUDED.privacy, user_settings.privacy),
        security = COALESCE(EXCLUDED.security, user_settings.security),
        connected_devices = COALESCE(EXCLUDED.connected_devices, user_settings.connected_devices),
        subscription = COALESCE(EXCLUDED.subscription, user_settings.subscription),
        updated_at = NOW()
      RETURNING *;
    `;

    const values = [
      cleanEmail,
      ai_preferences ? JSON.stringify(ai_preferences) : null,
      notifications ? JSON.stringify(notifications) : null,
      theme_settings ? JSON.stringify(theme_settings) : null,
      privacy ? JSON.stringify(privacy) : null,
      security ? JSON.stringify(security) : null,
      connected_devices ? JSON.stringify(connected_devices) : null,
      subscription ? JSON.stringify(subscription) : null
    ];

    const result = await pool.query(queryText, values);
    res.json({ message: 'Settings updated successfully', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings', details: error.message });
  }
};

// GET /api/profile/:email/export
export const exportUserData = async (req, res) => {
  const { email } = req.params;
  const cleanEmail = email.trim().toLowerCase();

  try {
    const userResult = await pool.query('SELECT * FROM onboarding_responses WHERE email = $1', [cleanEmail]);
    const settingsResult = await pool.query('SELECT * FROM user_settings WHERE email = $1', [cleanEmail]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'Profile not found.' });
    }

    const exportData = {
      profile: userResult.rows[0],
      settings: settingsResult.rows.length > 0 ? settingsResult.rows[0] : null,
      exportDate: new Date().toISOString()
    };

    res.json({ message: 'Data export successful', data: exportData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to export data', details: error.message });
  }
};
