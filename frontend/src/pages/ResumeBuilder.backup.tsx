import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Plus, Trash2, Save, Sparkles, Wand2 } from 'lucide-react';
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
    projects: [{ name: '', description: '', tech: '' }],
  });

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

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [...formData.projects, { name: '', description: '', tech: '' }],
    });
  };

  const [generating, setGenerating] = useState(false);

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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-primary text-white px-5 py-2 rounded-full mb-4">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold">AI-Powered</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                AI Resume Builder
              </h1>
              <p className="text-lg text-gray-600">Create ATS-friendly resumes with AI assistance in minutes</p>
              <div className="flex items-center justify-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-brand-purple" />
                  <span className="text-sm text-gray-600">AI Content Generation</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-brand-magenta" />
                  <span className="text-sm text-gray-600">ATS-Optimized</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-brand-teal" />
                  <span className="text-sm text-gray-600">Instant Download</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple"
                />
              </div>
              <div className="mt-6 relative">
                <textarea
                  placeholder="Professional Summary"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple"
                />
                <button
                  type="button"
                  onClick={generateAISummary}
                  disabled={generating}
                  className="absolute top-2 right-2 flex items-center gap-2 bg-gradient-primary text-white px-3 py-1.5 rounded-lg text-sm hover:shadow-lg transition-all disabled:opacity-50"
                >
                  <Sparkles className="h-3 w-3" />
                  {generating ? 'Generating...' : 'AI Generate'}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Experience</h2>
                <button
                  onClick={addExperience}
                  className="flex items-center gap-2 bg-gradient-primary text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>
              {formData.experience.map((exp, index) => (
                <div key={index} className="mb-6 p-4 border-2 border-gray-100 rounded-xl relative">
                  <button
                    type="button"
                    onClick={() => generateAIDescription(index)}
                    disabled={generating}
                    className="absolute top-2 right-2 flex items-center gap-1 bg-gradient-primary text-white px-2 py-1 rounded-lg text-xs hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    <Wand2 className="h-3 w-3" />
                    {generating ? '...' : 'AI'}
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
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
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
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
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
                    className="w-full mb-4 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                  <textarea
                    placeholder="Description"
                    value={exp.description}
                    onChange={(e) => {
                      const newExp = [...formData.experience];
                      newExp[index].description = e.target.value;
                      setFormData({ ...formData, experience: newExp });
                    }}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Education</h2>
                <button
                  onClick={addEducation}
                  className="flex items-center gap-2 bg-gradient-primary text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>
              {formData.education.map((edu, index) => (
                <div key={index} className="mb-6 p-4 border-2 border-gray-100 rounded-xl">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="School/University"
                      value={edu.school}
                      onChange={(e) => {
                        const newEdu = [...formData.education];
                        newEdu[index].school = e.target.value;
                        setFormData({ ...formData, education: newEdu });
                      }}
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    />
                    <input
                      type="text"
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) => {
                        const newEdu = [...formData.education];
                        newEdu[index].degree = e.target.value;
                        setFormData({ ...formData, education: newEdu });
                      }}
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    />
                    <input
                      type="text"
                      placeholder="Year"
                      value={edu.year}
                      onChange={(e) => {
                        const newEdu = [...formData.education];
                        newEdu[index].year = e.target.value;
                        setFormData({ ...formData, education: newEdu });
                      }}
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    />
                    <input
                      type="text"
                      placeholder="GPA (Optional)"
                      value={edu.gpa}
                      onChange={(e) => {
                        const newEdu = [...formData.education];
                        newEdu[index].gpa = e.target.value;
                        setFormData({ ...formData, education: newEdu });
                      }}
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
                <button
                  type="button"
                  onClick={generateAISkills}
                  disabled={generating}
                  className="flex items-center gap-2 bg-gradient-primary text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4" />
                  {generating ? 'Generating...' : 'AI Suggest'}
                </button>
              </div>
              <textarea
                placeholder="Enter skills separated by commas (e.g., React, Node.js, Python, AWS)"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple"
              />
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 bg-gradient-primary text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl transition-all hover:scale-105"
              >
                <Download className="h-5 w-5" />
                Download Resume
              </button>
              <button className="flex items-center gap-2 border-2 border-brand-purple text-brand-purple px-8 py-4 rounded-xl font-bold hover:bg-brand-purple hover:text-white transition-all">
                <Save className="h-5 w-5" />
                Save Draft
              </button>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResumeBuilder;
