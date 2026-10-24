// Cookie consent stored in localStorage. Bump CONSENT_VERSION when the cookie
// policy changes to ask everyone again.

const STORAGE_KEY = "tebotec-cookie-consent";
const CONSENT_VERSION = 1;
const CHANGE_EVENT = "cookie-consent-change";

export type ConsentStatus = "accepted" | "pending";

type StoredConsent = {
  version: number;
  acceptedAt: string;
};

// Fallback for when localStorage can't be written: remember for this page view.
let acceptedInMemory = false;

export function readConsent(): ConsentStatus {
  if (acceptedInMemory) return "accepted";
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return "pending";
    const stored = JSON.parse(raw) as Partial<StoredConsent>;
    return stored.version === CONSENT_VERSION ? "accepted" : "pending";
  } catch {
    // Storage blocked (e.g. some private modes) or corrupt data: ask again.
    return "pending";
  }
}

export function acceptConsent() {
  const value: StoredConsent = { version: CONSENT_VERSION, acceptedAt: new Date().toISOString() };
  acceptedInMemory = true;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Storage unavailable: the in-memory flag keeps the bar closed for this visit.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Notifies on changes from this tab and from other tabs (via the storage event). */
export function subscribeToConsent(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) onChange();
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}
