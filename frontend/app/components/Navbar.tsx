"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Logo = () => (
  <Link to="/" className="flex items-center gap-2">
    <img src="/logo.png" alt="RefDirectly logo" className="h-6 w-6" />
    <span className="font-display font-bold text-xl text-gray-900">RefDirectly</span>
  </Link>
);

const NavLinks = ({ className }: { className?: string }) => (
  <nav className={`flex items-center gap-6 ${className}`}>
    {['How It Works', 'Testimonials', 'About'].map((item) => (
      <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="text-gray-600 hover:text-brand-blue transition-colors duration-200">{item}</a>
    ))}
  </nav>
);

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 bg-white/80 backdrop-blur-lg transition-shadow duration-300 ${isScrolled ? 'shadow-subtle' : ''}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Logo />
          <div className="hidden md:flex items-center gap-8">
            <NavLinks />
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-gray-600 hover:text-brand-blue transition-colors duration-200">Login</Link>
              <Link to="/become-referrer" className="btn btn-secondary !px-4 !py-2">Become a Referrer</Link>
            </div>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg pb-6">
          <div className="container mx-auto px-4 flex flex-col items-center gap-4">
            <NavLinks className="flex-col !gap-4" />
            <hr className="w-full my-2 border-gray-200"/>
            <Link to="/login" className="text-gray-600 hover:text-brand-blue transition-colors duration-200">Login</Link>
            <Link to="/become-referrer" className="btn btn-secondary w-full">Become a Referrer</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
