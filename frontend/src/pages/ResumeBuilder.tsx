import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Plus, Save, Sparkles, Wand2, User, Briefcase, GraduationCap, Code } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ResumeBuilder: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    experience: [{ company: '', position: '', duration: '', description: '' }],
    education: [{ school: '', degree: '', year: '', gpa: '' }],
    skills: '',
  });

  const [generating, setGenerating] = useState(false);

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

  const handleDownload = () => {
    alert('Resume download functionality will be implemented with PDF generation');
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
                  { placeholder: 'Full Name', value: formData.fullName, key: 'fullName', type: 'text' },
                  { placeholder: 'Email', value: formData.email, key: 'email', type: 'email' },
                  { placeholder: 'Phone', value: formData.phone, key: 'phone', type: 'tel' },
                  { placeholder: 'Location', value: formData.location, key: 'location', type: 'text' }
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

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <button
                onClick={handleDownload}
                className="flex items-center gap-3 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white px-12 py-6 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105 w-full sm:w-auto"
              >
                <Download className="h-6 w-6" />
                Download Resume PDF
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
