import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle, XCircle, AlertCircle, FileText, Sparkles, TrendingUp, Award } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ATSChecker: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setResults(null);
    }
  };

  const analyzeResume = async () => {
    if (!file) {
      alert('Please upload a PDF resume');
      return;
    }
    
    setAnalyzing(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const formData = new FormData();
      formData.append('resume', file);
      
      const response = await fetch(`${API_URL}/api/ai-resume/analyze-ats`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        setResults(data);
      } else {
        alert(data.error || 'Failed to analyze resume');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze resume. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-600 to-emerald-600';
    if (score >= 60) return 'from-yellow-600 to-orange-600';
    return 'from-red-600 to-pink-600';
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return 'Excellent! Your resume is ATS-friendly';
    if (score >= 60) return 'Good, but needs improvements';
    return 'Needs significant improvements';
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <Header />
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            {/* Hero Section */}
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full mb-6 shadow-xl"
              >
                <Sparkles className="h-5 w-5 animate-pulse" />
                <span className="text-sm font-bold tracking-wide">AI-POWERED ATS ANALYSIS</span>
              </motion.div>
              <h1 className="font-display text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                ATS Score Checker
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mt-2">
                  Beat the Bots
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
                Check if your resume passes Applicant Tracking Systems with AI-powered analysis
              </p>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {[
                  { icon: Sparkles, title: 'AI Analysis', desc: 'Powered by Gemini', gradient: 'from-blue-600 to-cyan-600', bg: 'from-blue-50 to-blue-100' },
                  { icon: TrendingUp, title: 'ATS Score', desc: 'Instant feedback', gradient: 'from-purple-600 to-pink-600', bg: 'from-purple-50 to-purple-100' },
                  { icon: Award, title: 'Optimization', desc: 'Actionable tips', gradient: 'from-pink-600 to-red-600', bg: 'from-pink-50 to-pink-100' }
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className={`bg-gradient-to-br ${feature.bg} rounded-3xl p-8 border-2 border-white shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1`}
                  >
                    <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 mx-auto shadow-lg`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Upload Section */}
            {!results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 mb-8 border-2 border-white"
              >
                <div className="text-center">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-12 py-6 rounded-2xl font-bold text-lg cursor-pointer hover:shadow-2xl transition-all hover:scale-105"
                  >
                    <Upload className="h-6 w-6" />
                    Upload PDF Resume
                  </label>
                  {file && (
                    <div className="mt-6 text-gray-700 font-semibold">
                      Selected: {file.name}
                    </div>
                  )}
                </div>

                {file && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={analyzeResume}
                      disabled={analyzing}
                      className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-12 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105 disabled:opacity-50"
                    >
                      <Sparkles className="h-6 w-6" />
                      {analyzing ? 'Analyzing Resume...' : 'Analyze with AI'}
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Results Section */}
            <AnimatePresence>
              {results && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  {/* Score Card */}
                  <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border-2 border-white">
                    <div className="text-center mb-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', duration: 0.6 }}
                        className={`inline-flex items-center justify-center h-40 w-40 rounded-full bg-gradient-to-br ${getScoreColor(results.score)} text-white mb-6 shadow-2xl`}
                      >
                        <span className="text-6xl font-bold">{results.score}</span>
                      </motion.div>
                      <h2 className="text-4xl font-bold text-gray-900 mb-3">ATS Score</h2>
                      <p className="text-xl text-gray-600">{getScoreText(results.score)}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Strengths */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-lg">
                            <CheckCircle className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900">Strengths</h3>
                        </div>
                        <ul className="space-y-3">
                          {results.strengths.map((strength: string, index: number) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start gap-3 text-gray-700"
                            >
                              <span className="text-green-600 text-xl mt-0.5">✓</span>
                              <span>{strength}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      {/* Improvements */}
                      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border-2 border-orange-200">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center shadow-lg">
                            <AlertCircle className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900">Improvements</h3>
                        </div>
                        <ul className="space-y-3">
                          {results.improvements.map((improvement: string, index: number) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start gap-3 text-gray-700"
                            >
                              <span className="text-orange-600 text-xl mt-0.5">!</span>
                              <span>{improvement}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Keywords Analysis */}
                  <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border-2 border-white">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900">Keyword Analysis</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          Found Keywords
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {results.keywords.found.map((keyword: string, index: number) => (
                            <motion.span
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05 }}
                              className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-4 py-2 rounded-xl text-sm font-semibold border-2 border-green-200"
                            >
                              {keyword}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                          <XCircle className="h-5 w-5 text-red-600" />
                          Missing Keywords
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {results.keywords.missing.map((keyword: string, index: number) => (
                            <motion.span
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05 }}
                              className="bg-gradient-to-r from-red-100 to-pink-100 text-red-700 px-4 py-2 rounded-xl text-sm font-semibold border-2 border-red-200"
                            >
                              {keyword}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <button
                      onClick={() => {
                        setFile(null);
                        setResults(null);
                      }}
                      className="flex items-center gap-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
                    >
                      <Sparkles className="h-6 w-6" />
                      Check Another Resume
                    </button>
                    <button
                      onClick={() => window.location.href = '/resume-builder'}
                      className="flex items-center gap-3 bg-white border-2 border-purple-600 text-purple-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-purple-600 hover:text-white hover:shadow-2xl transition-all hover:scale-105"
                    >
                      <FileText className="h-6 w-6" />
                      Build Better Resume
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ATSChecker;
