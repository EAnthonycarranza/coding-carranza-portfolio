import { notFound } from "next/navigation";
import getDb from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import React from "react";

interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  long_description: string | null;
  client_name: string | null;
  project_url: string | null;
  image_url: string | null;
  technologies: string | null;
  created_at: string;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const db = getDb();
  const project = db
    .prepare("SELECT title, description FROM projects WHERE slug = ?")
    .get(slug) as { title: string; description: string } | undefined;

  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} | Case Study`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const db = getDb();
  const project = db
    .prepare("SELECT * FROM projects WHERE slug = ?")
    .get(slug) as Project | undefined;

  if (!project) notFound();

  const techs = project.technologies
    ? project.technologies.split(",").map((t) => t.trim())
    : [];

  const longDesc = project.long_description || "A custom-built solution focused on high performance and user experience.";

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-hero-bg text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 text-slate-400 hover:text-accent font-bold mb-8 transition-colors"
          >
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Back to Case Studies
          </Link>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-[1.1]">
            {project.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-slate-400">
            {project.client_name && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-accent">Client</span>
                <span className="font-bold text-white">{project.client_name}</span>
              </div>
            )}
            <div className="w-1.5 h-1.5 rounded-full bg-slate-700 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-accent">Role</span>
              <span className="font-bold text-white">Full Stack Dev</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {project.image_url && (
            <div className="mb-24 rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl aspect-[16/9] relative">
              <Image
                src={project.image_url}
                alt={project.title}
                fill
                sizes="(max-width: 1200px) 100vw, 1152px"
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-20">
            <div className="lg:col-span-2 space-y-12">
              <div>
                <h2 className="text-3xl font-bold mb-10 tracking-tight">The Journey</h2>
                <div className="space-y-12">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => {
                        // Extract text content safely to check for markers
                        const childrenArray = React.Children.toArray(children);
                        const firstChild = childrenArray[0];
                        
                        let textContent = "";
                        if (typeof firstChild === "string") {
                          textContent = firstChild;
                        } else if (
                          React.isValidElement(firstChild) && 
                          typeof (firstChild.props as any).children === "string"
                        ) {
                          textContent = (firstChild.props as any).children;
                        }

                        if (textContent.startsWith("Challenge:")) {
                          return (
                            <div className="group relative pl-8 py-8 bg-white rounded-3xl border border-slate-100 shadow-sm transition-all hover:border-red-200 hover:shadow-xl hover:shadow-red-500/5 overflow-hidden">
                              <div className="absolute top-0 left-0 w-1.5 h-full bg-red-400" />
                              <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                              <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-3">
                                  <span className="w-6 h-6 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-xs font-black shadow-sm">!</span>
                                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-red-500">The Challenge</h4>
                                </div>
                                <div className="text-slate-700 text-xl leading-relaxed font-medium">
                                  {children}
                                </div>
                              </div>
                            </div>
                          );
                        }

                        if (textContent.startsWith("Solution:")) {
                          return (
                            <div className="group relative pl-8 py-8 bg-white rounded-3xl border border-slate-100 shadow-sm transition-all hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 overflow-hidden">
                              <div className="absolute top-0 left-0 w-1.5 h-full bg-accent" />
                              <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                              <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                  <span className="w-6 h-6 bg-accent/10 text-accent rounded-lg flex items-center justify-center text-xs font-black shadow-sm">✓</span>
                                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-accent">The Solution</h4>
                                </div>
                                <div className="text-slate-700 text-xl leading-relaxed">
                                  {children}
                                </div>
                              </div>
                            </div>
                          );
                        }

                        return <p className="text-slate-600 text-lg sm:text-xl leading-relaxed mb-8">{children}</p>;
                      },
                      strong: ({ children }) => {
                        const content = children?.toString() || "";
                        if (content.startsWith("Challenge:") || content.startsWith("Solution:")) {
                          return null; // Hide the marker as we use the custom headers
                        }
                        return <strong className="font-bold text-slate-900">{children}</strong>;
                      },
                      h3: ({ children }) => <h3 className="text-2xl font-bold text-slate-900 mt-12 mb-6 tracking-tight">{children}</h3>,
                      ul: ({ children }) => <ul className="space-y-4 mb-8 ml-4">{children}</ul>,
                      li: ({ children }) => (
                        <li className="flex items-start gap-3 text-slate-600 text-lg">
                          <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                          <span>{children}</span>
                        </li>
                      ),
                    }}
                  >
                    {longDesc}
                  </ReactMarkdown>
                </div>
              </div>
            </div>

            <div className="space-y-12">
              {techs.length > 0 && (
                <div className="glass p-8 rounded-3xl border border-slate-100">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Tech Stack</h3>
                  <div className="flex flex-wrap gap-3">
                    {techs.map((tech) => (
                      <span
                        key={tech}
                        className="text-sm font-bold bg-white border border-slate-100 text-slate-900 px-4 py-2 rounded-xl shadow-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project.project_url && (
                <div className="p-8 rounded-3xl bg-slate-900 text-white shadow-2xl shadow-slate-200">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Live Project</h3>
                  <p className="text-slate-300 text-sm mb-8 leading-relaxed">
                    Experience the final product live in your browser to see the 
                    performance and interactions firsthand.
                  </p>
                  <a
                    href={project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-accent-dark text-white font-bold px-6 py-4 rounded-2xl transition-all hover:-translate-y-1"
                  >
                    Visit Website
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Next Project CTA */}
      <section className="py-32 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8 tracking-tight">Interested in similar results?</h2>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-white border border-slate-200 hover:border-accent text-slate-900 font-bold px-10 py-5 rounded-2xl transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            Start Your Project Discovery
          </Link>
        </div>
      </section>
    </>
  );
}
