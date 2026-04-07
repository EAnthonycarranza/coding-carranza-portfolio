import Image from "next/image";
import Link from "next/link";
import DarkLogo from "@/assets/Dark-Mode-Logo.png";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-16">
          <div className="max-w-xs space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 overflow-hidden rounded-lg">
                <Image
                  src={DarkLogo}
                  alt="Coding Carranza Logo"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                <span className="text-accent">&lt;</span>Coding Carranza
                <span className="text-accent"> /&gt;</span>
              </span>
            </Link>
            <p className="text-slate-500 leading-relaxed">
              Bridging the gap between complex technology and business growth 
              for small businesses and non-profits.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-12 w-full md:w-auto">
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 uppercase tracking-widest text-xs">Navigation</h4>
              <ul className="space-y-2">
                {["Home", "Projects", "About", "Contact"].map((item) => (
                  <li key={item}>
                    <Link 
                      href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                      className="text-slate-500 hover:text-accent transition-colors text-sm font-medium"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 uppercase tracking-widest text-xs">Status</h4>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                <span className="text-sm font-medium text-slate-600">Available Now</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 font-medium">
            &copy; {new Date().getFullYear()} Coding Carranza. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-slate-400 hover:text-slate-600 font-medium">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-slate-400 hover:text-slate-600 font-medium">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
