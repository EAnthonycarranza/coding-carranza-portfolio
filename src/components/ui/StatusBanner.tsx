import type { ReactNode } from "react";

type Tone = "success" | "error" | "info" | "warn";

interface StatusBannerProps {
  tone: Tone;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

const TONE: Record<Tone, { wrap: string; live: "polite" | "assertive" }> = {
  success: {
    wrap: "bg-accent-soft border border-accent/20 text-accent",
    live: "polite",
  },
  error: {
    wrap: "bg-danger-soft border border-danger/20 text-danger",
    live: "assertive",
  },
  info: {
    wrap: "bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200",
    live: "polite",
  },
  warn: {
    wrap: "bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300",
    live: "polite",
  },
};

export default function StatusBanner({ tone, children, icon, className = "" }: StatusBannerProps) {
  const t = TONE[tone];
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      aria-live={t.live}
      className={[
        "rounded-card p-4 text-center font-bold flex items-center justify-center gap-2",
        t.wrap,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {icon ? <span aria-hidden="true">{icon}</span> : null}
      <span>{children}</span>
    </div>
  );
}
