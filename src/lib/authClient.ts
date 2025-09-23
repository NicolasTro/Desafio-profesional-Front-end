// Estructura mínima del perfil cacheado
export interface CachedProfile {
  id: string;
  name?: string | null;
  lastname?: string | null;
  email?: string | null;
  phone?: string | null;
  exp?: number | null; // unix seconds
  fetchedAt: number;   // ms since epoch
}

const PROFILE_KEY = "dm_profile_v1";
const COOKIE_NAME = "dm_token";

// -------------------------
// Helpers de autenticación
// -------------------------

// ¿Existe cookie de auth en document.cookie?
export function hasAuthCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some((c) => c.trim().startsWith(`${COOKIE_NAME}=`));
}

// Obtener perfil cacheado desde sessionStorage
export function getCachedProfile(): CachedProfile | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = sessionStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as CachedProfile) : null;
  } catch {
    return null;
  }
}

// Guardar perfil en sessionStorage
export function setCachedProfile(profile: Omit<CachedProfile, "fetchedAt">) {
  try {
    if (typeof window === "undefined") return;
    const p: CachedProfile = { ...profile, fetchedAt: Date.now() };
    sessionStorage.setItem(PROFILE_KEY, JSON.stringify(p));
    // Notificar a otras pestañas
    localStorage.setItem("dm_profile_changed", String(Date.now()));
  } catch { }
}

// Borrar perfil del cache
export function clearCachedProfile() {
  try {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(PROFILE_KEY);
    localStorage.setItem("dm_profile_changed", String(Date.now()));
  } catch { }
}
