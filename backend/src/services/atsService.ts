import axios from 'axios';
const pdfParse = require('pdf-parse');
import fs from 'fs';

export const analyzeResumeWithAI = async (filePath: string, jobDescription?: string) => {
  try {
    console.log('Starting AI ATS analysis...');
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;
    console.log('Resume text extracted, length:', resumeText.length);

    const prompt = `You are an expert ATS (Applicant Tracking System) analyzer. Analyze the following resume ${jobDescription ? 'against the job description' : ''} and provide a detailed scoring.

${jobDescription ? `Job Description:\n${jobDescription}\n\n` : ''}Resume Content:
${resumeText}

Provide a JSON response with the following structure:
{
  "score": <number 0-100>,
  "strengths": [<array of 3-5 specific strengths found>],
  "improvements": [<array of 3-5 specific improvements needed>],
  "keywords": {
    "found": [<array of relevant keywords found>],
    "missing": [<array of important keywords missing>]
  },
  "formatting": {
    "score": <number 0-100>,
    "issues": [<array of formatting issues>],
    "recommendations": [<array of formatting recommendations>]
  },
  "sections": {
    "present": [<array of sections found>],
    "missing": [<array of recommended sections missing>],
    "quality": {<object with section names as keys and quality scores 0-100 as values>}
  },
  "detailedAnalysis": "<string with 2-3 sentences of overall analysis>"
}

Be specific and actionable. Base the score on:
- Keyword relevance (30%)
- Formatting and readability (20%)
- Content quality and achievements (30%)
- Section completeness (20%)

Return ONLY valid JSON, no markdown or extra text.`;

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const text = response.data.choices[0].message.content;
    console.log('AI Response received:', text.substring(0, 200));
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid AI response format');
    }
    
    const analysis = JSON.parse(jsonMatch[0]);
    console.log('Analysis score:', analysis.score);
    
    return {
      success: true,
      ...analysis
    };
  } catch (error) {
    console.error('AI ATS analysis error:', error);
    throw error;
  }
};
