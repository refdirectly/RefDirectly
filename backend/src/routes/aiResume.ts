import express from 'express';
import multer from 'multer';
import { generateSummary, generateExperienceDescription, generateSkills, analyzeATS, optimizeResume } from '../controllers/aiResumeController';

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post('/generate-summary', generateSummary);
router.post('/generate-experience', generateExperienceDescription);
router.post('/generate-skills', generateSkills);
router.post('/analyze-ats', upload.single('resume'), analyzeATS);
router.post('/optimize', optimizeResume);

export default router;
