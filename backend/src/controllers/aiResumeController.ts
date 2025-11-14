import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

// PDF analysis with Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const generateSummary = async (req: Request, res: Response) => {
  try {
    const { position, experience, skills } = req.body;

    // Fallback if no API key
    if (!process.env.GEMINI_API_KEY) {
      const summary = `Results-driven ${position} with ${experience}+ years of experience delivering high-impact solutions. Proven track record of driving innovation, leading cross-functional teams, and achieving measurable business outcomes. Expertise in ${skills.split(',').slice(0, 3).join(', ')} with a passion for continuous learning and excellence.`;
      return res.json({ success: true, summary });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Generate a professional resume summary for a ${position} with ${experience} years of experience. Skills: ${skills}. Make it ATS-friendly, concise (3-4 sentences), and impactful. Focus on achievements and value proposition.`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    res.json({ success: true, summary });
  } catch (error: any) {
    console.error('Gemini API error:', error);
    // Fallback on error
    const { position, experience, skills } = req.body;
    const summary = `Results-driven ${position} with ${experience}+ years of experience delivering high-impact solutions. Proven track record of driving innovation, leading cross-functional teams, and achieving measurable business outcomes. Expertise in ${skills.split(',').slice(0, 3).join(', ')} with a passion for continuous learning and excellence.`;
    res.json({ success: true, summary });
  }
};

export const generateExperienceDescription = async (req: Request, res: Response) => {
  try {
    const { company, position, duration } = req.body;

    // Fallback if no API key
    if (!process.env.GEMINI_API_KEY) {
      const description = `• Led ${position} initiatives at ${company}, driving 30% improvement in key performance metrics\n• Collaborated with cross-functional teams to deliver high-quality solutions on time and within budget\n• Implemented best practices and mentored junior team members, improving team productivity by 25%\n• Achieved recognition for outstanding performance and innovation in project delivery\n• Spearheaded process improvements that reduced operational costs by 20%`;
      return res.json({ success: true, description });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Generate 4-5 bullet points for a resume describing work experience as ${position} at ${company} for ${duration}. Make them achievement-focused with quantifiable results where possible. Use action verbs and be ATS-friendly. Format with bullet points (•).`;

    const result = await model.generateContent(prompt);
    const description = result.response.text();

    res.json({ success: true, description });
  } catch (error: any) {
    console.error('Gemini API error:', error);
    // Fallback on error
    const { company, position } = req.body;
    const description = `• Led ${position} initiatives at ${company}, driving 30% improvement in key performance metrics\n• Collaborated with cross-functional teams to deliver high-quality solutions on time and within budget\n• Implemented best practices and mentored junior team members, improving team productivity by 25%\n• Achieved recognition for outstanding performance and innovation in project delivery\n• Spearheaded process improvements that reduced operational costs by 20%`;
    res.json({ success: true, description });
  }
};

export const generateSkills = async (req: Request, res: Response) => {
  try {
    const { position, industry } = req.body;

    // Fallback if no API key
    if (!process.env.GEMINI_API_KEY) {
      const skills = 'React, Node.js, Python, JavaScript, TypeScript, AWS, Docker, Kubernetes, MongoDB, PostgreSQL, Git, CI/CD, Agile, REST APIs, GraphQL, Microservices, System Design, Problem Solving, Team Leadership, Communication, Project Management';
      return res.json({ success: true, skills });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Generate a comprehensive list of technical and soft skills for a ${position} in ${industry}. Include programming languages, frameworks, tools, and methodologies. Return as comma-separated values. Focus on in-demand, ATS-friendly keywords.`;

    const result = await model.generateContent(prompt);
    const skills = result.response.text();

    res.json({ success: true, skills });
  } catch (error: any) {
    console.error('Gemini API error:', error);
    // Fallback on error
    const skills = 'React, Node.js, Python, JavaScript, TypeScript, AWS, Docker, Kubernetes, MongoDB, PostgreSQL, Git, CI/CD, Agile, REST APIs, GraphQL, Microservices, System Design, Problem Solving, Team Leadership, Communication, Project Management';
    res.json({ success: true, skills });
  }
};

export const analyzeATS = async (req: Request, res: Response) => {
  try {
    let resumeText = '';
    const jobDescription = req.body.jobDescription || '';

    // Handle PDF file upload
    if (req.file) {
      console.log('Processing PDF file:', req.file.originalname);
      const { PDFParse } = await import('pdf-parse');
      const parser = new PDFParse({ data: new Uint8Array(req.file.buffer) });
      const result = await parser.getText();
      resumeText = result.text;
      console.log('Extracted text length:', resumeText.length);
    } else if (req.body.resumeText) {
      resumeText = req.body.resumeText;
    }

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Resume file or text is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ success: false, error: 'AI service not configured. Please contact administrator.' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const jobContext = jobDescription ? `

Target Job Description:
${jobDescription}` : '';
    
    const prompt = `You are an expert ATS (Applicant Tracking System) analyzer with deep knowledge of recruitment systems used by companies like Workday, Taleo, Greenhouse, and Lever. Perform a comprehensive, professional-grade analysis of this resume as if you were a real ATS system.

Resume Content:
${resumeText}${jobContext}

Analyze the resume thoroughly checking for:
- ATS parsing compatibility (formatting, structure, readability)
- Keyword optimization and relevance
- Content quality and impact
- Professional presentation
- Section completeness
- Quantifiable achievements
- Action verb usage
- Contact information clarity
- File format compatibility indicators${jobDescription ? '
- Job description alignment and match percentage' : ''}

Provide detailed analysis in VALID JSON format with these exact fields:

1. "score": Overall ATS compatibility score (0-100)${jobDescription ? ' - heavily weight job description match' : ''}

2. "strengths": Array of 5-6 specific strengths found:
   - Formatting and structure quality
   - Keyword optimization
   - Quantifiable achievements
   - Professional presentation${jobDescription ? '
   - Job requirements match' : ''}

3. "improvements": Array of 5-6 actionable improvements:
   - Missing critical sections
   - Formatting issues for ATS parsing
   - Keyword gaps
   - Content optimization needs${jobDescription ? '
   - Skills/experience gaps for target role' : ''}

4. "keywords": Object with:
   - "found": Array of 8-12 relevant keywords/skills detected${jobDescription ? ' that match job requirements' : ''}
   - "missing": Array of 8-12 important keywords that should be added${jobDescription ? ' from job description' : ' for the industry'}

5. "formatting": Object with:
   - "score": Formatting quality score (0-100)
   - "issues": Array of specific formatting problems (tables, columns, graphics, special characters, etc.)
   - "recommendations": Array of formatting improvements

6. "sections": Object analyzing resume sections:
   - "present": Array of sections found (Contact, Summary, Experience, Education, Skills, etc.)
   - "missing": Array of recommended sections not found
   - "quality": Object with section names as keys and quality scores (0-100) as values

7. "readability": Object with:
   - "score": Readability score (0-100)
   - "sentenceComplexity": "simple"|"moderate"|"complex"
   - "suggestions": Array of readability improvements

8. "impact": Object with:
   - "quantifiedAchievements": Number of achievements with metrics
   - "actionVerbs": Number of strong action verbs used
   - "suggestions": Array of ways to increase impact

${jobDescription ? '9. "jobMatch": Object with:
   - "matchScore": How well resume matches job (0-100)
   - "matchedRequirements": Array of job requirements clearly met
   - "missingRequirements": Array of job requirements not addressed
   - "recommendations": Array of specific changes to improve match
' : ''}
Return ONLY valid JSON, no markdown or extra text.`;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    
    // Clean markdown formatting
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Try to parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0]);
      
      // Validate required fields
      if (!analysis.score || !analysis.strengths || !analysis.improvements || !analysis.keywords) {
        throw new Error('Incomplete analysis data');
      }
      
      res.json({ success: true, ...analysis });
    } else {
      throw new Error('Invalid response format from AI');
    }
  } catch (error: any) {
    console.error('ATS Analysis error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to analyze resume. Please try again or contact support if the issue persists.',
      details: error.message 
    });
  }
};

export const optimizeResume = async (req: Request, res: Response) => {
  try {
    const { resumeText, jobDescription } = req.body;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Analyze this resume and suggest improvements to match the job description. Resume: ${resumeText}. Job Description: ${jobDescription}. Provide specific suggestions for keywords to add, sections to improve, and ATS optimization tips.`;

    const result = await model.generateContent(prompt);
    const suggestions = result.response.text();

    res.json({ success: true, suggestions });
  } catch (error: any) {
    console.error('Gemini API error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
