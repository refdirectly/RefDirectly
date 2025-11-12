import express from 'express';
import { createJobPosting, getActiveJobPostings, getJobPostingById, updateJobPosting, deleteJobPosting } from '../controllers/jobPostingController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/', authMiddleware, createJobPosting);
router.get('/', getActiveJobPostings);
router.get('/:id', getJobPostingById);
router.put('/:id', authMiddleware, updateJobPosting);
router.delete('/:id', authMiddleware, deleteJobPosting);

export default router;
