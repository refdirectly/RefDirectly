import { Request, Response } from 'express';
import { analyzeResumeWithAI } from '../services/atsService';
import fs from 'fs';

export const analyzeATS = async (req: Request, res: Response) => {
  try {
    console.log('ATS Controller called');
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No resume file uploaded'
      });
    }

    const jobDescription = req.body.jobDescription;
    console.log('Calling AI service...');
    const results = await analyzeResumeWithAI(req.file.path, jobDescription);
    console.log('AI service returned results');
    
    fs.unlinkSync(req.file.path);

    res.json(results);
  } catch (error) {
    console.error('ATS analysis error:', error);
    
    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        console.error('Error deleting file:', e);
      }
    }
    
    res.status(500).json({
      success: false,
      error: 'Analysis failed. Please try again.'
    });
  }
};