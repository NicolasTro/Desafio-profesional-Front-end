// Client-side auth helpers
// - hasAuthCookie(): quick check for presence of dm_token in document.cookie
// - getCachedProfile()/setCachedProfile()/clearCachedProfile(): store a minimal profile in sessionStorage

export interface CachedProfile {
  id: string;
  name?: string | null;
  lastname?: string | null;
  email?: string | null;
  phone?: string | null;
  exp?: number | null; // unix seconds
  fetchedAt: number; // ms since epoch
}

const PROFILE_KEY = "dm_profile_v1";
const COOKIE_NAME = "dm_token";

export function hasAuthCookie(): boolean {
  try {
    if (typeof document === "undefined") return false;
    return document.cookie.split(";").some((c) => c.trim().startsWith(`${COOKIE_NAME}=`));
  } catch {
    return false;
  }
}

export function getCachedProfile(): CachedProfile | null {
  try {
    if (typeof window === "undefined" || !window.sessionStorage) return null;
    const raw = sessionStorage.getItem(PROFILE_KEY);
    if (raw) return JSON.parse(raw) as CachedProfile;
    // fallback to localStorage if sessionStorage doesn't have it (some flows may persist there)
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const rawLocal = localStorage.getItem(PROFILE_KEY);
        if (rawLocal) return JSON.parse(rawLocal) as CachedProfile;
      }
    } catch {
      // ignore localStorage access errors
    }
    return null;
  } catch (err) {
    // best-effort: don't crash the app if storage is inaccessible or corrupted
    console.debug("Error reading cached profile", err);
    return null;
  }
}

export function setCachedProfile(profile: Omit<CachedProfile, "fetchedAt"> | CachedProfile) {
  try {
    if (typeof window === "undefined" || !window.sessionStorage) return;
    type NoFetched = Omit<CachedProfile, "fetchedAt">;
    const base = profile as NoFetched;
    const p: CachedProfile = { ...(base as NoFetched), fetchedAt: Date.now() };
    sessionStorage.setItem(PROFILE_KEY, JSON.stringify(p));
    // notify other tabs
    try {
      localStorage.setItem("dm_profile_changed", String(Date.now()));
    } catch {
      // ignore
    }
  } catch (err) {
    console.debug("Error writing cached profile", err);
  }
}

export function clearCachedProfile() {
  try {
    if (typeof window === "undefined" || !window.sessionStorage) return;
    sessionStorage.removeItem(PROFILE_KEY);
    try {
      localStorage.setItem("dm_profile_changed", String(Date.now()));
    } catch {
      // ignore
    }
  } catch (e) {
    console.debug("Error clearing cached profile", e);
  }
}
// end

// Theme helpers (sessionStorage)
const THEME_KEY = "dm_theme";
export type ThemeType = "dark" | "light" | string;
export function getSavedTheme(): ThemeType | null {
  try {
    if (typeof window === "undefined" || !window.sessionStorage) return null;
    return (sessionStorage.getItem(THEME_KEY) as ThemeType) || null;
  } catch {
    return null;
  }
}

export function setSavedTheme(theme: ThemeType) {
  try {
    if (typeof window === "undefined" || !window.sessionStorage) return;
    sessionStorage.setItem(THEME_KEY, theme);
  } catch {
    // ignore
  }
}

// isLogin helpers: stored in localStorage so the flag survives reloads and is shared
// across tabs. We still write a separate changed key to guarantee storage events
// fire with a value that changes.
const IS_LOGIN_KEY = "dm_is_login";
const IS_LOGIN_CHANGED = "dm_is_login_changed";

export function setIsLogin(value: boolean) {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    localStorage.setItem(IS_LOGIN_KEY, value ? "1" : "0");
    try {
      localStorage.setItem(IS_LOGIN_CHANGED, String(Date.now()));
    } catch {
      // ignore
    }
  } catch {
    // ignore
  }
}

export function clearIsLogin() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    localStorage.removeItem(IS_LOGIN_KEY);
    try {
      localStorage.setItem(IS_LOGIN_CHANGED, String(Date.now()));
    } catch {
      // ignore
    }
  } catch {
    // ignore
  }
}

export function getIsLogin(): boolean {
  try {
    if (typeof window === "undefined" || !window.localStorage) return false;
    const v = localStorage.getItem(IS_LOGIN_KEY);
    return v === "1";
  } catch {
    return false;
  }
}
