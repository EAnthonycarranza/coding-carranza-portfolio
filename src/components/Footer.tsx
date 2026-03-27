import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-10 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="Coding Carranza Logo"
              width={36}
              height={36}
              className="rounded"
            />
            <span className="text-sm font-semibold">
              <span className="text-accent">&lt;</span>Coding Carranza
              <span className="text-accent"> /&gt;</span>
            </span>
          </Link>
          <p className="text-sm text-gray-400 text-center">
            Empowering small businesses with professional web solutions.
          </p>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Coding Carranza. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
