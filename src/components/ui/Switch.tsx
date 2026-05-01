"use client";

import { useId, type ReactNode } from "react";

interface SwitchProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
}

export default function Switch({ checked, onChange, label, description, icon, className = "" }: SwitchProps) {
  const id = useId();
  const descId = description ? `${id}-desc` : undefined;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={`${id}-label`}
      aria-describedby={descId}
      onClick={() => onChange(!checked)}
      className={[
        "w-full flex items-center justify-between p-5 rounded-card font-bold cursor-pointer",
        "transition-[background-color,color,box-shadow,transform] duration-300",
        "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]",
        checked
          ? "bg-slate-900 text-white shadow-xl hover:bg-slate-800 hover:shadow-2xl"
          : "bg-slate-50 text-slate-700 hover:bg-white hover:shadow-lg",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="flex items-center gap-3">
        {icon ? (
          <span
            aria-hidden="true"
            className={[
              "w-8 h-8 rounded-control flex items-center justify-center",
              checked ? "bg-white/10" : "bg-white",
            ].join(" ")}
          >
            {icon}
          </span>
        ) : null}
        <span className="flex flex-col items-start text-left">
          <span id={`${id}-label`}>{label}</span>
          {description ? (
            <span id={descId} className="text-xs font-medium opacity-70">
              {description}
            </span>
          ) : null}
        </span>
      </span>
      <span
        aria-hidden="true"
        className={[
          "w-10 h-5 rounded-pill relative transition-colors duration-300",
          checked ? "bg-accent" : "bg-slate-300",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-1 w-3 h-3 rounded-pill bg-white transition-[left,right] duration-300",
            checked ? "right-1" : "left-1",
          ].join(" ")}
        />
      </span>
    </button>
  );
}
