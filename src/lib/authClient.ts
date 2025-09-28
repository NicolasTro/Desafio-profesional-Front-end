// Interfaz que representa el perfil en caché del usuario. 
// Se usa para almacenar datos básicos que puedan necesitarse sin consultar
// el servidor en cada render (por ejemplo para mostrar el nombre en el header).
export interface CachedProfile {
  id: string;
  // Campos opcionales que pueden ser nulos si no están disponibles
  name?: string | null;
  lastname?: string | null;
  email?: string | null;
  phone?: string | null;
  // 'exp' puede representar la expiración del token/profile si se usa
  exp?: number | null; 
  // Marca de tiempo local (ms) cuando se almacenó/actualizó el perfil en caché
  fetchedAt: number;   
}

// Clave usada en sessionStorage para guardar el perfil
const PROFILE_KEY = "dm_profile_v1";
// Nombre de la cookie de autenticación usada por la aplicación
const COOKIE_NAME = "dm_token";


// Devuelve true si existe la cookie de autenticación en el documento.
// Comprueba que `document` esté disponible para evitar errores en SSR.
export function hasAuthCookie(): boolean {
  if (typeof document === "undefined") return false;
  // Separa las cookies por ';' y busca la que empieza con COOKIE_NAME=
  return document.cookie.split(";").some((c) => c.trim().startsWith(`${COOKIE_NAME}=`));
}


// Recupera el perfil guardado en sessionStorage. Retorna null si no existe
// o si ocurre cualquier error (por ejemplo JSON mal formado). Protegemos
// contra ejecución en entornos sin `window` (SSR).
export function getCachedProfile(): CachedProfile | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = sessionStorage.getItem(PROFILE_KEY);
    // Si hay datos, parsearlos como JSON y retornarlos con el tipo adecuado
    return raw ? (JSON.parse(raw) as CachedProfile) : null;
  } catch {
    // En caso de error (p. ej. JSON.parse falla), devolvemos null silenciosamente
    return null;
  }
}


// Guarda el perfil en caché. Se espera un objeto sin 'fetchedAt' porque
// esta función añade la marca temporal local. Además notifica a otras
// pestañas/ventanas mediante una entrada en localStorage para que puedan
// refrescar su estado si detectan el cambio.
export function setCachedProfile(profile: Omit<CachedProfile, "fetchedAt">) {
  try {
    if (typeof window === "undefined") return;
    const p: CachedProfile = { ...profile, fetchedAt: Date.now() };
    // Guardar en sessionStorage permite que los datos vivan mientras dure la pestaña
    sessionStorage.setItem(PROFILE_KEY, JSON.stringify(p));
    // Notificar a otras pestañas: actualizar una clave en localStorage dispara el evento "storage"
    localStorage.setItem("dm_profile_changed", String(Date.now()));
  } catch { 
    // Silenciosamente ignoramos fallos de storage (por ejemplo en modo privado)
  }
}


// Elimina el perfil en caché de la pestaña actual y notifica a otras pestañas
// que el perfil cambió. Protege contra entornos sin `window` y captura errores
// de storage para evitar romper la aplicación.
export function clearCachedProfile() {
  try {
    if (typeof window === "undefined") return;
    try {
      // Remover la clave específica y limpiar sessionStorage local
      sessionStorage.removeItem(PROFILE_KEY);
      sessionStorage.clear();
    } catch {}

    try {
      // Notificar a otras pestañas que el perfil ha cambiado (posible logout)
      localStorage.setItem("dm_profile_changed", String(Date.now()));
    } catch {}
  } catch { }
}
