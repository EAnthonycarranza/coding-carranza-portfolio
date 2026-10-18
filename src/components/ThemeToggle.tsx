"use client";

import { useSyncExternalStore } from "react";
import { getServerThemeSnapshot, getThemeSnapshot, setThemePreference, subscribeToTheme, type ThemePreference } from "@/lib/theme";

function useTheme() {
  const snapshot = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot);
  const [preference, resolved] = snapshot.split(":");
  return { preference: preference as ThemePreference, dark: resolved === "dark" };
}

export default function ThemeToggle() {
  const { dark } = useTheme();

  return (
    <button
      type="button"
      role="switch"
      aria-label="Dark mode"
      aria-checked={dark}
      title={`Switch to ${dark ? "light" : "dark"} mode`}
      onClick={() => setThemePreference(dark ? "light" : "dark")}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-control border border-card-border bg-card-bg text-foreground hover:bg-accent-soft hover:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <svg aria-hidden="true" className="h-5 w-5 dark:hidden" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />
      </svg>
      <svg aria-hidden="true" className="hidden h-5 w-5 dark:block" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="4" />
        <path strokeLinecap="round" d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}

export function ThemePreferenceSelect() {
  const { preference } = useTheme();

  return (
    <label className="flex items-center gap-3 text-xs font-medium text-muted">
      Appearance
      <select
        aria-label="Color theme"
        value={preference}
        onChange={(event) => setThemePreference(event.target.value as ThemePreference)}
        className="rounded-control border border-card-border bg-background px-3 py-2 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-accent"
      >
        <option value="system">System default</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  );
}
