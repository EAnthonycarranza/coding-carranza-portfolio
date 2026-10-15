export interface ServicePackage {
  slug: string;
  name: string;
  price: string;
  bestFor: string;
  timeline: string;
  revisions: number;
  features: string[];
  includedEmailPlan?: "Business Starter" | "Business Standard";
  includedMaintenanceSlug?: "basic" | "standard";
  highlighted?: boolean;
}

export const firstYearDomainFeature = "Domain for 1 year when priced under $50/year";

// Website packages and first-year benefits offered by Coding Carranza.
export const servicePackages: ServicePackage[] = [
  {
    slug: "starter",
    name: "Starter",
    price: "$300-$700",
    bestFor: "Local shops and services",
    timeline: "1-2 weeks",
    revisions: 2,
    features: [
      "Basic landing page",
      "Mobile-responsive design",
      "Branded form",
      "Basic SEO",
      "Hosting and domain setup",
    ],
  },
  {
    slug: "growth",
    name: "Growth",
    price: "$800-$1,800",
    bestFor: "Small businesses and e-commerce",
    timeline: "2-4 weeks",
    revisions: 3,
    includedEmailPlan: "Business Starter",
    includedMaintenanceSlug: "basic",
    features: [
      "Modern landing page",
      "1 included add-on",
      "SEO and analytics",
      "CMS section",
      "Essential CRM and order pipeline",
    ],
    highlighted: true,
  },
  {
    slug: "premium",
    name: "Premium",
    price: "$2,000-$5,000+",
    bestFor: "SaaS MVPs and marketplaces",
    timeline: "4-8 weeks",
    revisions: 4,
    includedEmailPlan: "Business Standard",
    includedMaintenanceSlug: "standard",
    features: [
      "Unlimited pages",
      "Advanced all-in-one CRM",
      "Authentication and roles dashboard",
      "2+ integrations",
      "Custom admin / CMS",
      "Advanced API integrations",
      "Lighthouse 90+ performance",
    ],
  },
];

export interface MaintenancePlan {
  slug: string;
  name: string;
  monthlyPrice: number;
  description: string;
  includedEditHours: number;
  features: string[];
}

export const maintenanceCoreFeatures = [
  "Hosting check-ins",
  "Uptime monitoring and alerts",
  "SSL certificate and domain-expiration checks",
  "Routine security and dependency updates",
  "Backups before updates",
  "Monthly health summary email",
];

// Maintenance services expanded with the owner's approved tier offerings.
export const maintenancePlans: MaintenancePlan[] = [
  {
    slug: "basic",
    name: "Basic",
    monthlyPrice: 50,
    description: "Protection for a simple business website.",
    includedEditHours: 0,
    features: [
      "Weekly backups of applicable site data and uploads",
      "Monthly contact-form functionality checks",
      "Regular email support",
    ],
  },
  {
    slug: "standard",
    name: "Standard",
    monthlyPrice: 75,
    description: "Business upkeep for a website with regular changes.",
    includedEditHours: 1,
    features: [
      "Daily backups of applicable site data and uploads",
      "Monthly checks of forms, order requests, and checkout integrations",
      "Quarterly performance review",
      "Content updates and small fixes within the included editing time",
      "Faster email response target during business hours",
    ],
  },
  {
    slug: "premium",
    name: "Premium",
    monthlyPrice: 150,
    description: "Ongoing improvement for a website that powers your business.",
    includedEditHours: 3,
    features: [
      "Daily backups of applicable site data and uploads",
      "Quarterly backup restore testing and performance reviews",
      "Monthly checks of forms, orders, checkout, and critical integrations",
      "Monthly analytics report with specific improvement recommendations",
      "One small agreed improvement each month, within the included time",
      "Priority support during business hours",
    ],
  },
];

export function getPackageFirstYearFeatures(service: ServicePackage): string[] {
  const maintenance = maintenancePlans.find((plan) => plan.slug === service.includedMaintenanceSlug);

  return [
    firstYearDomainFeature,
    ...(service.includedEmailPlan ? [`Google Workspace ${service.includedEmailPlan} for 1 year`] : []),
    ...(maintenance ? [`${maintenance.name} maintenance free for 1 year`] : []),
  ];
}

export const addOnDemos = [
  { name: "Payments and checkout", detail: "Square and Stripe checkout experiences", href: "/demo/payment" },
  { name: "Email workflows", detail: "Branded confirmations and business alerts", href: "/demo/email" },
  { name: "Customer messaging", detail: "SMS and WhatsApp communication", href: "/demo/messaging" },
  { name: "PDF documents", detail: "Branded invoices and document generation", href: "/demo/pdf" },
  { name: "Shipping integrations", detail: "Live rates and shipping workflows", href: "/demo/shipping" },
  { name: "Authentication", detail: "Account access, roles, and verification", href: "/demo/auth" },
];
