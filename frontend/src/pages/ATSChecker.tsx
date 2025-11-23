import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle, XCircle, AlertCircle, FileText, Sparkles, TrendingUp, Award } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ATSChecker: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setResults(null);
    }
  };

  const analyzeResume = async (isRetry = false) => {
    if (!file) {
      setError('Please upload a PDF resume');
      return;
    }
    
    setAnalyzing(true);
    setError('');
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const formData = new FormData();
      formData.append('resume', file);
      if (jobDescription.trim()) {
        formData.append('jobDescription', jobDescription);
      }
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      const response = await fetch(`${API_URL}/api/ai-resume/analyze-ats`, {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        setResults(data);
        setRetryCount(0);
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
    } catch (error: any) {
      console.error('Analysis error:', error);
      if (error.name === 'AbortError') {
        setError('Request timeout. Please try again.');
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        setError('Network error. Check your connection and try again.');
      } else {
        setError(error.message || 'Analysis failed. Please try again.');
      }
      
      if (!isRetry && retryCount < 2) {
        setRetryCount(prev => prev + 1);
      }
    } finally {
      setAnalyzing(false);
    }
  };
  
  const handleRetry = () => {
    analyzeResume(true);
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
            <div className="text-center mb-12 lg:mb-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-full mb-4 md:mb-6 shadow-xl text-xs md:text-sm"
              >
                <Sparkles className="h-4 w-4 md:h-5 md:w-5 animate-pulse" />
                <span className="font-bold tracking-wide">PROFESSIONAL ATS ANALYSIS</span>
              </motion.div>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight px-4">
                ATS Score Checker
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mt-1 md:mt-2">
                  Beat the Bots
                </span>
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto mb-8 md:mb-12 px-4 leading-relaxed">
                Professional ATS compatibility checker with instant analysis. Get detailed insights on formatting, keywords, sections, and optimization tips in seconds.
              </p>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto px-4">
                {[
                  { icon: Sparkles, title: 'Smart Analysis', desc: 'Advanced local processing', gradient: 'from-blue-600 to-cyan-600', bg: 'from-blue-50 to-blue-100' },
                  { icon: TrendingUp, title: 'ATS Score', desc: 'Instant detailed feedback', gradient: 'from-purple-600 to-pink-600', bg: 'from-purple-50 to-purple-100' },
                  { icon: Award, title: 'Optimization', desc: 'Professional actionable tips', gradient: 'from-pink-600 to-red-600', bg: 'from-pink-50 to-pink-100' }
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className={`bg-gradient-to-br ${feature.bg} rounded-2xl md:rounded-3xl p-6 md:p-8 border-2 border-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group`}
                  >
                    <div className={`h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-3 md:mb-4 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-base md:text-lg text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
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
                className="bg-white/90 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 lg:p-10 mb-6 md:mb-8 border border-gray-200 mx-4 md:mx-0"
              >
                <div className="mb-6 md:mb-8">
                  <label className="block text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">Job Description (Optional)</label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here to get role-specific analysis and keyword matching..."
                    rows={4}
                    className="w-full px-4 md:px-5 py-3 md:py-4 border-2 border-gray-200 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all text-gray-900 placeholder-gray-400 text-sm md:text-base resize-none"
                  />
                </div>

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
                    className="inline-flex items-center gap-2 md:gap-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-3 md:px-12 md:py-6 rounded-xl md:rounded-2xl font-bold text-sm md:text-lg cursor-pointer hover:shadow-2xl transition-all hover:scale-105 w-full sm:w-auto justify-center"
                  >
                    <Upload className="h-5 w-5 md:h-6 md:w-6" />
                    <span className="whitespace-nowrap">Upload PDF Resume</span>
                  </label>
                  {file && (
                    <div className="mt-4 md:mt-6 p-3 md:p-4 bg-green-50 border border-green-200 rounded-xl">
                      <div className="flex items-center justify-center gap-2 text-green-700">
                        <CheckCircle className="h-5 w-5 flex-shrink-0" />
                        <span className="font-semibold text-sm md:text-base truncate">{file.name}</span>
                      </div>
                    </div>
                  )}
                  
                  {error && (
                    <div className="mt-4 md:mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <div className="flex items-center gap-2 text-red-700 mb-3">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <span className="font-semibold text-sm md:text-base">{error}</span>
                      </div>
                      {retryCount < 2 && (
                        <button
                          onClick={handleRetry}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
                        >
                          Retry ({2 - retryCount} attempts left)
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {file && (
                  <div className="mt-6 md:mt-8 text-center">
                    <button
                      onClick={analyzeResume}
                      disabled={analyzing}
                      className="inline-flex items-center gap-2 md:gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 md:px-12 md:py-5 rounded-xl md:rounded-2xl font-bold text-sm md:text-lg hover:shadow-2xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
                    >
                      <Sparkles className={`h-5 w-5 md:h-6 md:w-6 ${analyzing ? 'animate-spin' : ''}`} />
                      <span className="whitespace-nowrap">{analyzing ? 'Analyzing Resume...' : 'Analyze Resume'}</span>
                    </button>
                    {analyzing && (
                      <div className="mt-4 md:mt-6">
                        <div className="max-w-sm md:max-w-md mx-auto">
                          <div className="w-full bg-gray-200 rounded-full h-2 md:h-3 mb-3 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 h-2 md:h-3 rounded-full animate-pulse" style={{width: '100%'}}></div>
                          </div>
                          <p className="text-gray-600 text-xs md:text-sm font-semibold">Performing comprehensive ATS analysis...</p>
                          <p className="text-xs text-gray-500 mt-1">Analyzing formatting, keywords, sections, readability & impact</p>
                        </div>
                      </div>
                    )}
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
                  {/* Overall Summary Card */}
                  <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 lg:p-10 border border-gray-200 mx-4 md:mx-0">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6 text-center">Analysis Summary</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
                      <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
                        <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600 mb-1 md:mb-2">{results.score}</div>
                        <div className="text-xs md:text-sm text-gray-600 font-semibold">Overall ATS Score</div>
                      </div>
                      {results.formatting && (
                        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                          <div className="text-4xl font-bold text-indigo-600 mb-2">{results.formatting.score}</div>
                          <div className="text-sm text-gray-600 font-semibold">Formatting Score</div>
                        </div>
                      )}
                      {results.readability && (
                        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                          <div className="text-4xl font-bold text-cyan-600 mb-2">{results.readability.score}</div>
                          <div className="text-sm text-gray-600 font-semibold">Readability Score</div>
                        </div>
                      )}
                      {results.jobMatch ? (
                        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                          <div className="text-4xl font-bold text-purple-600 mb-2">{results.jobMatch.matchScore}</div>
                          <div className="text-sm text-gray-600 font-semibold">Job Match Score</div>
                        </div>
                      ) : (
                        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                          <div className="text-4xl font-bold text-orange-600 mb-2">{results.impact?.quantifiedAchievements || 0}</div>
                          <div className="text-sm text-gray-600 font-semibold">Achievements</div>
                        </div>
                      )}
                    </div>
                  </div>

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

                  {/* Formatting Analysis */}
                  {results.formatting && (
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border-2 border-white">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-lg">
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-gray-900">Formatting Analysis</h3>
                          <p className="text-gray-600">Score: {results.formatting.score}/100</p>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-bold text-lg text-gray-900 mb-3">Issues Found</h4>
                          <ul className="space-y-2">
                            {results.formatting.issues.map((issue: string, i: number) => (
                              <li key={i} className="flex items-start gap-2 text-gray-700">
                                <span className="text-red-600 mt-1">⚠</span>
                                <span>{issue}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-gray-900 mb-3">Recommendations</h4>
                          <ul className="space-y-2">
                            {results.formatting.recommendations.map((rec: string, i: number) => (
                              <li key={i} className="flex items-start gap-2 text-gray-700">
                                <span className="text-blue-600 mt-1">→</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sections Analysis */}
                  {results.sections && (
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border-2 border-white">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-teal-600 to-green-600 flex items-center justify-center shadow-lg">
                          <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">Resume Sections</h3>
                      </div>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-bold text-lg text-gray-900 mb-3">Present</h4>
                          <div className="space-y-2">
                            {results.sections.present.map((section: string, i: number) => (
                              <div key={i} className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                                <CheckCircle className="h-4 w-4" />
                                <span className="font-semibold">{section}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-gray-900 mb-3">Missing</h4>
                          <div className="space-y-2">
                            {results.sections.missing.map((section: string, i: number) => (
                              <div key={i} className="flex items-center gap-2 text-orange-700 bg-orange-50 px-3 py-2 rounded-lg">
                                <XCircle className="h-4 w-4" />
                                <span className="font-semibold">{section}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-gray-900 mb-3">Quality Scores</h4>
                          <div className="space-y-2">
                            {Object.entries(results.sections.quality).map(([section, score]: [string, any], i: number) => (
                              <div key={i} className="bg-gray-50 px-3 py-2 rounded-lg">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="font-semibold text-gray-900">{section}</span>
                                  <span className="text-sm font-bold text-gray-700">{score}/100</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full" style={{width: `${score}%`}}></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Readability & Impact */}
                  {(results.readability || results.impact) && (
                    <div className="grid md:grid-cols-2 gap-8">
                      {results.readability && (
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border-2 border-white">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg">
                              <FileText className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900">Readability</h3>
                              <p className="text-gray-600">Score: {results.readability.score}/100</p>
                            </div>
                          </div>
                          <div className="mb-4">
                            <span className="text-sm font-semibold text-gray-600">Complexity: </span>
                            <span className="text-lg font-bold text-gray-900 capitalize">{results.readability.sentenceComplexity}</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-gray-600 mb-2">Suggestions</h4>
                            <ul className="space-y-2">
                              {results.readability.suggestions.map((sug: string, i: number) => (
                                <li key={i} className="text-gray-700 text-sm flex items-start gap-2">
                                  <span className="text-cyan-600 mt-0.5">•</span>
                                  <span>{sug}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                      {results.impact && (
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border-2 border-white">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center shadow-lg">
                              <TrendingUp className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Impact Analysis</h3>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border-2 border-orange-200">
                              <div className="text-3xl font-bold text-orange-600">{results.impact.quantifiedAchievements}</div>
                              <div className="text-sm text-gray-600">Quantified Achievements</div>
                            </div>
                            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border-2 border-orange-200">
                              <div className="text-3xl font-bold text-orange-600">{results.impact.actionVerbs}</div>
                              <div className="text-sm text-gray-600">Action Verbs</div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-gray-600 mb-2">Suggestions</h4>
                            <ul className="space-y-2">
                              {results.impact.suggestions.map((sug: string, i: number) => (
                                <li key={i} className="text-gray-700 text-sm flex items-start gap-2">
                                  <span className="text-orange-600 mt-0.5">•</span>
                                  <span>{sug}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Job Match Analysis */}
                  {results.jobMatch && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl shadow-2xl p-10 border-2 border-purple-200">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                          <Award className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-gray-900">Job Match Analysis</h3>
                          <p className="text-gray-600">Match Score: {results.jobMatch.matchScore}/100</p>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            Matched Requirements
                          </h4>
                          <ul className="space-y-2">
                            {results.jobMatch.matchedRequirements.map((req: string, i: number) => (
                              <li key={i} className="text-gray-700 bg-white px-3 py-2 rounded-lg shadow-sm">
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                            <XCircle className="h-5 w-5 text-red-600" />
                            Missing Requirements
                          </h4>
                          <ul className="space-y-2">
                            {results.jobMatch.missingRequirements.map((req: string, i: number) => (
                              <li key={i} className="text-gray-700 bg-white px-3 py-2 rounded-lg shadow-sm">
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-blue-600" />
                            Recommendations
                          </h4>
                          <ul className="space-y-2">
                            {results.jobMatch.recommendations.map((rec: string, i: number) => (
                              <li key={i} className="text-gray-700 bg-white px-3 py-2 rounded-lg shadow-sm">
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <button
                      onClick={() => {
                        setFile(null);
                        setJobDescription('');
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
