import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Plus, Save, Sparkles, Wand2, User, Briefcase, GraduationCap, Code } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import html2pdf from 'html2pdf.js';

const ResumeBuilder: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    summary: '',
    experience: [{ company: '', position: '', duration: '', description: '' }],
    education: [{ school: '', degree: '', year: '', gpa: '' }],
    skills: '',
    certifications: '',
    languages: '',
  });

  const [generating, setGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [template, setTemplate] = useState('modern');

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { company: '', position: '', duration: '', description: '' }],
    });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { school: '', degree: '', year: '', gpa: '' }],
    });
  };

  const generateAISummary = async () => {
    if (!formData.experience[0]?.position) {
      alert('Please add at least one experience entry first');
      return;
    }
    setGenerating(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/ai-resume/generate-summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          position: formData.experience[0].position,
          experience: formData.experience.length,
          skills: formData.skills || 'various technical skills'
        })
      });
      const data = await response.json();
      if (data.success) {
        setFormData({ ...formData, summary: data.summary });
      }
    } catch (error) {
      console.error('AI generation error:', error);
      alert('Failed to generate summary. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const generateAIDescription = async (index: number) => {
    const exp = formData.experience[index];
    if (!exp.company || !exp.position) {
      alert('Please fill in company and position first');
      return;
    }
    setGenerating(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/ai-resume/generate-experience`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: exp.company,
          position: exp.position,
          duration: exp.duration || '1 year'
        })
      });
      const data = await response.json();
      if (data.success) {
        const newExp = [...formData.experience];
        newExp[index].description = data.description;
        setFormData({ ...formData, experience: newExp });
      }
    } catch (error) {
      console.error('AI generation error:', error);
      alert('Failed to generate description. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const generateAISkills = async () => {
    if (!formData.experience[0]?.position) {
      alert('Please add at least one experience entry first');
      return;
    }
    setGenerating(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/ai-resume/generate-skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          position: formData.experience[0].position,
          industry: 'Technology'
        })
      });
      const data = await response.json();
      if (data.success) {
        setFormData({ ...formData, skills: data.skills });
      }
    } catch (error) {
      console.error('AI generation error:', error);
      alert('Failed to generate skills. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const resumeRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!resumeRef.current) {
      alert('Please show preview first before downloading');
      return;
    }

    if (!formData.fullName) {
      alert('Please fill in your name before downloading');
      return;
    }

    setDownloading(true);
    try {
      const element = resumeRef.current;
      const opt = {
        margin: 0,
        filename: `${formData.fullName.replace(/\s+/g, '_')}_Resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30">
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
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full mb-6 shadow-xl"
              >
                <Sparkles className="h-5 w-5 animate-pulse" />
                <span className="text-sm font-bold tracking-wide">AI-POWERED RESUME BUILDER</span>
              </motion.div>
              <h1 className="font-display text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Build Your Perfect Resume
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 mt-2">
                  in Minutes
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
                Leverage AI to create professional, ATS-optimized resumes that get you noticed
              </p>
              
              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {[
                  { icon: Sparkles, title: 'AI Content', desc: 'Smart suggestions', gradient: 'from-purple-600 to-pink-600', bg: 'from-purple-50 to-purple-100' },
                  { icon: FileText, title: 'ATS-Optimized', desc: 'Pass tracking systems', gradient: 'from-pink-600 to-red-600', bg: 'from-pink-50 to-pink-100' },
                  { icon: Download, title: 'Instant Export', desc: 'Professional PDF', gradient: 'from-red-600 to-orange-600', bg: 'from-red-50 to-red-100' }
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

            {/* Personal Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 mb-8 border-2 border-white"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
                  <User className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Personal Information</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { placeholder: 'Full Name *', value: formData.fullName, key: 'fullName', type: 'text' },
                  { placeholder: 'Email *', value: formData.email, key: 'email', type: 'email' },
                  { placeholder: 'Phone *', value: formData.phone, key: 'phone', type: 'tel' },
                  { placeholder: 'Location *', value: formData.location, key: 'location', type: 'text' },
                  { placeholder: 'LinkedIn URL', value: formData.linkedin, key: 'linkedin', type: 'url' },
                  { placeholder: 'GitHub URL', value: formData.github, key: 'github', type: 'url' },
                  { placeholder: 'Portfolio URL', value: formData.portfolio, key: 'portfolio', type: 'url' },
                  { placeholder: 'Languages (e.g., English, Spanish)', value: formData.languages, key: 'languages', type: 'text' }
                ].map((field, i) => (
                  <input
                    key={i}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    className="px-5 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                  />
                ))}
              </div>
              <div className="mt-6 relative">
                <textarea
                  placeholder="Professional Summary"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  rows={4}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={generateAISummary}
                  disabled={generating}
                  className="absolute top-3 right-3 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-xl transition-all disabled:opacity-50 hover:scale-105"
                >
                  <Sparkles className="h-4 w-4" />
                  {generating ? 'Generating...' : 'AI Generate'}
                </button>
              </div>
            </motion.div>

            {/* Experience */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 mb-8 border-2 border-white"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                    <Briefcase className="h-7 w-7 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Experience</h2>
                </div>
                <button
                  onClick={addExperience}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-105"
                >
                  <Plus className="h-5 w-5" />
                  Add Experience
                </button>
              </div>
              {formData.experience.map((exp, index) => (
                <div key={index} className="mb-6 p-8 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-3xl relative hover:shadow-xl transition-all">
                  <button
                    type="button"
                    onClick={() => generateAIDescription(index)}
                    disabled={generating}
                    className="absolute top-4 right-4 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:shadow-xl transition-all disabled:opacity-50 hover:scale-105"
                  >
                    <Wand2 className="h-4 w-4" />
                    {generating ? 'Generating...' : 'AI Generate'}
                  </button>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => {
                        const newExp = [...formData.experience];
                        newExp[index].company = e.target.value;
                        setFormData({ ...formData, experience: newExp });
                      }}
                      className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Position"
                      value={exp.position}
                      onChange={(e) => {
                        const newExp = [...formData.experience];
                        newExp[index].position = e.target.value;
                        setFormData({ ...formData, experience: newExp });
                      }}
                      className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Duration (e.g., Jan 2020 - Present)"
                    value={exp.duration}
                    onChange={(e) => {
                      const newExp = [...formData.experience];
                      newExp[index].duration = e.target.value;
                      setFormData({ ...formData, experience: newExp });
                    }}
                    className="w-full mb-4 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                  />
                  <textarea
                    placeholder="Description"
                    value={exp.description}
                    onChange={(e) => {
                      const newExp = [...formData.experience];
                      newExp[index].description = e.target.value;
                      setFormData({ ...formData, experience: newExp });
                    }}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                  />
                </div>
              ))}
            </motion.div>

            {/* Education */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 mb-8 border-2 border-white"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-lg">
                    <GraduationCap className="h-7 w-7 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Education</h2>
                </div>
                <button
                  onClick={addEducation}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-105"
                >
                  <Plus className="h-5 w-5" />
                  Add Education
                </button>
              </div>
              {formData.education.map((edu, index) => (
                <div key={index} className="mb-6 p-8 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-3xl hover:shadow-xl transition-all">
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { placeholder: 'School/University', value: edu.school, key: 'school' },
                      { placeholder: 'Degree', value: edu.degree, key: 'degree' },
                      { placeholder: 'Year', value: edu.year, key: 'year' },
                      { placeholder: 'GPA (Optional)', value: edu.gpa, key: 'gpa' }
                    ].map((field, i) => (
                      <input
                        key={i}
                        type="text"
                        placeholder={field.placeholder}
                        value={field.value}
                        onChange={(e) => {
                          const newEdu = [...formData.education];
                          newEdu[index][field.key] = e.target.value;
                          setFormData({ ...formData, education: newEdu });
                        }}
                        className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 transition-all"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 mb-12 border-2 border-white"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center shadow-lg">
                    <Code className="h-7 w-7 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Skills</h2>
                </div>
                <button
                  type="button"
                  onClick={generateAISkills}
                  disabled={generating}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-50 hover:scale-105"
                >
                  <Sparkles className="h-5 w-5" />
                  {generating ? 'Generating...' : 'AI Suggest Skills'}
                </button>
              </div>
              <textarea
                placeholder="Enter skills separated by commas (e.g., React, Node.js, Python, AWS)"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                rows={4}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
              />
            </motion.div>

            {/* Certifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 mb-8 border-2 border-white"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                  <FileText className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Certifications</h2>
              </div>
              <textarea
                placeholder="Enter certifications (e.g., AWS Certified Solutions Architect, Google Cloud Professional)"
                value={formData.certifications}
                onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                rows={3}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
              />
            </motion.div>

            {/* Template Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 mb-8 border-2 border-white"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg">
                  <FileText className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Choose Professional Template</h2>
                  <p className="text-gray-600">Select an ATS-optimized design that matches your industry</p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    id: 'modern',
                    name: 'Modern Professional',
                    desc: 'Clean, contemporary design with accent colors',
                    color: 'from-blue-600 to-cyan-600',
                    preview: (
                      <div className="h-48 bg-white border-2 border-gray-200 rounded-xl p-3 text-xs">
                        <div className="flex gap-2 mb-2">
                          <div className="w-1/3 h-2 bg-blue-600 rounded"></div>
                          <div className="flex-1 h-2 bg-gray-200 rounded"></div>
                        </div>
                        <div className="space-y-1 mb-2">
                          <div className="h-1.5 bg-gray-300 rounded w-3/4"></div>
                          <div className="h-1.5 bg-gray-300 rounded w-1/2"></div>
                        </div>
                        <div className="border-t border-gray-200 pt-2 space-y-1">
                          <div className="h-1 bg-blue-500 rounded w-1/4"></div>
                          <div className="h-1.5 bg-gray-300 rounded w-full"></div>
                          <div className="h-1.5 bg-gray-300 rounded w-5/6"></div>
                        </div>
                      </div>
                    )
                  },
                  {
                    id: 'executive',
                    name: 'Executive Classic',
                    desc: 'Traditional, elegant layout for senior roles',
                    color: 'from-gray-700 to-gray-900',
                    preview: (
                      <div className="h-48 bg-white border-2 border-gray-200 rounded-xl p-3 text-xs">
                        <div className="text-center mb-2 pb-2 border-b-2 border-gray-800">
                          <div className="h-2 bg-gray-800 rounded w-1/2 mx-auto mb-1"></div>
                          <div className="h-1 bg-gray-400 rounded w-2/3 mx-auto"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-1.5 bg-gray-800 rounded w-1/3"></div>
                          <div className="space-y-1">
                            <div className="h-1 bg-gray-300 rounded w-full"></div>
                            <div className="h-1 bg-gray-300 rounded w-4/5"></div>
                          </div>
                        </div>
                      </div>
                    )
                  },
                  {
                    id: 'minimal',
                    name: 'Minimal Tech',
                    desc: 'Sleek, minimalist design for tech professionals',
                    color: 'from-emerald-600 to-teal-600',
                    preview: (
                      <div className="h-48 bg-white border-2 border-gray-200 rounded-xl p-3 text-xs">
                        <div className="flex gap-2 mb-2">
                          <div className="w-1/4 space-y-1">
                            <div className="h-1.5 bg-emerald-600 rounded"></div>
                            <div className="h-1 bg-gray-300 rounded"></div>
                            <div className="h-1 bg-gray-300 rounded"></div>
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="h-2 bg-gray-800 rounded w-2/3"></div>
                            <div className="h-1 bg-gray-300 rounded w-full"></div>
                            <div className="h-1 bg-gray-300 rounded w-5/6"></div>
                            <div className="h-1 bg-gray-300 rounded w-4/5"></div>
                          </div>
                        </div>
                      </div>
                    )
                  },
                  {
                    id: 'creative',
                    name: 'Creative Bold',
                    desc: 'Eye-catching design for creative industries',
                    color: 'from-purple-600 to-pink-600',
                    preview: (
                      <div className="h-48 bg-white border-2 border-gray-200 rounded-xl p-3 text-xs">
                        <div className="flex gap-2">
                          <div className="w-2/5 bg-gradient-to-br from-purple-100 to-pink-100 rounded p-2 space-y-1">
                            <div className="h-2 bg-purple-600 rounded"></div>
                            <div className="h-1 bg-purple-400 rounded w-3/4"></div>
                            <div className="h-1 bg-purple-400 rounded w-1/2"></div>
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="h-1.5 bg-gray-800 rounded w-2/3"></div>
                            <div className="h-1 bg-gray-300 rounded w-full"></div>
                            <div className="h-1 bg-gray-300 rounded w-5/6"></div>
                          </div>
                        </div>
                      </div>
                    )
                  },
                  {
                    id: 'corporate',
                    name: 'Corporate Professional',
                    desc: 'Formal, structured layout for corporate roles',
                    color: 'from-indigo-600 to-blue-700',
                    preview: (
                      <div className="h-48 bg-white border-2 border-gray-200 rounded-xl p-3 text-xs">
                        <div className="bg-indigo-600 h-6 rounded mb-2 flex items-center px-2">
                          <div className="h-1.5 bg-white rounded w-1/3"></div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-2 space-y-1">
                            <div className="h-1.5 bg-gray-800 rounded w-2/3"></div>
                            <div className="h-1 bg-gray-300 rounded w-full"></div>
                            <div className="h-1 bg-gray-300 rounded w-5/6"></div>
                          </div>
                          <div className="space-y-1">
                            <div className="h-1 bg-indigo-500 rounded"></div>
                            <div className="h-1 bg-gray-300 rounded"></div>
                          </div>
                        </div>
                      </div>
                    )
                  },
                  {
                    id: 'academic',
                    name: 'Academic Research',
                    desc: 'Detailed format for academic and research positions',
                    color: 'from-amber-600 to-orange-600',
                    preview: (
                      <div className="h-48 bg-white border-2 border-gray-200 rounded-xl p-3 text-xs">
                        <div className="text-center mb-2">
                          <div className="h-2 bg-gray-800 rounded w-1/2 mx-auto mb-1"></div>
                          <div className="h-1 bg-amber-600 rounded w-1/4 mx-auto"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="border-l-2 border-amber-600 pl-2 space-y-1">
                            <div className="h-1.5 bg-gray-700 rounded w-2/3"></div>
                            <div className="h-1 bg-gray-300 rounded w-full"></div>
                            <div className="h-1 bg-gray-300 rounded w-4/5"></div>
                          </div>
                        </div>
                      </div>
                    )
                  }
                ].map((t) => (
                  <motion.button
                    key={t.id}
                    onClick={() => setTemplate(t.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-6 rounded-2xl border-2 transition-all text-left ${
                      template === t.id
                        ? 'border-purple-600 bg-purple-50 shadow-2xl ring-4 ring-purple-200'
                        : 'border-gray-200 hover:border-purple-300 hover:shadow-xl'
                    }`}
                  >
                    {t.preview}
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`h-3 w-3 rounded-full bg-gradient-to-r ${t.color}`}></div>
                        <h3 className="font-bold text-gray-900">{t.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600">{t.desc}</p>
                      {template === t.id && (
                        <div className="mt-3 flex items-center gap-2 text-purple-600 font-semibold text-sm">
                          <div className="h-2 w-2 rounded-full bg-purple-600 animate-pulse"></div>
                          Selected
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Resume Preview */}
            {showPreview && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl shadow-2xl p-10 mb-8 border-2 border-purple-200"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Resume Preview</h2>
                  <span className="text-sm text-gray-600 bg-purple-100 px-4 py-2 rounded-full">
                    Template: {template.charAt(0).toUpperCase() + template.slice(1)}
                  </span>
                </div>
                
                {/* A4 Paper Preview - ATS Optimized */}
                <div ref={resumeRef} className="bg-white border-2 border-gray-300 rounded-lg shadow-xl mx-auto" style={{ width: '210mm', minHeight: '297mm', padding: '15mm 20mm', fontFamily: 'Arial, sans-serif' }}>
                  {/* Header - ATS Optimized */}
                  <div className={`mb-5 pb-3 ${
                    template === 'modern' ? 'border-b-2 border-blue-600' :
                    template === 'executive' ? 'border-b-2 border-gray-800 text-center' :
                    template === 'corporate' ? 'border-b-2 border-indigo-600' :
                    template === 'academic' ? 'text-center border-b border-gray-400' :
                    'border-b-2 border-gray-400'
                  }`}>
                    <h1 className="font-bold text-2xl text-gray-900 mb-2 uppercase tracking-wide" style={{ letterSpacing: '0.5px' }}>
                      {formData.fullName || 'YOUR NAME'}
                    </h1>
                    <div className={`text-xs text-gray-700 leading-relaxed ${
                      template === 'executive' || template === 'academic' ? 'text-center' : ''
                    }`}>
                      {formData.email && <span className="mr-3">{formData.email}</span>}
                      {formData.phone && <span className="mr-3">| {formData.phone}</span>}
                      {formData.location && <span className="mr-3">| {formData.location}</span>}
                      {formData.linkedin && <span className="mr-3">| LinkedIn: {formData.linkedin.replace('https://', '').replace('http://', '')}</span>}
                      {formData.github && <span>| GitHub: {formData.github.replace('https://', '').replace('http://', '')}</span>}
                    </div>
                  </div>

                  {/* Summary - ATS Optimized */}
                  {formData.summary && (
                    <div className="mb-5">
                      <h2 className={`font-bold text-base mb-2 uppercase tracking-wide ${
                        template === 'modern' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' :
                        template === 'corporate' ? 'text-indigo-600 bg-indigo-50 px-2 py-1' :
                        template === 'academic' ? 'text-amber-600 border-l-4 border-amber-600 pl-2' :
                        template === 'executive' ? 'text-gray-900 border-b border-gray-400 pb-1' :
                        'text-gray-900 border-b-2 border-gray-300 pb-1'
                      }`}>PROFESSIONAL SUMMARY</h2>
                      <p className="text-gray-800 text-xs leading-relaxed" style={{ lineHeight: '1.6' }}>{formData.summary}</p>
                    </div>
                  )}

                  {/* Experience - ATS Optimized */}
                  {formData.experience.some(e => e.company || e.position) && (
                    <div className="mb-5">
                      <h2 className={`font-bold text-base mb-2 uppercase tracking-wide ${
                        template === 'modern' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' :
                        template === 'corporate' ? 'text-indigo-600 bg-indigo-50 px-2 py-1' :
                        template === 'academic' ? 'text-amber-600 border-l-4 border-amber-600 pl-2' :
                        template === 'executive' ? 'text-gray-900 border-b border-gray-400 pb-1' :
                        'text-gray-900 border-b-2 border-gray-300 pb-1'
                      }`}>PROFESSIONAL EXPERIENCE</h2>
                      {formData.experience.map((exp, i) => (
                        (exp.company || exp.position) && (
                          <div key={i} className="mb-3">
                            <div className="flex justify-between items-start mb-1">
                              <div className="flex-1">
                                <h3 className="font-bold text-sm text-gray-900 uppercase">{exp.position || 'POSITION TITLE'}</h3>
                                <p className="text-xs text-gray-700 font-semibold">{exp.company || 'Company Name'}</p>
                              </div>
                              <span className="text-xs text-gray-600 font-semibold whitespace-nowrap ml-4">{exp.duration}</span>
                            </div>
                            {exp.description && (
                              <div className="text-xs text-gray-800 mt-1.5 leading-relaxed" style={{ lineHeight: '1.5' }}>
                                {exp.description.split('\n').map((line, idx) => (
                                  line.trim() && (
                                    <div key={idx} className="mb-1">
                                      {line.trim().startsWith('•') || line.trim().startsWith('-') ? line : `• ${line}`}
                                    </div>
                                  )
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      ))}
                    </div>
                  )}

                  {/* Education - ATS Optimized */}
                  {formData.education.some(e => e.school || e.degree) && (
                    <div className="mb-5">
                      <h2 className={`font-bold text-base mb-2 uppercase tracking-wide ${
                        template === 'modern' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' :
                        template === 'corporate' ? 'text-indigo-600 bg-indigo-50 px-2 py-1' :
                        template === 'academic' ? 'text-amber-600 border-l-4 border-amber-600 pl-2' :
                        template === 'executive' ? 'text-gray-900 border-b border-gray-400 pb-1' :
                        'text-gray-900 border-b-2 border-gray-300 pb-1'
                      }`}>EDUCATION</h2>
                      {formData.education.map((edu, i) => (
                        (edu.school || edu.degree) && (
                          <div key={i} className="mb-2">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h3 className="font-bold text-sm text-gray-900">{edu.degree || 'Degree'}</h3>
                                <p className="text-xs text-gray-700">{edu.school || 'School'}</p>
                              </div>
                              <div className="text-right text-xs text-gray-600 whitespace-nowrap ml-4">
                                <p className="font-semibold">{edu.year}</p>
                                {edu.gpa && <p>GPA: {edu.gpa}</p>}
                              </div>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  )}

                  {/* Skills - ATS Optimized */}
                  {formData.skills && (
                    <div className="mb-6">
                      <h2 className={`font-bold text-lg mb-3 uppercase tracking-wide ${
                        template === 'modern' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' :
                        template === 'creative' ? 'text-purple-600' :
                        template === 'corporate' ? 'text-indigo-600 bg-indigo-50 px-2 py-1' :
                        template === 'academic' ? 'text-amber-600 border-l-4 border-amber-600 pl-2' :
                        template === 'executive' ? 'text-gray-900 border-b border-gray-400 pb-1' :
                        'text-gray-900 border-b-2 border-gray-300 pb-1'
                      }`}>TECHNICAL SKILLS</h2>
                      
                      {/* ATS-Friendly Format: Simple text list */}
                      <div className="text-sm text-gray-800 leading-relaxed">
                        {(() => {
                          const skills = formData.skills.split(',').map(s => s.trim()).filter(s => s);
                          const categories = {
                            'Programming Languages': skills.filter(s => 
                              /\b(JavaScript|TypeScript|Python|Java|C\+\+|C#|Ruby|Go|Rust|PHP|Swift|Kotlin|Scala|R|MATLAB)\b/i.test(s)
                            ),
                            'Frameworks & Libraries': skills.filter(s => 
                              /\b(React|Angular|Vue|Node|Express|Django|Flask|Spring|Laravel|Rails|Next|Nuxt|Svelte|jQuery)\b/i.test(s)
                            ),
                            'Databases': skills.filter(s => 
                              /\b(MongoDB|MySQL|PostgreSQL|Redis|Cassandra|DynamoDB|Oracle|SQL Server|Firebase|Elasticsearch)\b/i.test(s)
                            ),
                            'Cloud & DevOps': skills.filter(s => 
                              /\b(AWS|Azure|GCP|Docker|Kubernetes|Jenkins|GitLab|CircleCI|Terraform|Ansible|Linux)\b/i.test(s)
                            ),
                            'Tools & Technologies': skills.filter(s => 
                              /\b(Git|GitHub|Jira|Confluence|Postman|VS Code|IntelliJ|Figma|Sketch|Photoshop)\b/i.test(s)
                            )
                          };
                          
                          const uncategorized = skills.filter(skill => 
                            !Object.values(categories).some(cat => cat.includes(skill))
                          );
                          
                          if (uncategorized.length > 0) {
                            categories['Other Skills'] = uncategorized;
                          }
                          
                          return Object.entries(categories).map(([category, items]) => 
                            items.length > 0 && (
                              <div key={category} className="mb-2">
                                <span className="font-semibold text-gray-900">{category}:</span>{' '}
                                <span className="text-gray-700">{items.join(' • ')}</span>
                              </div>
                            )
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Certifications - ATS Optimized */}
                  {formData.certifications && (
                    <div className="mb-5">
                      <h2 className={`font-bold text-base mb-2 uppercase tracking-wide ${
                        template === 'modern' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' :
                        template === 'corporate' ? 'text-indigo-600 bg-indigo-50 px-2 py-1' :
                        template === 'academic' ? 'text-amber-600 border-l-4 border-amber-600 pl-2' :
                        template === 'executive' ? 'text-gray-900 border-b border-gray-400 pb-1' :
                        'text-gray-900 border-b-2 border-gray-300 pb-1'
                      }`}>CERTIFICATIONS</h2>
                      <div className="text-xs text-gray-800 leading-relaxed">
                        {formData.certifications.split('\n').map((cert, i) => (
                          cert.trim() && (
                            <div key={i} className="mb-1">
                              • {cert.trim()}
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Languages - ATS Optimized */}
                  {formData.languages && (
                    <div>
                      <h2 className={`font-bold text-base mb-2 uppercase tracking-wide ${
                        template === 'modern' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' :
                        template === 'corporate' ? 'text-indigo-600 bg-indigo-50 px-2 py-1' :
                        template === 'academic' ? 'text-amber-600 border-l-4 border-amber-600 pl-2' :
                        template === 'executive' ? 'text-gray-900 border-b border-gray-400 pb-1' :
                        'text-gray-900 border-b-2 border-gray-300 pb-1'
                      }`}>LANGUAGES</h2>
                      <p className="text-xs text-gray-800">{formData.languages}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-12 py-6 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105 w-full sm:w-auto"
              >
                <FileText className="h-6 w-6" />
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
              <button
                onClick={handleDownload}
                disabled={downloading || !showPreview}
                className="flex items-center gap-3 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white px-12 py-6 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="h-6 w-6" />
                {downloading ? 'Generating PDF...' : 'Download PDF'}
              </button>
              <button className="flex items-center gap-3 bg-white border-2 border-purple-600 text-purple-600 px-12 py-6 rounded-2xl font-bold text-lg hover:bg-purple-600 hover:text-white hover:shadow-2xl transition-all hover:scale-105 w-full sm:w-auto">
                <Save className="h-6 w-6" />
                Save Draft
              </button>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResumeBuilder;
