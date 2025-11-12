import { Request, Response } from 'express';
import { aiJobSearch, generateJobRecommendations } from '../services/openaiJobSearch';
import { AuthRequest } from '../middleware/auth';

export const searchJobsWithAI = async (req: Request, res: Response) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ 
        success: false, 
        message: 'Query is required' 
      });
    }

    const result = await aiJobSearch(query);

    res.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    console.error('AI search error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'AI job search failed'
    });
  }
};

export const getJobRecommendations = async (req: AuthRequest, res: Response) => {
  try {
    const userProfile = {
      skills: req.body.skills || [],
      experience: req.body.experience || '',
      preferences: req.body.preferences || {}
    };

    const recommendations = await generateJobRecommendations(userProfile);

    res.json({
      success: true,
      recommendations
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
