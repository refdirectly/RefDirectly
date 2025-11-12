import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Sparkles, CheckCircle, ArrowRight, Zap, Target, Shield } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const AIApplyNewPage: React.FC = () => {
  const [resume, setResume] = useState<File | null>(null);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
      setStep(2);
    }
  };

  const handleContinue = () => {
    navigate('/seeker/ai-search');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow pt-32 md:pt-40 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-primary text-white px-5 py-2 rounded-full mb-6">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold">AI-Powered Application</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Apply Smarter, Not Harder
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Upload your resume and let AI handle the rest. Apply to hundreds of jobs in minutes.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                { icon: Zap, title: '10x Faster', desc: 'Apply to 100+ jobs in minutes' },
                { icon: Target, title: 'Smart Matching', desc: 'AI finds perfect job fits' },
                { icon: Shield, title: 'Secure & Private', desc: 'Your data is protected' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-xl p-6 text-center border-2 border-gray-100"
                >
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-primary text-white mb-4">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-gradient-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {step > 1 ? <CheckCircle className="h-5 w-5" /> : '1'}
                  </div>
                  <div className="h-1 w-16 bg-gray-200">
                    <div className={`h-full bg-gradient-primary transition-all ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
                  </div>
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-gradient-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                    2
                  </div>
                </div>
              </div>

              {step === 1 ? (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Your Resume</h2>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-brand-purple transition-all cursor-pointer">
                    <input
                      type="file"
                      id="resume"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label htmlFor="resume" className="cursor-pointer">
                      <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-semibold text-gray-900 mb-2">
                        Drop your resume here or click to browse
                      </p>
                      <p className="text-sm text-gray-600">PDF, DOC, or DOCX (Max 5MB)</p>
                    </label>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Resume Uploaded Successfully!</h2>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="font-semibold text-gray-900">{resume?.name}</p>
                        <p className="text-sm text-gray-600">Ready to apply to jobs</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 text-gray-700">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Resume parsed and analyzed</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Skills and experience extracted</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Ready for AI-powered applications</span>
                    </div>
                  </div>
                  <button
                    onClick={handleContinue}
                    className="w-full bg-gradient-primary text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
                  >
                    Browse Jobs & Apply
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AIApplyNewPage;
