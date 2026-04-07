import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About | Coding Carranza",
  description: "Learn about Anthony Carranza and Coding Carranza web development services.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-hero-bg text-white overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[80px]" />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 tracking-tight">
            The Story Behind <span className="text-gradient">Coding Carranza</span>
          </h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
            I build digital bridges for small businesses, combining technical 
            excellence with a personal touch.
          </p>
        </div>
      </section>

      <section className="py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Photo with decorative elements */}
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
              
              <div className="aspect-[4/5] relative rounded-3xl overflow-hidden border border-slate-100 shadow-2xl">
                <Image
                  src="/images/anthony.png"
                  alt="Anthony Carranza"
                  fill
                  sizes="(max-width: 1024px) 100vw, 576px"
                  className="object-cover scale-110"
                  priority
                />
              </div>
              
              <div className="absolute -bottom-10 -left-10 glass p-8 rounded-3xl border border-accent/20 shadow-xl hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-accent">Commitment</p>
                    <p className="font-bold text-slate-900">Quality over Quantity</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold tracking-tight">Anthony Carranza</h2>
                <div className="h-1.5 w-20 bg-accent rounded-full" />
              </div>
              
              <p className="text-slate-600 text-xl leading-relaxed font-medium">
                I&apos;m a web developer specializing in Next.js and MERN web app development, 
                passionate about helping small businesses and organizations establish 
                a strong online presence.
              </p>
              
              <div className="space-y-6 text-slate-500 leading-relaxed text-lg">
                <p>
                  At Coding Carranza, I specialize in building custom websites and
                  web applications that are fast, responsive, and tailored to each
                  client&apos;s unique needs. I believe every business, no matter the size, 
                  deserves a professional, modern website that works as hard as they do.
                </p>
                <p>
                  I understand that small businesses operate on tight budgets and
                  timelines. That&apos;s why I focus on delivering high-quality work
                  efficiently, with clear communication every step of the way. 
                </p>
                <p>
                  My goal isn&apos;t just to build a site and disappear. I want to be 
                  your long-term digital partner, helping you navigate the ever-changing 
                  web landscape as your business grows.
                </p>
              </div>
              
              <div className="pt-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-3xl font-bold text-slate-900">100%</p>
                    <p className="text-sm text-slate-500">Client Satisfaction</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-slate-900">Modern</p>
                    <p className="text-sm text-slate-500">Tech Stack</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="mt-40">
            <div className="text-center mb-20">
              <h2 className="section-title text-4xl font-bold">The Coding Carranza Way</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Small Business Focused",
                  desc: "Solutions that respect your budget while aggressively pursuing your business goals.",
                  icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                },
                {
                  title: "Clear Communication",
                  desc: "I translate complex technical concepts into plain language you can actually use.",
                  icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                },
                {
                  title: "Future-Proof Tech",
                  desc: "Built with Next.js, MERN Stack, and Tailwind CSS for lightning-fast speeds and easy maintenance.",
                  icon: "M13 10V3L4 14h7v7l9-11h-7z"
                },
                {
                  title: "Reliable Support",
                  desc: "I'm always just an email or call away whenever you need updates or have questions.",
                  icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                },
              ].map((value) => (
                <div
                  key={value.title}
                  className="p-8 rounded-3xl border border-slate-100 bg-white hover:shadow-xl transition-all"
                >
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={value.icon} />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
