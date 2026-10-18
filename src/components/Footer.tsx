import Image from "next/image";
import Link from "next/link";
import DarkLogo from "@/assets/Dark-Mode-Logo.png";
import { ThemePreferenceSelect } from "./ThemeToggle";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-16">
          <div className="max-w-xs space-y-6">
            <Link href="/" className="flex items-center gap-3 group" aria-label="Coding Carranza home">
              <div className="relative w-10 h-10 overflow-hidden rounded-control bg-white">
                <Image
                  src={DarkLogo}
                  alt=""
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                <span className="text-accent" aria-hidden="true">&lt;</span>Coding Carranza
                <span className="text-accent" aria-hidden="true"> /&gt;</span>
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Bridging the gap between complex technology and business growth 
              for small businesses and non-profits.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Coding Carranza LLC<br />San Antonio, Texas</p>
          </div>
          
          <div className="grid grid-cols-2 gap-12 w-full md:w-auto">
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest text-xs">Navigation</h4>
              <ul className="space-y-2">
                {["Home", "Services", "Projects", "About", "Contact"].map((item) => (
                  <li key={item}>
                    <Link 
                      href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                      className="text-slate-500 dark:text-slate-400 hover:text-accent transition-colors text-sm font-medium"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest text-xs">Status</h4>
              <div className="flex items-center gap-2" role="status">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-pill bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-pill h-2 w-2 bg-accent"></span>
                </span>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Available Now</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 font-medium">
            &copy; {new Date().getFullYear()} Coding Carranza. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <ThemePreferenceSelect />
            <Link href="/privacy" className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
