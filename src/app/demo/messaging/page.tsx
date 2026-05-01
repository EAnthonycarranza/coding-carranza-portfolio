'use client';

import MessagingDemo from '@/components/MessagingDemo';
import Link from 'next/link';

export default function MessagingDemoPage() {
  return (
    <main className="min-h-screen bg-hero-bg text-white selection:bg-accent/30 overflow-hidden">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 lg:pt-32 pb-20 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          {/* Content Section */}
          <div className="space-y-8 animate-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              Real-time Communication Demo
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Omnichannel <span className="text-gradient">Messaging</span> Hub.
            </h1>
            
            <p className="text-xl text-slate-400 max-w-lg leading-relaxed">
              Scale your customer engagement with automated SMS and WhatsApp workflows. This simulator demonstrates how I integrate Twilio into enterprise applications.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-accent/20 group-hover:border-accent/50 transition-all duration-300">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">WhatsApp Business</h3>
                  <p className="text-slate-400 text-sm">Secure, encrypted messaging via the world's most popular messaging app.</p>
                </div>
              </div>

              <div className="flex items-start gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-accent/20 group-hover:border-accent/50 transition-all duration-300">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Programmable SMS</h3>
                  <p className="text-slate-400 text-sm">Reliable global reach with automated notifications and two-way conversations.</p>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link href="/demo" className="inline-flex items-center gap-3 text-slate-400 hover:text-white font-bold transition-all group">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">
                  <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                  </svg>
                </div>
                Back to Demo Center
              </Link>
            </div>
          </div>

          {/* Simulator Section */}
          <div className="relative">
            <div className="absolute -inset-20 bg-accent/5 blur-[100px] rounded-full pointer-events-none animate-pulse"></div>
            <MessagingDemo />
          </div>
        </div>
      </div>
    </main>
  );
}
