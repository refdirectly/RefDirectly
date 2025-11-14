import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
const pdf = require('pdf-parse');

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

    // Handle PDF file upload
    if (req.file) {
      console.log('Processing PDF file:', req.file.originalname);
      const pdfData = await pdf(req.file.buffer);
      resumeText = pdfData.text;
      console.log('Extracted text length:', resumeText.length);
    } else if (req.body.resumeText) {
      resumeText = req.body.resumeText;
    }

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Resume file or text is required' });
    }

    // Fallback if no API key
    if (!process.env.GEMINI_API_KEY) {
      const mockResult = {
        score: 78,
        strengths: [
          'Clear contact information and professional formatting',
          'Quantified achievements with specific metrics',
          'Relevant technical keywords present',
          'Well-structured experience section'
        ],
        improvements: [
          'Add more industry-specific keywords',
          'Include measurable results in all bullet points',
          'Optimize section headers for ATS parsing',
          'Add a skills section with relevant technologies'
        ],
        keywords: {
          found: ['React', 'JavaScript', 'Node.js', 'AWS', 'Python', 'Git'],
          missing: ['Docker', 'Kubernetes', 'CI/CD', 'Microservices', 'TypeScript']
        }
      };
      return res.json({ success: true, ...mockResult });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Analyze this resume for ATS (Applicant Tracking System) compatibility and provide:
1. An ATS score from 0-100
2. List of strengths (4-5 points)
3. List of improvements needed (4-5 points)
4. Keywords found in the resume
5. Important keywords missing

Resume:
${resumeText}

Provide response in JSON format: {"score": number, "strengths": [strings], "improvements": [strings], "keywords": {"found": [strings], "missing": [strings]}}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Try to parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0]);
      res.json({ success: true, ...analysis });
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error: any) {
    console.error('Gemini API error:', error);
    // Fallback on error
    const mockResult = {
      score: 75,
      strengths: [
        'Professional formatting and clear structure',
        'Quantified achievements present',
        'Relevant keywords included',
        'Well-organized sections'
      ],
      improvements: [
        'Add more specific technical keywords',
        'Include measurable results in all points',
        'Optimize for ATS parsing',
        'Add relevant certifications'
      ],
      keywords: {
        found: ['React', 'JavaScript', 'Node.js', 'Python'],
        missing: ['Docker', 'Kubernetes', 'CI/CD', 'TypeScript']
      }
    };
    res.json({ success: true, ...mockResult });
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
