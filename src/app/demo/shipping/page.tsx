import ShippingEstimator from '@/components/ShippingEstimator';
import Link from 'next/link';

export default function ShippingDemoPage() {
  return (
    <main className="min-h-screen bg-hero-bg text-white selection:bg-accent/30 pb-20">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-28 lg:pt-32 pb-20 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          
          {/* Content Section */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium">
              Logistics & Fulfillment
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              One-Click <span className="text-gradient">Fulfillment</span>.
            </h1>
            
            <p className="text-xl text-slate-400 max-w-lg">
              Complete the order lifecycle. This demo showcases how to transition from real-time rate estimation to instant label generation and tracking.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <span>Instant Sandbox Label Generation</span>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <span>Automated Tracking & PDF Preview</span>
              </div>
            </div>

            <div className="pt-4">
              <Link href="/demo" className="text-slate-400 hover:text-white flex items-center gap-2 group transition-colors">
                <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Back to Demos
              </Link>
            </div>
          </div>

          {/* Estimator Section */}
          <div>
            <ShippingEstimator />
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-sm p-10 rounded-card-lg border border-white/10 shadow-2xl">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-white">
              <span className="p-2 bg-accent/15 rounded-control ring-1 ring-accent/20" aria-hidden="true">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                </svg>
              </span>
              Integration Ecosystem
            </h2>

            <div className="grid md:grid-cols-2 gap-12 mt-10">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-accent">Square Terminal API</h3>
                <p className="text-slate-300 leading-relaxed">
                  In a physical retail setting, you can use the <strong className="text-white">Square Terminal API</strong> to trigger this flow. When a customer pays at the counter, a webhook from Square can automatically notify your fulfillment system to:
                </p>
                <ul className="space-y-2 text-sm text-slate-300 list-disc pl-5 marker:text-accent/60">
                  <li>Verify the payment status via <code className="text-accent">terminal.checkout.get</code></li>
                  <li>Calculate final shipping weight and select a carrier via Shippo</li>
                  <li>Purchase and print the label to a connected thermal printer</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-accent-secondary">Automated Webhooks</h3>
                <p className="text-slate-300 leading-relaxed">
                  Bridge the gap between hardware and logistics. By listening to <code className="text-accent-secondary">checkout.completed</code> events, you can create a zero-touch fulfillment pipeline that updates your database and notifies the customer in real-time.
                </p>
                <pre className="p-4 bg-black/40 rounded-control border border-white/10 font-mono text-xxs text-accent-secondary leading-relaxed overflow-x-auto"><code>{`// Example Terminal Hook
if (event.type === 'terminal.checkout.completed') {
  await purchaseShippoLabel(orderData);
}`}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
