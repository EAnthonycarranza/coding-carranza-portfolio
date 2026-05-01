import type { HTMLAttributes, ReactNode } from "react";

type Tone = "accent" | "neutral" | "success" | "warn" | "danger" | "fintech";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  size?: "xs" | "sm";
  children: ReactNode;
}

const TONE: Record<Tone, string> = {
  accent: "bg-accent-soft text-accent",
  neutral: "bg-slate-50 text-slate-500",
  success: "bg-accent-soft text-accent",
  warn: "bg-amber-50 text-amber-700",
  danger: "bg-danger-soft text-danger",
  fintech: "bg-accent-secondary-soft text-accent-secondary",
};

const SIZE = {
  xs: "text-xxs px-2 py-1 uppercase tracking-wider font-bold",
  sm: "text-xs px-3 py-1 font-bold",
};

export default function Badge({ tone = "accent", size = "xs", className = "", children, ...rest }: BadgeProps) {
  return (
    <span
      className={[TONE[tone], SIZE[size], "rounded-control inline-flex items-center", className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </span>
  );
}
