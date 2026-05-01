"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import DarkLogo from "@/assets/Dark-Mode-Logo.png";
import Badge from "./ui/Badge";

type NavLink = {
  href: string;
  label: string;
  icon: React.ReactNode;
  featured?: boolean;
};

const ICON_PROPS = {
  className: "w-5 h-5 shrink-0",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  viewBox: "0 0 24 24",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const links: NavLink[] = [
  {
    href: "/",
    label: "Home",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M3 11.5 12 4l9 7.5" />
        <path d="M5 10v10h14V10" />
      </svg>
    ),
  },
  {
    href: "/projects",
    label: "Projects",
    icon: (
      <svg {...ICON_PROPS}>
        <rect x="3" y="4" width="7" height="7" rx="1.5" />
        <rect x="14" y="4" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/about",
    label: "About",
    icon: (
      <svg {...ICON_PROPS}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
      </svg>
    ),
  },
  {
    href: "/contact",
    label: "Contact",
    icon: (
      <svg {...ICON_PROPS}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),
  },
  {
    href: "/demo",
    label: "Demo Components",
    featured: true,
    icon: (
      <svg {...ICON_PROPS}>
        <path d="m8 8-5 4 5 4" />
        <path d="m16 8 5 4-5 4" />
        <path d="m14 4-4 16" />
      </svg>
    ),
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [menuOpen]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const desktopLinkClass = (href: string) => {
    if (pathname === href) return "text-accent bg-accent-soft";
    return "text-slate-600";
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-[padding] duration-300 glass shadow-sm ${
          scrolled ? "py-2" : "py-4"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 group" aria-label="Coding Carranza home">
              <div className="relative w-10 h-10 overflow-hidden rounded-control transition-transform group-hover:scale-110">
                <Image
                  src={DarkLogo}
                  alt=""
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <span className="text-xl font-bold tracking-tight transition-colors text-foreground">
                <span className="text-accent" aria-hidden="true">&lt;</span>Coding Carranza
                <span className="text-accent" aria-hidden="true"> /&gt;</span>
              </span>
            </Link>

            <div className="hidden md:flex space-x-1" role="navigation" aria-label="Primary">
              {links.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`px-4 py-2 text-sm font-medium rounded-pill transition-[background-color,color,transform] duration-300 hover:bg-accent-soft hover:text-accent hover:-translate-y-0.5 ${desktopLinkClass(link.href)}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <button
              type="button"
              className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-control text-foreground hover:bg-accent-soft transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
              <span className="relative w-5 h-5 block">
                <span
                  className={`absolute left-0 top-1 h-0.5 w-5 bg-current rounded-full transition-transform duration-300 ${
                    menuOpen ? "translate-y-1.5 rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-2.5 h-0.5 w-5 bg-current rounded-full transition-opacity duration-200 ${
                    menuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 top-4 h-0.5 w-5 bg-current rounded-full transition-transform duration-300 ${
                    menuOpen ? "-translate-y-1.5 -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`md:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <div
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />

        <div
          className={`absolute left-3 right-3 top-20 rounded-card-lg border border-card-border bg-card-bg shadow-2xl backdrop-blur-xl overflow-hidden transition-[transform,opacity] duration-300 ease-out ${
            menuOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
        >
          <nav className="p-3 flex flex-col gap-1.5" aria-label="Mobile">
            {links.map((link, i) => {
              const isActive = pathname === link.href;
              const isFeatured = link.featured;

              const baseClass =
                "group relative flex items-center gap-3 px-4 py-3.5 rounded-card transition-[background-color,color,transform] duration-200";

              const stateClass = isActive
                ? "bg-accent text-white shadow-md shadow-accent/30"
                : isFeatured
                  ? "bg-accent-soft text-foreground hover:bg-accent/10 ring-1 ring-accent/20"
                  : "text-slate-700 hover:bg-slate-100/80 hover:text-foreground";

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`${baseClass} ${stateClass}`}
                  style={{
                    transitionDelay: menuOpen ? `${i * 30}ms` : "0ms",
                  }}
                >
                  <span
                    aria-hidden="true"
                    className={`flex items-center justify-center w-9 h-9 rounded-control transition-colors ${
                      isActive
                        ? "bg-white/20 text-white"
                        : isFeatured
                          ? "bg-accent/15 text-accent"
                          : "bg-slate-100 text-slate-500 group-hover:bg-accent-soft group-hover:text-accent"
                    }`}
                  >
                    {link.icon}
                  </span>

                  <span className="flex-1 text-base font-semibold tracking-tight">
                    {link.label}
                  </span>

                  {isFeatured && !isActive && (
                    <Badge tone="accent" size="xs" className="bg-accent text-white">
                      New
                    </Badge>
                  )}

                  <svg
                    aria-hidden="true"
                    className={`w-4 h-4 transition-transform ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-accent group-hover:translate-x-0.5"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 6 6 6-6 6" />
                  </svg>
                </Link>
              );
            })}
          </nav>

          <div className="px-5 py-4 border-t border-card-border bg-slate-50/50">
            <p className="text-xs text-muted text-center">
              <span className="text-accent" aria-hidden="true">&lt;</span>
              <span className="font-semibold"> Coding Carranza </span>
              <span className="text-accent" aria-hidden="true">/&gt;</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
