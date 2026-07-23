import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDb } from './db.js';
import onboardingRoutes from './routes/onboardingRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env from project root
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Database Table on Server Start
initDb();

// Register All REST API Routes under /api
app.use('/api', onboardingRoutes);
app.use('/api', profileRoutes);

// Simple global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 FitAI X Backend server running on http://localhost:${PORT}`);
});
