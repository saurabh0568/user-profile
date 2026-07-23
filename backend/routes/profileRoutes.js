import express from 'express';
import {
  getProfileSummary,
  updatePersonalInfo,
  updateFitnessProfile,
  updateEquipment,
  updateInjuryHistory,
  getSettings,
  updateSettings,
  exportUserData
} from '../controllers/profileController.js';

const router = express.Router();

router.get('/profile/:email/summary', getProfileSummary);
router.put('/profile/:email/personal-info', updatePersonalInfo);
router.put('/profile/:email/fitness', updateFitnessProfile);
router.put('/profile/:email/equipment', updateEquipment);
router.put('/profile/:email/injury', updateInjuryHistory);

router.get('/profile/:email/settings', getSettings);
router.put('/profile/:email/settings', updateSettings);

router.get('/profile/:email/export', exportUserData);

export default router;
