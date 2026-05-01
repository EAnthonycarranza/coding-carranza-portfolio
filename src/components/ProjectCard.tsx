import Link from "next/link";
import Image from "next/image";
import Badge from "./ui/Badge";

interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  image_url: string | null;
  technologies: string | null;
  project_url: string | null;
}

export default function ProjectCard({ project }: { project: Project }) {
  const techs = project.technologies
    ? project.technologies.split(",").map((t) => t.trim())
    : [];

  return (
    <article className="group bg-white border border-slate-100 rounded-card-lg overflow-hidden hover:shadow-2xl hover:shadow-accent/5 transition-[transform,box-shadow] duration-500 hover:-translate-y-2">
      <Link href={`/projects/${project.slug}`} className="block relative aspect-[16/10] overflow-hidden">
        {project.image_url ? (
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300" aria-hidden="true">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
              />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
          <span className="text-white font-bold flex items-center gap-2">
            View Case Study
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </div>
      </Link>

      <div className="p-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {techs.slice(0, 3).map((tech) => (
            <Badge key={tech} tone="accent" size="xs">
              {tech}
            </Badge>
          ))}
          {techs.length > 3 && (
            <Badge tone="neutral" size="xs">
              +{techs.length - 3}
            </Badge>
          )}
        </div>

        <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">
          <Link href={`/projects/${project.slug}`}>{project.title}</Link>
        </h3>

        <p className="text-muted text-sm mb-6 line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
          <Link
            href={`/projects/${project.slug}`}
            className="text-sm font-bold text-slate-900 hover:text-accent transition-colors flex items-center gap-1"
          >
            Details
          </Link>
          {project.project_url && (
            <a
              href={project.project_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-accent hover:text-accent-dark transition-colors"
            >
              Live Demo
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
