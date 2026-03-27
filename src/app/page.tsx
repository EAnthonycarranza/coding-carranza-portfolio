import Link from "next/link";
import Image from "next/image";
import getDb from "@/lib/db";
import ProjectCard from "@/components/ProjectCard";

interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  image_url: string | null;
  technologies: string | null;
  project_url: string | null;
}

export const dynamic = "force-dynamic";

export default function Home() {
  const db = getDb();
  const featuredProjects = db
    .prepare(
      "SELECT id, title, slug, description, image_url, technologies, project_url FROM projects WHERE featured = 1 ORDER BY created_at DESC LIMIT 6"
    )
    .all() as Project[];

  return (
    <>
      {/* Hero */}
      <section className="bg-foreground text-background py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Professional Web Solutions for{" "}
                <span className="text-accent">Small Businesses</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mb-10">
                I build modern, fast, and reliable websites that help small
                businesses and organizations grow their online presence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/projects"
                  className="inline-block bg-accent hover:bg-accent-dark text-white font-semibold px-8 py-3 rounded-lg transition-colors"
                >
                  View My Work
                </Link>
                <Link
                  href="/contact"
                  className="inline-block border border-gray-500 hover:border-accent text-gray-300 hover:text-accent font-semibold px-8 py-3 rounded-lg transition-colors"
                >
                  Get In Touch
                </Link>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="relative w-64 h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden border-4 border-accent/30 shadow-2xl shadow-accent/10">
                <Image
                  src="/images/anthony.png"
                  alt="Anthony Carranza"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            What I Offer
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Custom Websites",
                desc: "Tailored websites designed to meet your unique business needs, from landing pages to full web applications.",
                icon: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418",
              },
              {
                title: "Responsive Design",
                desc: "Every site looks and works great on all devices - desktops, tablets, and phones - ensuring you reach every customer.",
                icon: "M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3",
              },
              {
                title: "Ongoing Support",
                desc: "I don't disappear after launch. Get reliable maintenance, updates, and support to keep your site running smoothly.",
                icon: "M11.42 15.17l-5.1-5.1m0 0L11.42 4.97m-5.1 5.1H21M3 12a9 9 0 1118 0 9 9 0 01-18 0z",
              },
            ].map((service) => (
              <div
                key={service.title}
                className="bg-card-bg border border-card-border rounded-xl p-8 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg
                    className="w-7 h-7 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={service.icon}
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-muted">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="py-20 bg-card-bg">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              Featured Projects
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/projects"
                className="inline-block bg-accent hover:bg-accent-dark text-white font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                View All Projects
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Grow Your Business Online?
          </h2>
          <p className="text-muted text-lg mb-8">
            Let&apos;s work together to create a website that represents your
            brand and drives results.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-accent hover:bg-accent-dark text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Start Your Project
          </Link>
        </div>
      </section>
    </>
  );
}
