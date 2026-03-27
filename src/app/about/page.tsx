import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About | Coding Carranza",
  description: "Learn about Anthony Carranza and Coding Carranza web development services.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-foreground text-background py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            About <span className="text-accent">Me</span>
          </h1>
          <p className="text-gray-400 text-lg">
            The person behind Coding Carranza
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-12 items-start">
            {/* Photo */}
            <div className="md:col-span-2">
              <div className="aspect-square relative rounded-2xl overflow-hidden border border-card-border shadow-lg">
                <Image
                  src="/images/anthony.png"
                  alt="Anthony Carranza"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Bio */}
            <div className="md:col-span-3 space-y-6">
              <h2 className="text-3xl font-bold">Anthony Carranza</h2>
              <p className="text-muted text-lg leading-relaxed">
                I&apos;m a web developer passionate about helping small
                businesses and organizations establish a strong online presence.
                I believe every business, no matter the size, deserves a
                professional, modern website that works as hard as they do.
              </p>
              <p className="text-muted leading-relaxed">
                At Coding Carranza, I specialize in building custom websites and
                web applications that are fast, responsive, and tailored to each
                client&apos;s unique needs. Whether you need a simple landing page,
                an e-commerce store, or a full-featured web application, I work
                closely with you to deliver results that exceed expectations.
              </p>
              <p className="text-muted leading-relaxed">
                I understand that small businesses operate on tight budgets and
                timelines. That&apos;s why I focus on delivering high-quality work
                efficiently, with clear communication every step of the way. My
                goal is to be a long-term partner for your business, not just a
                one-time vendor.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Work With Me
            </h2>
            <div className="grid sm:grid-cols-2 gap-8">
              {[
                {
                  title: "Small Business Focused",
                  desc: "I understand the challenges small businesses face and build solutions that fit your budget and goals.",
                },
                {
                  title: "Clear Communication",
                  desc: "No jargon, no surprises. I keep you informed throughout the entire process in plain language.",
                },
                {
                  title: "Modern Technology",
                  desc: "I use the latest web technologies to ensure your site is fast, secure, and built to last.",
                },
                {
                  title: "Reliable Support",
                  desc: "Your website doesn't stop needing attention after launch. I provide ongoing maintenance and support.",
                },
              ].map((value) => (
                <div
                  key={value.title}
                  className="bg-card-bg border border-card-border rounded-xl p-6"
                >
                  <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
