export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Coding Carranza. All rights
            reserved.
          </p>
          <p className="text-sm text-gray-400">
            Empowering small businesses with professional web solutions.
          </p>
        </div>
      </div>
    </footer>
  );
}
