"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Hero: React.FC = () => {
  return (
    <section className="py-24 md:py-32 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Find the right referrer.
            <br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">Get hired faster.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Join a trusted AI-powered referral network that connects you to verified professionals and ensures safe, transparent payments with escrow.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/find-referrer" className="btn btn-primary w-full sm:w-auto">Find a Referrer</Link>
            <Link href="/become-referrer" className="btn btn-secondary w-full sm:w-auto">Become a Referrer</Link>
          </div>
          <div className="mt-16">
            <div className="relative mx-auto border-gray-800 bg-gray-800 border-[8px] rounded-t-xl h-[172px] max-w-[301px] md:max-w-[512px] xl:max-w-[650px] md:h-[294px] xl:h-[375px]">
                <div className="rounded-xl overflow-hidden h-[156px] md:h-[278px] xl:h-[359px] bg-white">
                    <Image 
                      src="https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/650x375/E2E8F0/4A5568?text=Marketplace+Dashboard" 
                      alt="Marketplace Dashboard visualization" 
                      width={650}
                      height={375}
                      className="h-full w-full object-cover" 
                      priority
                    />
                </div>
            </div>
            <div className="relative mx-auto bg-gray-900 rounded-b-xl h-[24px] max-w-[301px] md:max-w-[512px] xl:max-w-[650px]">
                <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl w-[56px] h-[5px] md:w-[96px] md:h-[8px] bg-gray-800"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
