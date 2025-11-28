import express from 'express';
import OpenAI from 'openai';
import User from '../models/User';
import { authMiddleware, AuthRequest } from '../utils/auth';

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || '',
  baseURL: 'https://api.groq.com/openai/v1'
});

// Find matching referrers using AI embeddings
router.post('/find', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { company, role, skills, description } = req.body;

    // Create search text for embedding
    const searchText = `${company} ${role} ${skills.join(' ')} ${description}`;

    // Generate embedding for the search query
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: searchText
    });

    const queryEmbedding = embedding.data[0].embedding;

    // Find verified referrers for the company
    const referrers = await User.find({
      role: 'referrer',
      verified: true,
      'companies.name': new RegExp(company, 'i'),
      'companies.verified': true
    }).select('name companies rating pricePerReferral bio');

    // For now, return simple matching based on company and role
    // In production, you'd store embeddings in a vector database
    const matchedReferrers = referrers.map(referrer => {
      const companyMatch = referrer.companies.find(c => 
        c.name.toLowerCase().includes(company.toLowerCase())
      );
      
      const roleMatch = companyMatch?.roles.some(r => 
        r.toLowerCase().includes(role.toLowerCase())
      ) || false;

      // Simple scoring algorithm (replace with vector similarity in production)
      let score = 0.5; // base score
      if (roleMatch) score += 0.3;
      if (referrer.rating && referrer.rating > 4) score += 0.2;

      return {
        referrer: {
          id: referrer._id,
          name: referrer.name,
          companies: referrer.companies,
          rating: referrer.rating,
          pricePerReferral: referrer.pricePerReferral,
          bio: referrer.bio
        },
        matchScore: Math.min(score, 1.0)
      };
    });

    // Sort by match score
    matchedReferrers.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      matches: matchedReferrers.slice(0, 10), // Top 10 matches
      total: matchedReferrers.length
    });

  } catch (error) {
    console.error('Matching error:', error);
    res.status(500).json({ message: 'Failed to find matches' });
  }
});

// Get top referrers for a company
router.get('/top', async (req, res) => {
  try {
    const { company, limit = 5 } = req.query;

    const filter: any = {
      role: 'referrer',
      verified: true
    };

    if (company) {
      filter['companies.name'] = new RegExp(company as string, 'i');
      filter['companies.verified'] = true;
    }

    const topReferrers = await User.find(filter)
      .select('name companies rating pricePerReferral bio avatarUrl')
      .sort({ rating: -1, createdAt: -1 })
      .limit(Number(limit));

    res.json({ referrers: topReferrers });

  } catch (error) {
    console.error('Get top referrers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate and store embeddings for referrer profiles (admin only)
router.post('/generate-embeddings', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const referrers = await User.find({ role: 'referrer', verified: true });
    let processed = 0;

    for (const referrer of referrers) {
      try {
        // Create profile text for embedding
        const profileText = [
          referrer.bio || '',
          referrer.companies.map(c => `${c.name} ${c.roles.join(' ')}`).join(' '),
          referrer.name || ''
        ].filter(Boolean).join(' ');

        if (profileText.trim()) {
          const embedding = await openai.embeddings.create({
            model: 'text-embedding-ada-002',
            input: profileText
          });

          // In production, store this embedding in a vector database
          // For now, we'll just log it
          console.log(`Generated embedding for referrer ${referrer._id}`);
          processed++;
        }

        // Rate limiting - wait between requests
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`Failed to generate embedding for referrer ${referrer._id}:`, error);
      }
    }

    res.json({
      message: `Generated embeddings for ${processed} referrers`,
      processed,
      total: referrers.length
    });

  } catch (error) {
    console.error('Generate embeddings error:', error);
    res.status(500).json({ message: 'Failed to generate embeddings' });
  }
});

export default router;