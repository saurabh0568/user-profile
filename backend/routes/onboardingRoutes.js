import express from 'express';
import {
  healthCheck,
  checkEmailExists,
  saveOnboarding,
  getOnboardingByEmail,
  listOnboardings,
  deleteOnboarding
} from '../controllers/onboardingController.js';

const router = express.Router();

router.get('/health', healthCheck);
router.get('/onboarding/check/:email', checkEmailExists);
router.post('/onboarding', saveOnboarding);
router.get('/onboarding', listOnboardings);
router.get('/onboarding/:email', getOnboardingByEmail);
router.delete('/onboarding/:email', deleteOnboarding);

export default router;
