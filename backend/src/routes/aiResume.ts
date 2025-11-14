import express from 'express';
import { generateSummary, generateExperienceDescription, generateSkills, analyzeATS, optimizeResume } from '../controllers/aiResumeController';

const router = express.Router();

router.post('/generate-summary', generateSummary);
router.post('/generate-experience', generateExperienceDescription);
router.post('/generate-skills', generateSkills);
router.post('/analyze-ats', analyzeATS);
router.post('/optimize', optimizeResume);

export default router;
