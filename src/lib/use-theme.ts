"use client";

import { useSyncExternalStore } from "react";
import { getServerThemeSnapshot, getThemeSnapshot, subscribeToTheme, type ThemePreference } from "./theme";

export function useTheme() {
  const snapshot = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot);
  const [preference, resolved] = snapshot.split(":");
  return { preference: preference as ThemePreference, dark: resolved === "dark" };
}
