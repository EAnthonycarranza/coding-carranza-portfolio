import { MetadataRoute } from 'next';
import { projects } from '@/lib/projects-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.codingcarranza.com';

  // Base routes
  const routes = ['', '/projects', '/about', '/contact'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Project routes
  const projectRoutes = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(project.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...routes, ...projectRoutes];
}
