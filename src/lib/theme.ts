// Light/dark theme stored in localStorage; light is the default. The theme is
// applied as `data-theme` on <html>, which globals.css uses to switch tokens.

export type Theme = "light" | "dark";

export const DEFAULT_THEME: Theme = "light";
const STORAGE_KEY = "tebotec-theme";
const CHANGE_EVENT = "theme-change";

/**
 * Runs in <head> before the first paint so a saved dark theme never flashes
 * light. Kept tiny and dependency-free because it's inlined into every page.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(STORAGE_KEY)});if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export function readTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

export function setTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage unavailable: the theme still applies for this page view.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Notifies on changes from this tab and from other tabs. */
export function subscribeToTheme(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    const theme = event.newValue === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    onChange();
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}
