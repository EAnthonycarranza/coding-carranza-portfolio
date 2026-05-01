'use client';

import PdfDemo from '@/components/PdfDemo';
import Link from 'next/link';
import Script from 'next/script';

export default function PdfDemoPage() {
  return (
    <main className="min-h-screen bg-hero-bg text-white selection:bg-indigo-500/30 overflow-hidden">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[20%] w-[40%] h-[40%] bg-indigo-500/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 lg:pt-32 pb-20 lg:pb-32">
        <div className="mb-16 animate-in slide-in-from-left duration-1000 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Real-time Document Generation
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6 text-gradient">
            Automated <span className="text-white">Paperwork</span>.
          </h1>
          
          <p className="text-xl text-slate-400 leading-relaxed mb-8">
            Stop writing receipts by hand. I build high-performance systems that automatically generate and email branded PDF invoices, contracts, or packing slips the second a customer places an order.
          </p>

          <Link href="/demo" className="inline-flex items-center gap-3 text-slate-400 hover:text-white font-bold transition-all group">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">
              <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
            </div>
            Back to Demo Center
          </Link>
        </div>

        {/* Demo Component */}
        <div className="relative">
          <div className="absolute -inset-20 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none animate-pulse"></div>
          <PdfDemo />
        </div>
      </div>
    </main>
  );
}
