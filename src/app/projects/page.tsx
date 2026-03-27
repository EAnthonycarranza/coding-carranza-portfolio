import type { Metadata } from "next";
import getDb from "@/lib/db";
import ProjectCard from "@/components/ProjectCard";

export const metadata: Metadata = {
  title: "Projects | Coding Carranza",
  description: "Browse web development projects by Anthony Carranza.",
};

export const dynamic = "force-dynamic";

interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  image_url: string | null;
  technologies: string | null;
  project_url: string | null;
}

export default function ProjectsPage() {
  const db = getDb();
  const projects = db
    .prepare(
      "SELECT id, title, slug, description, image_url, technologies, project_url FROM projects ORDER BY created_at DESC"
    )
    .all() as Project[];

  return (
    <>
      <section className="bg-foreground text-background py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            My <span className="text-accent">Projects</span>
          </h1>
          <p className="text-gray-400 text-lg">
            A showcase of websites and applications I&apos;ve built for clients.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {projects.length === 0 ? (
            <p className="text-center text-muted text-lg">
              Projects coming soon! Check back later.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
