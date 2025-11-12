import express from 'express';
import { getAllJobs, getJobById, createJob, updateJob, deleteJob } from '../controllers/jobController';
import { scrapeAndSaveJobs, fetchLiveJobs } from '../controllers/jobScraperController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/', getAllJobs);
router.get('/live', fetchLiveJobs);
router.get('/:id', getJobById);
router.post('/', authMiddleware, createJob);
router.post('/scrape', authMiddleware, scrapeAndSaveJobs);
router.put('/:id', authMiddleware, updateJob);
router.delete('/:id', authMiddleware, deleteJob);

export default router;
