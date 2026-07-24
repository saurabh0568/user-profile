import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env from project root (one level up from backend/)
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL is not defined in .env file');
  process.exit(1);
}

export const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

export const initDb = async () => {
  const client = await pool.connect();
  try {
    console.log('⚡ Connected to Neon PostgreSQL. Verifying schema...');

    await client.query(`
      CREATE TABLE IF NOT EXISTS onboarding_responses (
        email                     VARCHAR(255) PRIMARY KEY,
        avatar_url                TEXT,
        first_name                VARCHAR(100),
        last_name                 VARCHAR(100),
        date_of_birth             VARCHAR(50),
        gender                    VARCHAR(50),
        weight                    VARCHAR(50),
        weight_unit               VARCHAR(10) DEFAULT 'kg',
        height                    VARCHAR(50),
        height_unit               VARCHAR(10) DEFAULT 'cm',
        main_goal                 VARCHAR(100),
        event_name                TEXT,
        event_date                VARCHAR(50),
        days_per_week             VARCHAR(50),
        best_days                 JSONB DEFAULT '[]'::jsonb,
        session_duration          VARCHAR(50),
        training_location         VARCHAR(100),
        equipment_access          JSONB DEFAULT '[]'::jsonb,
        has_injury                VARCHAR(20),
        injury_details            TEXT,
        has_medical_condition     VARCHAR(50),
        medical_condition_details TEXT,
        sleep_hours               VARCHAR(50),
        dietary_preference        VARCHAR(50),
        has_food_allergies        VARCHAR(20),
        food_allergies_details    TEXT,
        is_completed              BOOLEAN DEFAULT FALSE,
        current_step              INTEGER DEFAULT 1,
        created_at                TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at                TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ensure avatar_url column exists if table was created previously
    await client.query(`
      ALTER TABLE onboarding_responses ADD COLUMN IF NOT EXISTS avatar_url TEXT;
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS user_settings (
        email                     VARCHAR(255) PRIMARY KEY REFERENCES onboarding_responses(email) ON DELETE CASCADE,
        ai_preferences            JSONB DEFAULT '{}'::jsonb,
        notifications             JSONB DEFAULT '{}'::jsonb,
        theme_settings            JSONB DEFAULT '{}'::jsonb,
        privacy                   JSONB DEFAULT '{}'::jsonb,
        security                  JSONB DEFAULT '{}'::jsonb,
        connected_devices         JSONB DEFAULT '[]'::jsonb,
        subscription              JSONB DEFAULT '{}'::jsonb,
        updated_at                TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ Tables 'onboarding_responses' and 'user_settings' checked/ready.");
  } catch (err) {
    console.error('❌ DB init error:', err.message);
  } finally {
    client.release();
  }
};
