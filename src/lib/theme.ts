export type ThemePreference = "system" | "light" | "dark";

const STORAGE_KEY = "coding-carranza-theme-v1";
const CHANGE_EVENT = "coding-carranza-theme-change";

// Run in the document head so a saved preference is applied before first paint.
export const themeInitializationScript = `(() => {
  let preference = "system";
  try {
    const saved = localStorage.getItem(${JSON.stringify(STORAGE_KEY)});
    if (saved === "light" || saved === "dark") preference = saved;
  } catch {}
  const dark = preference === "dark" || (preference === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  document.documentElement.dataset.themePreference = preference;
})();`;

function applyTheme(preference: ThemePreference) {
  const dark = preference === "dark" || (preference === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  document.documentElement.dataset.themePreference = preference;
}

export function setThemePreference(preference: ThemePreference) {
  try {
    if (preference === "system") window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, preference);
  } catch {
    // The control still works for this visit when browser storage is unavailable.
  }
  applyTheme(preference);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function getThemeSnapshot() {
  const root = document.documentElement;
  return `${root.dataset.themePreference ?? "system"}:${root.dataset.theme ?? "light"}`;
}

export function getServerThemeSnapshot() {
  return "system:light";
}

export function subscribeToTheme(onChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystemChange = () => {
    if (document.documentElement.dataset.themePreference === "system") {
      applyTheme("system");
      onChange();
    }
  };
  const onStorageChange = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    const preference = event.newValue === "light" || event.newValue === "dark" ? event.newValue : "system";
    applyTheme(preference);
    onChange();
  };

  media.addEventListener("change", onSystemChange);
  window.addEventListener("storage", onStorageChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    media.removeEventListener("change", onSystemChange);
    window.removeEventListener("storage", onStorageChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}
