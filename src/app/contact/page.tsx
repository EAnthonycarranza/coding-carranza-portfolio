import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact | Coding Carranza",
  description:
    "Get in touch with Anthony Carranza for your web development needs.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero & Background Elements */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-hero-bg text-white overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center lg:text-left">
          <div className="max-w-3xl">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-[1.1] tracking-tight">
              Let&apos;s Build Something <br />
              <span className="text-gradient">Extraordinary</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed mx-auto lg:mx-0">
              Whether you have a fully-formed idea or just a spark of inspiration, 
              I&apos;m here to help you bring it to life with high-performance code 
              and user-centric design.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="relative -mt-16 lg:-mt-24 pb-32 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Contact Info & Cards */}
            <div className="lg:col-span-5 space-y-8">
              <div className="glass p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
                <h2 className="text-2xl font-bold mb-8 text-slate-900">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="group flex items-start gap-5 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Email Me Directly</p>
                      <a href="mailto:anthony@codingcarranza.com" className="text-lg font-bold text-slate-900 hover:text-accent transition-colors break-all">
                        anthony@codingcarranza.com
                      </a>
                      <p className="text-sm text-slate-500 mt-1">Average response: 4-6 hours</p>
                    </div>
                  </div>

                  <div className="group flex items-start gap-5 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Strategy Call</p>
                      <p className="text-lg font-bold text-slate-900">Free 30-min Consultation</p>
                      <p className="text-sm text-slate-500 mt-1">Discuss goals, tech stack & timeline.</p>
                    </div>
                  </div>

                  <div className="group flex items-start gap-5 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Location</p>
                      <p className="text-lg font-bold text-slate-900">Remote & Nationwide</p>
                      <p className="text-sm text-slate-500 mt-1">Based in the USA, working globally.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 p-6 rounded-3xl bg-slate-900 text-white">
                  <p className="text-sm font-medium text-slate-400 mb-4 italic">
                    &ldquo;My goal is to translate your business requirements into 
                    a seamless digital experience that scales.&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center font-bold text-sm">
                      AC
                    </div>
                    <div>
                      <p className="font-bold text-sm leading-none">Anthony Carranza</p>
                      <p className="text-xs text-slate-500 mt-1">Founder & Developer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <div className="text-center lg:text-left mb-8 px-4">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Send a Message</h2>
                <p className="text-slate-500 max-w-lg">
                  Fill out the form below and I&apos;ll get back to you as soon as 
                  possible to discuss your project.
                </p>
              </div>
              <ContactForm />
            </div>

          </div>
        </div>
      </section>

      {/* Trust & FAQ Preview */}
      <section className="py-20 bg-slate-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Confidentiality",
                desc: "Your ideas and project details are always kept secure and private."
              },
              {
                title: "Fast Response",
                desc: "Expect a detailed reply within 24 hours of your inquiry."
              },
              {
                title: "Expert Guidance",
                desc: "Receive professional advice on tech stack and scalability."
              }
            ].map((item, idx) => (
              <div key={idx} className="p-8 rounded-3xl border border-slate-100 bg-white">
                <h3 className="text-lg font-bold mb-3 text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
