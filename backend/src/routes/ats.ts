import express from 'express';
import multer from 'multer';
import { analyzeATS } from '../controllers/atsController';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/analyze-ats', upload.single('resume'), analyzeATS);

export default router;