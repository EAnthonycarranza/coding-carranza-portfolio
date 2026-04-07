import type { Metadata } from "next";
import ProjectCard from "@/components/ProjectCard";
import Link from "next/link";
import { projects as allProjects } from "@/lib/projects-data";

export const metadata: Metadata = {
  title: "Projects | Coding Carranza",
  description: "Browse web development projects by Anthony Carranza.",
};

export const dynamic = "force-static";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1");
  const limit = 6;
  const offset = (currentPage - 1) * limit;

  const projects = allProjects.slice(offset, offset + limit);
  const totalProjects = allProjects.length;
  const totalPages = Math.ceil(totalProjects / limit);

  const getGridClasses = (count: number) => {
    switch (count) {
      case 1:
        return "grid-cols-1 max-w-3xl mx-auto";
      case 2:
        return "grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto";
      case 4:
        return "grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto";
      case 3:
      case 5:
      case 6:
      default:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-hero-bg text-white overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 tracking-tight">
            Case <span className="text-gradient">Studies</span>
          </h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
            A deep dive into the technical solutions and creative strategies 
            I&apos;ve implemented for my clients.
          </p>
        </div>
      </section>

      <section className="py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {projects.length === 0 ? (
            <div className="text-center py-20 glass rounded-[2.5rem] border border-slate-100">
              <p className="text-slate-400 text-xl font-medium">
                Projects are currently being curated. Check back very soon!
              </p>
            </div>
          ) : (
            <>
              <div className={`grid gap-10 ${getGridClasses(projects.length)}`}>
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-20 flex justify-center items-center gap-4">
                  {currentPage > 1 && (
                    <Link
                      href={`/projects?page=${currentPage - 1}`}
                      className="px-6 py-3 rounded-xl glass border border-slate-200 text-sm font-bold hover:border-accent transition-all"
                    >
                      Previous
                    </Link>
                  )}
                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <Link
                        key={i + 1}
                        href={`/projects?page=${i + 1}`}
                        className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold text-sm transition-all ${
                          currentPage === i + 1
                            ? "bg-accent text-white shadow-lg shadow-accent/20"
                            : "glass border border-slate-100 hover:border-accent"
                        }`}
                      >
                        {i + 1}
                      </Link>
                    ))}
                  </div>
                  {currentPage < totalPages && (
                    <Link
                      href={`/projects?page=${currentPage + 1}`}
                      className="px-6 py-3 rounded-xl glass border border-slate-200 text-sm font-bold hover:border-accent transition-all"
                    >
                      Next
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Trust Quote */}
      <section className="pb-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass p-12 rounded-[2.5rem] border border-slate-100 text-center italic text-slate-500 text-xl leading-relaxed">
            &ldquo;Anthony didn&apos;t just build a website; he built a growth engine for our 
            business. The attention to detail and performance optimization was 
            beyond what we expected from a solo developer.&rdquo;
          </div>
        </div>
      </section>
    </>
  );
}

