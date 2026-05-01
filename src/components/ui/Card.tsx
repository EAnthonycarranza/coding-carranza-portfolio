import type { HTMLAttributes, ReactNode } from "react";

type Variant = "solid" | "glass" | "outline" | "deep";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  as?: "div" | "section" | "article";
  interactive?: boolean;
  children: ReactNode;
}

const VARIANT: Record<Variant, string> = {
  solid: "bg-white border border-slate-100 shadow-sm",
  glass: "bg-card-bg border border-card-border backdrop-blur-xl shadow-xl",
  outline: "bg-transparent border border-slate-200",
  deep: "bg-surface-deep text-white border border-white/10 shadow-2xl",
};

const SIZE = {
  sm: "p-4 rounded-card",
  md: "p-6 rounded-card",
  lg: "p-8 rounded-card-lg",
};

const INTERACTIVE =
  "cursor-pointer transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-accent/10 hover:border-accent/30";

export default function Card({
  variant = "solid",
  size = "md",
  as: Tag = "div",
  interactive = false,
  className = "",
  children,
  ...rest
}: CardProps) {
  return (
    <Tag
      className={[
        VARIANT[variant],
        SIZE[size],
        interactive ? INTERACTIVE : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </Tag>
  );
}
