import React from 'react';
import { Linkedin, Twitter, Github } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Footer: React.FC = () => {
  const socialLinks = [
    { icon: Linkedin, href: '#' },
    { icon: Twitter, href: '#' },
    { icon: Github, href: '#' },
  ];

  const footerLinks = ['About', 'Privacy Policy', 'Terms', 'Support'];

  return (
    <footer className="bg-dark-gray text-gray-400">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-8">
          <div>
            <Link href="/" className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <Image src="/logo.svg" alt="RefferAI logo" width={32} height={32} />
              <span className="font-display font-bold text-2xl text-white">RefferAI</span>
            </Link>
            <p className="max-w-sm">The modern way to get referred and hired.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-12">
            {footerLinks.map(link => (
              <Link key={link} href="#" className="hover:text-white transition-colors">
                {link}
              </Link>
            ))}
          </div>
        </div>
        <hr className="my-8 border-gray-700" />
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
          <p className="text-sm">&copy; {new Date().getFullYear()} RefferAI, Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => (
              <a key={index} href={social.href} className="text-gray-500 hover:text-white transition-colors">
                <social.icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
