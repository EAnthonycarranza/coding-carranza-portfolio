import { notFound } from "next/navigation";
import getDb from "@/lib/db";
import Link from "next/link";
import type { Metadata } from "next";

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
    title: `${project.title} | Coding Carranza`,
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

  return (
    <>
      <section className="bg-foreground text-background py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/projects"
            className="text-gray-400 hover:text-accent text-sm mb-4 inline-block"
          >
            &larr; Back to Projects
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold">{project.title}</h1>
          {project.client_name && (
            <p className="text-gray-400 mt-2">Client: {project.client_name}</p>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {project.image_url && (
            <div className="mb-10 rounded-xl overflow-hidden border border-card-border">
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full"
              />
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">About This Project</h2>
                <p className="text-muted leading-relaxed whitespace-pre-line">
                  {project.long_description || project.description}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {techs.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {techs.map((tech) => (
                      <span
                        key={tech}
                        className="text-sm bg-accent/10 text-accent px-3 py-1 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project.project_url && (
                <div>
                  <h3 className="font-semibold mb-3">Live Site</h3>
                  <a
                    href={project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-2 rounded-lg transition-colors text-sm"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
