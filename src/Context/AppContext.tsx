"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getCachedProfile,
  setCachedProfile,
  clearCachedProfile,
  CachedProfile
} from "@/lib/authClient";
import { UserData, AccountData } from "@/lib/types";

// Definición de lo que expone el contexto de la app. Aquí están los datos
// del usuario, cuenta, estado de carga, y funciones para refrescar sesión
// y cerrar sesión. También controla el estado del slide menu.
interface AppContextType {
  user: UserData | null;
  userInfo: UserData | null;
  account: AccountData | null;
  exp: number | null;
  isLoading: boolean;
  isLoggingOut: boolean;
  refreshSession: () => Promise<void>;
  logout: (redirect?: () => void) => Promise<void>;
  slideMenuOpen: boolean;
  toggleSlideMenu: () => void;
  closeSlideMenu: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider que envuelve la app y mantiene el estado global de autenticación
// y UI global (ej. slide menu). Usa `useState` para almacenar user/account
// y `useEffect` para inicializar y sincronizar con otras pestañas.
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  // Inicializamos `user` leyendo el perfil cacheado (si existe) para evitar
  // flash de UI mientras se hace la primera llamada al servidor.
  const [user, setUser] = useState<UserData | null>(() => {
    const cached = getCachedProfile();
    if (cached) {
      return {
        id: cached.id,
        name: cached.name || null,
        lastname: cached.lastname || null,
        email: cached.email || null,
        phone: cached.phone || null,
        exp: cached.exp || null
      };
    }
    return null;
  });

  const [account, setAccount] = useState<AccountData | null>(null);
  const [exp, setExp] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  const [slideMenuOpen, setSlideMenuOpen] = useState(false);
  const toggleSlideMenu = () => setSlideMenuOpen(prev => !prev);
  const closeSlideMenu = () => setSlideMenuOpen(false);
  const router = useRouter();

  // Refresca la sesión (llamada a /api/session). Actualiza estados y
  // sincroniza el perfil en sessionStorage/localStorage para otras pestañas.
  const refreshSession = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/session");
            
      const data = await res.json();
            if (data.authenticated) {
        setUser(data.user || null);
        setAccount(data.account || null);
        setExp(data.exp || null);

        const cached: CachedProfile = {
          id: (data.user && data.user.id) || "",
          name: (data.user && data.user.name) || null,
          lastname: (data.user && data.user.lastname) || null,
          email: (data.user && data.user.email) || null,
          phone: (data.user && data.user.phone) || null,
          exp: data.exp || null,

          fetchedAt: Date.now()
        };
        // Guardamos el perfil cacheado y notificamos a otras pestañas
        setCachedProfile(cached);
      } else {
        // Si no está autenticado limpiamos el estado local y la caché
        setUser(null);
        setAccount(null);
        setExp(null);
        clearCachedProfile();
      }
    } catch (err) {
      // En caso de error tratamos como sesión no válida para mantener UI consistente
      console.error("Error al refrescar sesión:", err);
      setUser(null);
      setAccount(null);
      setExp(null);
      clearCachedProfile();
      setSlideMenuOpen(false); 
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cerrar sesión: llama a /api/logout y limpia estado local.
  // Muestra un alert usando sweetalert2 y redirige al login.
  const logout = async (redirect?: () => void) => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (err) {
      console.error("Error en logout:", err);
    } finally {
      try {
        if (typeof window !== "undefined") {
          sessionStorage.clear();
        }
      } catch {
        // ignore
      }

      setUser(null);
      setAccount(null);
      setExp(null);
      clearCachedProfile();
      setSlideMenuOpen(false);
      setIsLoggingOut(false);

      try {
        // Import dinámico para evitar cargar sweetalert2 en el bundle inicial
        if (typeof window !== "undefined") {
          const Swal = (await import("sweetalert2")).default;
          await Swal.fire({
            icon: "success",
            title: "Sesión cerrada",
            text: "Has cerrado sesión correctamente.",
            confirmButtonText: "Ir al login",
            customClass: { popup: "swal-popup", confirmButton: "swal-confirm" },
          });
        }
      } catch {
        // Si falla el modal, seguimos igualmente con la redirección
      }

      if (redirect) redirect();
      else router.push("/login");
    }
  };

  // Efecto inicial: intenta refrescar la sesión y registra un listener de
  // storage para sincronizar el perfil entre pestañas cuando `dm_profile_changed`
  // cambia (setCachedProfile/clearCachedProfile lo actualizan).
  useEffect(() => {
    void refreshSession();

    function onStorage(e: StorageEvent) {
      if (e.key === "dm_profile_changed") {
        const cached = getCachedProfile();
        if (cached) {
          setUser({
            id: cached.id,
            name: cached.name || null,
            lastname: cached.lastname || null,
            email: cached.email || null,
            phone: cached.phone || null,
            exp: cached.exp || null
          });
        } else {
          setUser(null);
        }
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Efecto que escucha un evento custom `session:expired` para forzar logout
  // (limpieza y redirección). Esto permite que otras partes de la app disparen
  // el evento para forzar el cierre de sesión en todas las pestañas.
  useEffect(() => {
    const onSessionExpired = () => {
      (async () => {
        try {
          if (typeof window !== "undefined") sessionStorage.clear();
        } catch {}
        setUser(null);
        setAccount(null);
        setExp(null);
        clearCachedProfile();
        setSlideMenuOpen(false);

        try {
          if (typeof window !== "undefined") {
            const Swal = (await import("sweetalert2")).default;
            await Swal.fire({
              icon: "warning",
              title: "Sesión expirada",
              text: "Tu sesión ha expirado. Serás redirigido al login.",
              confirmButtonText: "Ir al login",
              customClass: { popup: "swal-popup", confirmButton: "swal-confirm" },
            });
          }
        } catch {
          // ignore
        }

        try {
          router.push("/login");
        } catch {
          try {
            if (typeof window !== "undefined") window.location.href = "/login";
          } catch {}
        }
      })();
    };

    window.addEventListener("session:expired", onSessionExpired as EventListener);
    return () => window.removeEventListener("session:expired", onSessionExpired as EventListener);
  }, [router]);

  // Efecto que aplica clases CSS a <body> y <html> según si el usuario está
  // autenticado, útil para estilos globales condicionados por el estado auth.
useEffect(() => {
    const isAuth = !!user;

    document.body.classList.toggle("body-auth", isAuth);
    document.body.classList.toggle("body-guest", !isAuth);

    document.documentElement.classList.toggle("html-auth", isAuth);
    document.documentElement.classList.toggle("html-guest", !isAuth);
  }, [user]);



  return (
    <AppContext.Provider
      value={{
        user,
        userInfo: user,
        account,
        exp,
        isLoading,
        isLoggingOut,
        refreshSession,
        logout,
        slideMenuOpen,
        toggleSlideMenu,
        closeSlideMenu
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Hook para usar el contexto desde componentes. Lanza error si se usa fuera
// del provider para ayudar a detectar integraciones incorrectas.
export const useAppContext = (): AppContextType => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext debe usarse dentro de AppProvider");
  return ctx;
};
