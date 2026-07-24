import { pool } from '../db.js';

// GET /api/health
export const healthCheck = async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'healthy',
      dbConnected: true,
      timestamp: result.rows[0].now,
      service: 'FitAI X Onboarding Backend (Modular)'
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      dbConnected: false,
      error: error.message
    });
  }
};

// GET /api/onboarding/check/:email
export const checkEmailExists = async (req, res) => {
  const { email } = req.params;
  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Email parameter is required.' });
  }
  const cleanEmail = email.trim().toLowerCase();
  try {
    const result = await pool.query(
      'SELECT email FROM onboarding_responses WHERE email = $1',
      [cleanEmail]
    );
    return res.json({ exists: result.rows.length > 0 });
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({ error: 'Failed to verify email availability', details: error.message });
  }
};

// POST /api/onboarding (Upsert)
export const saveOnboarding = async (req, res) => {
  const {
    email,
    avatar_url,
    first_name,
    last_name,
    date_of_birth,
    gender,
    weight,
    weight_unit = 'kg',
    height,
    height_unit = 'cm',
    main_goal,
    event_name,
    event_date,
    days_per_week,
    best_days = [],
    session_duration,
    training_location,
    equipment_access = [],
    has_injury,
    injury_details,
    has_medical_condition,
    medical_condition_details,
    sleep_hours,
    dietary_preference,
    has_food_allergies,
    food_allergies_details,
    is_completed = false,
    current_step = 1
  } = req.body;

  if (!email || typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({
      error: 'Primary key "email" is required and cannot be empty.'
    });
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    const queryText = `
      INSERT INTO onboarding_responses (
        email, avatar_url, first_name, last_name, date_of_birth, gender,
        weight, weight_unit, height, height_unit,
        main_goal, event_name, event_date,
        days_per_week, best_days,
        session_duration, training_location, equipment_access,
        has_injury, injury_details, has_medical_condition,
        medical_condition_details, sleep_hours, dietary_preference,
        has_food_allergies, food_allergies_details, is_completed, current_step, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10,
        $11, $12, $13,
        $14, $15,
        $16, $17, $18,
        $19, $20, $21,
        $22, $23, $24,
        $25, $26, $27, $28, NOW()
      )
      ON CONFLICT (email) DO UPDATE SET
        avatar_url = COALESCE(EXCLUDED.avatar_url, onboarding_responses.avatar_url),
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        date_of_birth = EXCLUDED.date_of_birth,
        gender = EXCLUDED.gender,
        weight = EXCLUDED.weight,
        weight_unit = EXCLUDED.weight_unit,
        height = EXCLUDED.height,
        height_unit = EXCLUDED.height_unit,
        main_goal = EXCLUDED.main_goal,
        event_name = EXCLUDED.event_name,
        event_date = EXCLUDED.event_date,
        days_per_week = EXCLUDED.days_per_week,
        best_days = EXCLUDED.best_days,
        session_duration = EXCLUDED.session_duration,
        training_location = EXCLUDED.training_location,
        equipment_access = EXCLUDED.equipment_access,
        has_injury = EXCLUDED.has_injury,
        injury_details = EXCLUDED.injury_details,
        has_medical_condition = EXCLUDED.has_medical_condition,
        medical_condition_details = EXCLUDED.medical_condition_details,
        sleep_hours = EXCLUDED.sleep_hours,
        dietary_preference = EXCLUDED.dietary_preference,
        has_food_allergies = EXCLUDED.has_food_allergies,
        food_allergies_details = EXCLUDED.food_allergies_details,
        is_completed = EXCLUDED.is_completed,
        current_step = EXCLUDED.current_step,
        updated_at = NOW()
      RETURNING *;
    `;

    const values = [
      cleanEmail, avatar_url || null, first_name, last_name, date_of_birth, gender,
      weight, weight_unit, height, height_unit,
      main_goal, event_name, event_date,
      days_per_week, JSON.stringify(best_days),
      session_duration, training_location, JSON.stringify(equipment_access),
      has_injury, injury_details, has_medical_condition,
      medical_condition_details, sleep_hours, dietary_preference,
      has_food_allergies, food_allergies_details, is_completed, current_step
    ];

    const result = await pool.query(queryText, values);
    
    res.status(200).json({
      message: is_completed ? 'Onboarding successfully completed!' : 'Progress auto-saved successfully.',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error in saving onboarding:', error);
    res.status(500).json({ error: 'Failed to save onboarding data', details: error.message });
  }
};

// GET /api/onboarding/:email
export const getOnboardingByEmail = async (req, res) => {
  const { email } = req.params;
  const cleanEmail = email.trim().toLowerCase();

  try {
    const result = await pool.query(
      'SELECT * FROM onboarding_responses WHERE email = $1',
      [cleanEmail]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No onboarding profile found for this email address.' });
    }

    res.json({ data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching onboarding profile:', error);
    res.status(500).json({ error: 'Failed to retrieve onboarding profile', details: error.message });
  }
};

// GET /api/onboarding
export const listOnboardings = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM onboarding_responses ORDER BY updated_at DESC'
    );
    res.json({
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error listing onboarding profiles:', error);
    res.status(500).json({ error: 'Failed to fetch onboarding list', details: error.message });
  }
};

// DELETE /api/onboarding/:email
export const deleteOnboarding = async (req, res) => {
  const { email } = req.params;
  const cleanEmail = email.trim().toLowerCase();

  try {
    const result = await pool.query(
      'DELETE FROM onboarding_responses WHERE email = $1 RETURNING *',
      [cleanEmail]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No profile found with that email address to delete.' });
    }

    res.json({
      message: `Profile for ${cleanEmail} successfully deleted.`,
      deletedRecord: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting onboarding profile:', error);
    res.status(500).json({ error: 'Failed to delete profile', details: error.message });
  }
};
