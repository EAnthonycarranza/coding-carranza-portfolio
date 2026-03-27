import Link from "next/link";

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
    <div className="bg-white border border-card-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="aspect-video bg-gray-200 relative overflow-hidden">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
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
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
        <p className="text-muted text-sm mb-4 line-clamp-2">
          {project.description}
        </p>
        {techs.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {techs.map((tech) => (
              <span
                key={tech}
                className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-3">
          <Link
            href={`/projects/${project.slug}`}
            className="text-sm font-medium text-accent hover:text-accent-dark transition-colors"
          >
            View Details
          </Link>
          {project.project_url && (
            <a
              href={project.project_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              Visit Site
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
