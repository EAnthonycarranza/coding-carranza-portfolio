import Link from "next/link";
import { getPackageFirstYearFeatures, maintenancePlans, servicePackages } from "@/lib/services-data";

export default function ServicesPreview() {
  return (
    <section aria-labelledby="packages-preview-title" className="bg-hero-bg py-24 text-white sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-emerald-400">Services &amp; Pricing</p>
            <h2 id="packages-preview-title" className="scroll-mt-28 text-3xl font-bold tracking-tight sm:text-4xl">A clear starting point for your next chapter.</h2>
            <p className="mt-5 leading-relaxed text-slate-400">Choose a package, add the features you need, and keep growing with optional monthly support.</p>
          </div>
          <Link href="/services" className="inline-flex shrink-0 items-center gap-2 self-start rounded-control bg-white dark:bg-slate-900 px-5 py-3 text-sm font-bold text-slate-900 dark:text-slate-100 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 lg:self-auto">
            Explore services &amp; pricing <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {servicePackages.map((service) => (
            <Link key={service.slug} href={`/services#${service.slug}`} className={`group flex flex-col rounded-card border p-6 transition-colors hover:border-emerald-400 ${service.highlighted ? "border-emerald-400/40 bg-emerald-400/10" : "border-white/10 bg-white/5"}`}>
              <h3 className="text-lg font-semibold text-white">{service.name}</h3>
              <p className="mt-4 whitespace-nowrap text-2xl font-bold tracking-tight text-white md:text-xl lg:text-2xl">{service.price}</p>
              <p className="mt-2 min-h-10 text-sm text-slate-400">{service.bestFor}</p>
              <p className="mb-2 mt-5 text-xs font-bold uppercase tracking-wider text-emerald-400">Included for 1 year</p>
              <ul className="mb-6 space-y-2 text-sm leading-6 text-slate-300">
                {getPackageFirstYearFeatures(service).map((feature) => (
                  <li key={feature} className="flex items-start gap-2"><span aria-hidden="true" className="text-emerald-400">✓</span><span>{feature}</span></li>
                ))}
              </ul>
              <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs font-semibold text-slate-300">
                <span className="whitespace-nowrap">{service.timeline}</span>
                <span className="text-emerald-400">View package <span aria-hidden="true">&rarr;</span></span>
              </div>
            </Link>
          ))}
        </div>
        <p className="mt-6 text-sm leading-relaxed text-slate-400">Domain renewals are paid yearly after the included first year. Business email is optional and paid monthly, with 1 year included for Growth and Premium. Maintenance is optional, with paid plans from ${maintenancePlans[0].monthlyPrice}/month. <Link href="/services#first-year-details" className="font-semibold text-emerald-400 hover:text-emerald-300">See coverage and renewal details <span aria-hidden="true">&rarr;</span></Link></p>
      </div>
    </section>
  );
}
