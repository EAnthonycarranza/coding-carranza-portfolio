import Link from "next/link";
import Image from "next/image";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/lib/projects-data";

export const dynamic = "force-static";

export default function Home() {
  const featuredProjects = projects
    .filter((p) => p.featured)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center bg-hero-bg text-white overflow-hidden pt-20">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                Available for new projects
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-[1.1] tracking-tight">
                Premium Web <br />
                <span className="text-gradient">Experiences</span> for Small Biz
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
                I bridge the gap between complex technology and your business goals, 
                specializing in Next.js and MERN web app development to craft 
                high-performance websites that convert visitors into customers.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center bg-accent hover:bg-accent-dark text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-accent/20 transition-all hover:-translate-y-1"
                >
                  Explore My Work
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center glass border-slate-700 hover:border-accent text-white font-bold px-8 py-4 rounded-2xl transition-all hover:-translate-y-1"
                >
                  Let&apos;s Talk
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative w-72 h-72 lg:w-96 lg:h-96">
                {/* Decorative rings */}
                <div className="absolute inset-0 rounded-full border border-accent/20 animate-[spin_10s_linear_infinite]" />
                <div className="absolute -inset-4 rounded-full border border-slate-800 animate-[spin_15s_linear_infinite_reverse]" />
                
                <div className="absolute inset-2 rounded-full overflow-hidden border-4 border-slate-900 shadow-2xl z-10">
                  <Image
                    src="/images/anthony.png"
                    alt="Anthony Carranza"
                    fill
                    sizes="(max-width: 1024px) 288px, 384px"
                    className="object-cover scale-110 hover:scale-100 transition-transform duration-700"
                    priority
                  />
                </div>
                
                {/* Tech Badges */}
                <div className="absolute -right-4 top-10 glass px-4 py-2 rounded-xl border border-accent/30 z-20 shadow-xl animate-bounce">
                  <span className="text-accent font-bold">Next.js</span>
                </div>
                <div className="absolute -left-4 top-10 glass px-4 py-2 rounded-xl border border-blue-400/30 z-20 shadow-xl animate-pulse">
                  <span className="text-blue-400 font-bold">React</span>
                </div>
                <div className="absolute -left-12 top-1/2 -translate-y-1/2 glass px-4 py-2 rounded-xl border border-blue-500/30 z-20 shadow-xl animate-[bounce_2s_infinite]">
                  <span className="text-blue-500 font-bold">TypeScript</span>
                </div>
                <div className="absolute -right-12 top-1/2 -translate-y-1/2 glass px-4 py-2 rounded-xl border border-indigo-400/30 z-20 shadow-xl animate-pulse">
                  <span className="text-indigo-400 font-bold">SEO</span>
                </div>
                <div className="absolute -left-4 bottom-10 glass px-4 py-2 rounded-xl border border-green-500/30 z-20 shadow-xl animate-bounce">
                  <span className="text-green-500 font-bold">Mongo DB</span>
                </div>
                <div className="absolute -right-4 bottom-10 glass px-4 py-2 rounded-xl border border-green-600/30 z-20 shadow-xl animate-pulse">
                  <span className="text-green-600 font-bold">Node.js</span>
                </div>
                <div className="absolute left-1/2 -bottom-6 -translate-x-1/2 glass px-4 py-2 rounded-xl border border-slate-400/30 z-20 shadow-xl animate-bounce">
                  <span className="text-slate-400 font-bold">Express.js</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="section-title text-4xl font-bold">Expert Solutions</h2>
            <p className="text-muted text-lg mt-4">
              I provide a full-service approach to web development, ensuring 
              your digital presence is powerful, secure, and modern.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Custom Development",
                desc: "Clean, performant code tailored to your specific logic and workflow requirements.",
                icon: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5",
                color: "accent"
              },
              {
                title: "UI/UX Strategy",
                desc: "User-centric designs that focus on ease of use while maintaining high visual impact.",
                icon: "M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 01-1.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42",
                color: "blue-500"
              },
              {
                title: "SEO Optimization",
                desc: "Technical SEO baked into the foundation to ensure your site climbs search rankings.",
                icon: "M2.25 18L9 11.25l4.306 4.307a11.25 11.25 0 0011.693-2.333l-10.43 10.43a1.125 1.125 0 01-1.59 0L2.25 18z",
                color: "purple-500"
              },
            ].map((service) => (
              <div
                key={service.title}
                className="group p-10 rounded-3xl border border-slate-100 hover:border-accent/20 bg-slate-50/50 hover:bg-white transition-all hover:shadow-2xl hover:shadow-accent/5"
              >
                <div className={`w-14 h-14 bg-${service.color}/10 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                  <svg
                    className={`w-7 h-7 text-${service.color}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={service.icon} />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-muted leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="py-32 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
              <div className="max-w-2xl">
                <h2 className="section-title text-4xl font-bold mb-0">Success Stories</h2>
                <p className="text-muted text-lg mt-6">
                  A glimpse into the digital transformations I&apos;ve led for 
                  businesses across various industries.
                </p>
              </div>
              <Link
                href="/projects"
                className="group flex items-center gap-2 font-bold text-accent hover:text-accent-dark transition-colors"
              >
                Explore All Projects
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-accent/5 -z-10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block p-4 bg-white rounded-3xl shadow-xl mb-8">
            <div className="flex -space-x-3 overflow-hidden">
              <div className="relative inline-block h-12 w-12 rounded-full ring-4 ring-white bg-slate-200 overflow-hidden">
                <Image 
                  src="https://themilkandhoney.co/static/media/Logo.c6eabcf5c49deefa02f7.png"
                  alt="Milk & Honey Logo"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="relative inline-block h-12 w-12 rounded-full ring-4 ring-white bg-slate-200 overflow-hidden">
                <Image 
                  src="https://lh3.googleusercontent.com/a-/ALV-UjUz45V8tmU6Ujkn_nPy5Ac16du4Bo7XJRvLYbpXU4jSG1io5ic=s80-p"
                  alt="Carranza Restoration Logo"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              {[1, 2].map((i) => (
                <div key={i} className="inline-block h-12 w-12 rounded-full ring-4 ring-white bg-slate-200" />
              ))}
            </div>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-8">
            Ready to Build Your Digital Future?
          </h2>
          <p className="text-slate-500 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Every great project starts with a simple conversation. Let&apos;s 
            discuss your vision and how we can make it a reality.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-accent hover:bg-accent-dark text-white font-bold px-10 py-5 rounded-2xl shadow-xl shadow-accent/30 transition-all hover:-translate-y-1 hover:shadow-accent/40"
          >
            Schedule a Free Consultation
          </Link>
        </div>
      </section>
    </>
  );
}
