import Link from 'next/link';

export default function DemoIndexPage() {
  const demos = [
    {
      title: "Payment Processing",
      description: "Dual-provider checkout with Square & Stripe — embedded forms, hosted sessions, and automated receipt emails.",
      href: "/demo/payment",
      icon: (
        <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
        </svg>
      )
    },
    {
      title: "Shipping Rates (Shippo)",
      description: "Real-time logistics integration fetching live shipping quotes from global carriers using the Shippo API.",
      href: "/demo/shipping",
      icon: (
        <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
        </svg>
      )
    },
    {
      title: "Omnichannel Messaging",
      description: "Automated SMS and WhatsApp communication flows demonstrating real-time customer engagement with Twilio.",
      href: "/demo/messaging",
      icon: (
        <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
        </svg>
      )
    },
    {
      title: "Custom Email Workflows",
      description: "Direct SMTP integration bypassing subscription services. Instantly generate branded HTML confirmations and internal alerts.",
      href: "/demo/email",
      icon: (
        <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>
      )
    },
    {
      title: "Dynamic PDF Invoicing",
      description: "Automated document generation for small businesses. Instantly create professional, branded PDF invoices from real-time data.",
      href: "/demo/pdf",
      icon: (
        <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      )
    },
    {
      title: "Authentication & Security",
      description: "Multi-role login, 2FA verification, password reset flows, and live HTML email previews — all running locally.",
      href: "/demo/auth",
      icon: (
        <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
        </svg>
      )
    }
  ];

  return (
    <main className="min-h-screen bg-hero-bg text-white selection:bg-accent/30 pt-32 pb-20">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Demo <span className="text-gradient">Components</span>
          </h1>
          <p className="text-xl text-slate-400">
            Interactive explorations and live feature demonstrations for high-performance web applications.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {demos.map((demo) => (
            <Link
              key={demo.href}
              href={demo.href}
              className="group relative bg-slate-900/80 backdrop-blur-sm p-8 rounded-card-lg border border-white/10 hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-1 cursor-pointer transition-[border-color,box-shadow,transform] duration-300 flex flex-col h-full overflow-hidden"
            >
              <div aria-hidden="true" className="absolute -top-20 -right-20 w-40 h-40 bg-accent/10 blur-3xl rounded-pill opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative mb-6 p-4 bg-accent/10 rounded-card w-fit ring-1 ring-accent/20 group-hover:scale-110 group-hover:bg-accent/20 group-hover:rotate-3 transition-[background-color,transform] duration-300">
                {demo.icon}
              </div>
              <h2 className="relative text-2xl font-black mb-3 text-white group-hover:text-accent transition-colors">
                {demo.title}
              </h2>
              <p className="relative text-slate-400 mb-8 flex-grow font-medium leading-relaxed">
                {demo.description}
              </p>
              <div className="relative flex items-center gap-2 text-accent font-semibold text-sm">
                View Demo
                <svg aria-hidden="true" className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
