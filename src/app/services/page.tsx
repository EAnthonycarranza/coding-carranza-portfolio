import type { Metadata } from "next";
import Link from "next/link";
import { addOnDemos, getPackageFirstYearFeatures, maintenanceCoreFeatures, maintenancePlans, servicePackages } from "@/lib/services-data";

export const metadata: Metadata = {
  title: "Services & Pricing",
  description: "Compare website packages with a qualifying domain included for 1 year, plus first-year Google Workspace and maintenance with Growth and Premium. Coding Carranza LLC, San Antonio, Texas.",
  alternates: { canonical: "/services" },
};

const engagementSteps = [
  { title: "A clear contract", description: "One consistent agreement, with your package and add-ons defined in the scope." },
  { title: "Your base package", description: "Choose the foundation that fits your business, features, and timeline." },
  { title: "Optional add-ons", description: "Build on that foundation with extras you can explore in the live demos." },
  { title: "Optional monthly care", description: "Keep your site supported with monitoring, updates, and ongoing maintenance." },
];

function FeatureList({ features, className = "space-y-3" }: { features: string[]; className?: string }) {
  return (
    <ul className={className}>
      {features.map((feature) => (
        <li key={feature} className="flex items-start gap-3 text-sm leading-6 text-slate-600">
          <svg aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
          </svg>
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ServicesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-hero-bg pb-20 pt-36 text-white sm:pb-24 sm:pt-44">
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 h-[600px] w-[600px] rounded-full bg-accent/10 blur-[120px]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:px-8">
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">Coding Carranza LLC &middot; San Antonio, Texas</p>
            <h1 className="text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl">Clear packages.<br /><span className="text-gradient">Room to grow.</span></h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-slate-400">From your first landing page to a custom web platform, find a foundation that fits your business and build from there.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#packages" className="rounded-control bg-accent px-6 py-3.5 text-sm font-bold text-white hover:bg-accent-dark">Compare packages</a>
              <Link href="/demo" className="rounded-control border border-white/20 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/10">Try the live demos <span aria-hidden="true">&rarr;</span></Link>
            </div>
          </div>
          <div className="rounded-card-lg border border-white/10 bg-white/5 p-7 sm:p-8">
            <h2 className="text-sm font-semibold text-white">Your project, clearly structured.</h2>
            <ol className="mt-7 space-y-6">
              {engagementSteps.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-control bg-emerald-400/10 font-mono text-xs font-semibold text-emerald-400">0{index + 1}</span>
                  <div>
                    <h3 className="text-sm font-bold text-white">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-400">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="packages" aria-labelledby="packages-title" className="scroll-mt-24 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-emerald-700">Base packages</p>
            <h2 id="packages-title" className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Start with the right foundation.</h2>
            <p className="mt-5 leading-relaxed text-slate-500">Compare the scope, timeline, and features below. Your chosen package and any optional extras are set out in your contract.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {servicePackages.map((service) => (
              <article id={service.slug} key={service.slug} className={`flex scroll-mt-28 flex-col rounded-card-lg border p-6 sm:p-8 lg:p-6 xl:p-8 ${service.highlighted ? "border-emerald-300 bg-emerald-50/50 shadow-xl shadow-emerald-900/5" : "border-slate-200 bg-white"}`}>
                <div className="mb-7">
                  <h3 className="text-xl font-bold text-slate-900">{service.name}</h3>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">Best for: {service.bestFor}</p>
                  <p className="mt-5 whitespace-nowrap text-3xl font-bold tracking-tight text-slate-900">{service.price}</p>
                  <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                    <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5">{service.timeline}</span>
                    <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5">{service.revisions} revision rounds</span>
                  </div>
                </div>
                <div className="mb-6 border-t border-slate-200/70 pt-6"><FeatureList features={service.features} /></div>
                <div className="mb-8 rounded-control border border-emerald-100 bg-emerald-50/70 p-4">
                  <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-emerald-800">Included for your first year</h4>
                  <FeatureList features={getPackageFirstYearFeatures(service)} />
                </div>
                <Link href={`/contact?package=${service.slug}#project-inquiry`} className={`mt-auto rounded-control px-5 py-3.5 text-center text-sm font-bold ${service.highlighted ? "bg-accent text-white hover:bg-accent-dark" : "bg-slate-900 text-white hover:bg-slate-700"}`}>Discuss {service.name} <span aria-hidden="true">&rarr;</span></Link>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm leading-relaxed text-slate-500">Growth includes one add-on in the base package. Paid add-ons and ongoing maintenance are optional. <a href="#first-year-details" className="font-semibold text-emerald-700 underline underline-offset-4">See first-year coverage and renewal details.</a></p>
          <div id="first-year-details" className="mt-10 scroll-mt-28 rounded-card-lg border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-emerald-700">First-year coverage &amp; renewals</p>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">A supported start. Clear costs afterward.</h3>
            <div className="mt-7 grid gap-8 lg:grid-cols-3">
              <div>
                <h4 className="font-bold text-slate-900">Your domain</h4>
                <p className="mt-3 text-sm leading-6 text-slate-600">Every website package includes a domain for 1 year when its annual price is under $50. Starting in year two, you pay the annual domain renewal cost. Domains priced at $50/year or more are quoted separately.</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Your business email</h4>
                <p className="mt-3 text-sm leading-6 text-slate-600">Growth includes Google Workspace Business Starter for 1 year. Premium includes Business Standard for 1 year. Business email is a paid option with the Starter website package. After any included year, you pay the monthly cost of your email plan.</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">Upgrades beyond your included tier, such as Business Standard for Growth or Business Plus for any package, are paid by you. Email accounts and upgrade charges are agreed before setup. <a href="https://workspace.google.com/pricing.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-700 underline underline-offset-4">Compare Google Workspace plans<span className="sr-only"> (opens in a new tab)</span></a>.</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Your choice after launch</h4>
                <p className="mt-3 text-sm leading-6 text-slate-600">Growth includes Basic maintenance free for 1 year. Premium includes Standard maintenance free for 1 year. Afterward, you can choose to continue care at the listed monthly rate.</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">Maintenance is optional. If you opt out, you can simply pay annual domain renewal and any monthly email costs, without a maintenance subscription.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="add-ons" aria-labelledby="add-ons-title" className="scroll-mt-24 border-y border-slate-100 bg-slate-50 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-emerald-700">Modular add-ons</p>
              <h2 id="add-ons-title" className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">More possibilities. Only what you need.</h2>
              <p className="mt-5 leading-relaxed text-slate-500">Pro add-ons extend your base package. Explore working examples below, then we can scope the features that fit your business.</p>
            </div>
            <Link href="/demo" className="shrink-0 self-start text-sm font-bold text-emerald-700 hover:text-emerald-900 lg:self-auto">Explore all demos <span aria-hidden="true">&rarr;</span></Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {addOnDemos.map((demo, index) => (
              <Link key={demo.href} href={demo.href} className="group flex items-start gap-4 rounded-card border border-slate-200 bg-white p-6 transition-colors hover:border-emerald-300">
                <span aria-hidden="true" className="mt-0.5 font-mono text-xs text-emerald-700">0{index + 1}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900">{demo.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{demo.detail}</p>
                  <span className="mt-4 inline-block text-xs font-bold text-emerald-700">Try the demo <span aria-hidden="true">&rarr;</span></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="maintenance" aria-labelledby="maintenance-title" className="scroll-mt-24 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-emerald-700">Optional monthly maintenance</p>
            <h2 id="maintenance-title" className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Support beyond launch.</h2>
            <p className="mt-5 leading-relaxed text-slate-500">Choose protection for the essentials, help keeping your business website current, or ongoing improvements guided by analytics.</p>
          </div>
          <div className="mb-8 rounded-card border border-emerald-200 bg-emerald-50/70 p-6">
            <h3 className="text-sm font-bold text-emerald-900">A year of care with Growth and Premium</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Purchase Growth and get Basic maintenance free for 1 year, or purchase Premium and get Standard maintenance free for 1 year. The rates below apply when purchased separately or after your included year if you choose to continue.</p>
          </div>
          <div className="mb-8 rounded-card border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <h3 className="mb-5 text-sm font-bold text-slate-900">Included in every maintenance plan</h3>
            <FeatureList features={maintenanceCoreFeatures} className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3" />
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {maintenancePlans.map((plan) => {
              const includedWith = servicePackages.filter((service) => service.includedMaintenanceSlug === plan.slug);

              return (
                <article key={plan.slug} className="flex flex-col rounded-card-lg border border-slate-200 bg-white p-6 sm:p-8">
                  <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                  <p className="mt-3 min-h-12 text-sm leading-6 text-slate-500">{plan.description}</p>
                  <p className="mb-7 mt-4"><span className="text-4xl font-bold tracking-tight text-slate-900">${plan.monthlyPrice}</span><span className="ml-1 text-sm text-slate-500">/month</span></p>
                  {includedWith.length > 0 ? (
                    <p className="mb-5 rounded-control bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">Free for 1 year with the {includedWith.map((service) => service.name).join(" or ")} website package.</p>
                  ) : null}
                  <div className="mb-6 rounded-control bg-slate-50 px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Editing time</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {plan.includedEditHours === 0
                        ? "Content edits quoted separately"
                        : `Up to ${plan.includedEditHours} ${plan.includedEditHours === 1 ? "hour" : "total hours"} per month`}
                    </p>
                  </div>
                  <div className="mb-8 border-t border-slate-100 pt-6"><FeatureList features={plan.features} /></div>
                  <Link href={`/contact?maintenance=${plan.slug}#project-inquiry`} className="mt-auto rounded-control border border-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-900 hover:border-emerald-400 hover:bg-emerald-50">Ask about {plan.name} care <span aria-hidden="true">&rarr;</span></Link>
                </article>
              );
            })}
          </div>
          <div className="mt-8 grid gap-6 rounded-card border border-slate-200 bg-slate-50/60 p-6 sm:p-8 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">What the editing time covers</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">Included time covers content updates, small fixes, and agreed improvements. Common requests include business hours, menus, prices, photos, and promotions. Premium&apos;s monthly improvement uses its total editing allowance. Larger features and redesigns are quoted separately.</p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">A clear maintenance scope</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">Checks cover the features present on your website. We agree on backup coverage, covered integrations, business hours, and support response targets in your maintenance agreement. A response target covers the first reply; resolution time depends on the issue.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-100 bg-emerald-50/50 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-emerald-700">Let&apos;s find your fit</p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">You bring the idea. We&apos;ll map out the next step.</h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-slate-500">Not sure which package fits? Tell me about your business, your goals, and what you need your website to do.</p>
          <Link href="/contact" className="mt-8 inline-flex rounded-control bg-accent px-7 py-3.5 text-sm font-bold text-white hover:bg-accent-dark">Start a conversation <span aria-hidden="true" className="ml-2">&rarr;</span></Link>
          <p className="mt-6 text-sm text-slate-500">Or email <a href="mailto:anthony@codingcarranza.com" className="font-semibold text-emerald-700 underline underline-offset-4">anthony@codingcarranza.com</a></p>
        </div>
      </section>
    </>
  );
}
