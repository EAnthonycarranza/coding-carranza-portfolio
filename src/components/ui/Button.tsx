import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "destructive" | "fintech";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  loadingLabel?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  fullWidth?: boolean;
}

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-accent text-white shadow-xl shadow-accent/20 hover:bg-accent-dark hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-accent/30 active:translate-y-0 active:scale-[0.98]",
  secondary:
    "bg-white text-slate-900 border border-slate-200 hover:-translate-y-0.5 hover:border-accent hover:text-accent hover:shadow-lg active:translate-y-0 active:scale-[0.98]",
  ghost:
    "bg-transparent text-slate-700 hover:bg-accent-soft hover:text-accent active:scale-[0.98]",
  destructive:
    "bg-danger text-white shadow-lg shadow-danger/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-danger/30 active:translate-y-0 active:scale-[0.98]",
  fintech:
    "bg-accent-secondary text-white shadow-xl shadow-accent-secondary/20 hover:bg-accent-secondary-dark hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-accent-secondary/30 active:translate-y-0 active:scale-[0.98]",
};

const SIZE: Record<Size, string> = {
  sm: "px-4 py-2 text-sm rounded-control",
  md: "px-6 py-3 text-sm rounded-control",
  lg: "px-10 py-5 text-base rounded-card",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    loadingLabel = "Working...",
    leadingIcon,
    trailingIcon,
    fullWidth = false,
    disabled,
    children,
    className = "",
    type = "button",
    ...rest
  },
  ref
) {
  const isDisabled = disabled || loading;
  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      data-loading={loading || undefined}
      className={[
        "inline-flex items-center justify-center gap-2 font-bold tracking-tight cursor-pointer select-none",
        "transition-[background-color,color,border-color,transform,box-shadow,filter] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
        VARIANT[variant],
        SIZE[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {loading ? (
        <>
          <Spinner />
          <span>{loadingLabel}</span>
        </>
      ) : (
        <>
          {leadingIcon ? <span aria-hidden="true">{leadingIcon}</span> : null}
          <span>{children}</span>
          {trailingIcon ? <span aria-hidden="true">{trailingIcon}</span> : null}
        </>
      )}
    </button>
  );
});

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 text-current"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export default Button;
