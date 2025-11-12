import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'RefferAI | AI-Powered Referral Marketplace',
  description: 'Join a trusted AI-powered referral network that connects you to verified professionals and ensures safe, transparent payments.',
  openGraph: {
    title: 'RefferAI | AI-Powered Referral Marketplace',
    description: 'Join a trusted AI-powered referral network that connects you to verified professionals and ensures safe, transparent payments.',
    url: 'https://alpha.dualite.dev', // Replace with your actual URL
    siteName: 'RefferAI',
    images: [
      {
        url: 'https://i.ibb.co/67X3xfS/referly-og-image.png', // Replace with your actual OG image
        width: 1200,
        height: 630,
        alt: 'A preview of the RefferAI landing page showing its hero section.',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RefferAI | AI-Powered Referral Marketplace',
    description: 'Join a trusted AI-powered referral network that connects you to verified professionals and ensures safe, transparent payments.',
    // site: '@yourtwitterhandle', // Replace with your Twitter handle
    images: ['https://i.ibb.co/67X3xfS/referly-og-image.png'], // Replace with your actual OG image
  },
  icons: {
    icon: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} scroll-smooth`}>
      <body className="bg-white text-gray-800 antialiased">
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
