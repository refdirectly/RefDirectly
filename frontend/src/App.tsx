import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Stats from './components/Stats';
import JobShowcase from './components/JobShowcase';
import HowItWorks from './components/HowItWorks';
import PremiumCTA from './components/PremiumCTA';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import Login from './components/Login';
import SignUp from './components/SignUp';
import HowItWorksPage from './pages/HowItWorksPage';
import AboutPage from './pages/AboutPage';
import TestimonialsPage from './pages/TestimonialsPage';
import BecomeReferrerPage from './pages/BecomeReferrerPage';
import FindReferrerPage from './pages/FindReferrerPage';
import JobsPage from './pages/JobsPage';
import ReferrersPage from './pages/ReferrersPage';
import AIApplyPage from './pages/AIApplyPage';
import CompanyPage from './pages/CompanyPage';
import DashboardPage from './pages/DashboardPage';
import ReferrerDashboard from './pages/ReferrerDashboard';
import ReferrerSignupPage from './pages/ReferrerSignupPage';
import ReferrerLoginPage from './pages/ReferrerLoginPage';
import ReferrerRequestsPage from './pages/ReferrerRequestsPage';
import ReferrerEarningsPage from './pages/ReferrerEarningsPage';
import SeekerSignupPage from './pages/SeekerSignupPage';
import AdminJobScraper from './pages/AdminJobScraper';
import AIApplyNewPage from './pages/AIApplyNewPage';
import AIJobSearchPage from './pages/AIJobSearchPage';
import WalletPage from './pages/WalletPage';
import ReferrerWalletPage from './pages/ReferrerWalletPage';
import WalletDemoPage from './pages/WalletDemoPage';
import PostJobPage from './pages/PostJobPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import ChatPage from './pages/ChatPage';
import SeekerChatPage from './pages/SeekerChatPage';
import ReferrerChatPage from './pages/ReferrerChatPage';
import ResumeBuilder from './pages/ResumeBuilder';
import ATSChecker from './pages/ATSChecker';
import ApplicationsPage from './pages/ApplicationsPage';
import Chatbot from './components/Chatbot';

function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Stats />
        <JobShowcase />
        <HowItWorks />
        <PremiumCTA />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Chatbot />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        
        {/* Auth Routes */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/auth/signup/seeker" element={<SeekerSignupPage />} />
        <Route path="/auth/referrer/login" element={<ReferrerLoginPage />} />
        <Route path="/auth/referrer/signup" element={<ReferrerSignupPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        
        {/* Job Seeker Routes */}
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:jobId" element={<CompanyPage />} />
        <Route path="/post-job" element={<PostJobPage />} />
        <Route path="/referrers" element={<ReferrersPage />} />
        <Route path="/referrers/find" element={<FindReferrerPage />} />
        <Route path="/ai-apply" element={<AIApplyPage />} />
        <Route path="/seeker/ai-apply" element={<AIApplyNewPage />} />
        <Route path="/seeker/ai-search" element={<AIJobSearchPage />} />
        <Route path="/seeker/wallet" element={<WalletPage />} />
        <Route path="/wallet-demo" element={<WalletDemoPage />} />
        <Route path="/seeker/dashboard" element={<DashboardPage />} />
        <Route path="/seeker/chat" element={<SeekerChatPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/resume-builder" element={<ResumeBuilder />} />
        <Route path="/ats-checker" element={<ATSChecker />} />
        
        {/* Referrer Routes */}
        <Route path="/referrer/join" element={<BecomeReferrerPage />} />
        <Route path="/referrer/dashboard" element={<ReferrerDashboard />} />
        <Route path="/referrer/chat" element={<ReferrerChatPage />} />
        <Route path="/referrer/requests" element={<ReferrerRequestsPage />} />
        <Route path="/referrer/earnings" element={<ReferrerEarningsPage />} />
        <Route path="/referrer/wallet" element={<ReferrerWalletPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin/scraper" element={<AdminJobScraper />} />
        
        {/* Legacy Redirects */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/referrer-dashboard" element={<ReferrerDashboard />} />
        <Route path="/referrer-signup" element={<ReferrerSignupPage />} />
        <Route path="/referrer-login" element={<ReferrerLoginPage />} />
        <Route path="/referrer-requests" element={<ReferrerRequestsPage />} />
        <Route path="/referrer-earnings" element={<ReferrerEarningsPage />} />
        <Route path="/become-referrer" element={<BecomeReferrerPage />} />
        <Route path="/find-referrer" element={<FindReferrerPage />} />
        <Route path="/company/:companyId" element={<CompanyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
