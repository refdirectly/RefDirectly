import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, CheckCircle, XCircle, AlertCircle, FileText } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ATSChecker: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResults(null);
    }
  };

  const analyzeResume = () => {
    setAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setResults({
        score: 78,
        strengths: [
          'Clear contact information',
          'Quantified achievements',
          'Relevant keywords present',
          'Professional formatting',
        ],
        improvements: [
          'Add more industry-specific keywords',
          'Include measurable results in experience section',
          'Optimize for ATS parsing with simpler formatting',
        ],
        keywords: {
          found: ['React', 'JavaScript', 'Node.js', 'AWS', 'Python'],
          missing: ['Docker', 'Kubernetes', 'CI/CD', 'Microservices'],
        },
      });
      setAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-primary text-white px-5 py-2 rounded-full mb-4">
                <FileText className="h-4 w-4" />
                <span className="text-sm font-semibold">AI-Powered Analysis</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                ATS Score Checker
              </h1>
              <p className="text-lg text-gray-600">
                Check if your resume passes Applicant Tracking Systems
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-upload"
                />
                <label
                  htmlFor="resume-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <div className="h-20 w-20 rounded-full bg-gradient-primary text-white flex items-center justify-center mb-4">
                    <Upload className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {file ? file.name : 'Upload Your Resume'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Supports PDF, DOC, DOCX (Max 5MB)
                  </p>
                  <button className="bg-gradient-primary text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                    Choose File
                  </button>
                </label>
              </div>

              {file && !results && (
                <div className="mt-6 text-center">
                  <button
                    onClick={analyzeResume}
                    disabled={analyzing}
                    className="bg-gradient-primary text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50"
                  >
                    {analyzing ? 'Analyzing...' : 'Analyze Resume'}
                  </button>
                </div>
              )}
            </div>

            {results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center h-32 w-32 rounded-full bg-gradient-primary text-white mb-4">
                      <span className="text-5xl font-bold">{results.score}</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">ATS Score</h2>
                    <p className="text-gray-600">
                      {results.score >= 80
                        ? 'Excellent! Your resume is ATS-friendly'
                        : results.score >= 60
                        ? 'Good, but needs some improvements'
                        : 'Needs significant improvements'}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-green-50 rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                        <h3 className="text-xl font-bold text-gray-900">Strengths</h3>
                      </div>
                      <ul className="space-y-2">
                        {results.strengths.map((strength: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-gray-700">
                            <span className="text-green-600 mt-1">✓</span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-orange-50 rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <AlertCircle className="h-6 w-6 text-orange-600" />
                        <h3 className="text-xl font-bold text-gray-900">Improvements</h3>
                      </div>
                      <ul className="space-y-2">
                        {results.improvements.map((improvement: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-gray-700">
                            <span className="text-orange-600 mt-1">!</span>
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Keyword Analysis</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Found Keywords
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {results.keywords.found.map((keyword: string, index: number) => (
                          <span
                            key={index}
                            className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-red-600" />
                        Missing Keywords
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {results.keywords.missing.map((keyword: string, index: number) => (
                          <span
                            key={index}
                            className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => {
                      setFile(null);
                      setResults(null);
                    }}
                    className="bg-gradient-primary text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl transition-all hover:scale-105"
                  >
                    Check Another Resume
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ATSChecker;
