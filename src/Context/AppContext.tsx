"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getCachedProfile,
  setCachedProfile,
  clearCachedProfile,
  CachedProfile,
  hasAuthCookie,
} from "@/lib/authClient";

// Interfaz para el token decodificado, que contiene información del usuario
interface DecodedToken {
  id: string;
  user_id?: string;
  sub?: string;
  email: string;
  exp: number;
  account_id?: string;
  cvu?: string | null;
  alias?: string | null;
  available_amount?: number | null;
  phone?: string | null;
  name?: string | null;
  lastname?: string | null;
}

// Interfaz para el tipo de contexto de la aplicación
interface AppContextType {
  slideMenuOpen: boolean;
  toggleSlideMenu: () => void;
  token: string | null;
  userInfo: DecodedToken | null;
  isLoading: boolean;
  refreshSession: () => Promise<void>;
}

// Creación del contexto de la aplicación
const AppContext = createContext<AppContextType | undefined>(undefined);

// Proveedor del contexto de la aplicación
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [slideMenuOpen, setSlideMenuOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<DecodedToken | null>(() => {
    // hydrate from sessionStorage for immediate UI render
    try {
      const cached = getCachedProfile();
      if (!cached) return null;
      return {
        id: cached.id,
        email: cached.email ?? "",
        exp: cached.exp ?? 0,
        name: cached.name ?? null,
        lastname: cached.lastname ?? null,
        phone: cached.phone ?? null,
      } as DecodedToken;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshSession = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/session");
      const data = await response.json();
      if (data?.authenticated) {
        let u = data.userInfo || null;
        try {
          const accountResponse = await fetch("/api/account");
          if (accountResponse.ok) {
            const acc = await accountResponse.json();
            if (u) {
              u = {
                ...u,
                account_id:
                  acc?.account_id ||
                  acc?.id ||
                  acc?.accountId ||
                  u.account_id ||
                  null,
                cvu: acc?.cvu ?? acc?.account?.cvu ?? u.cvu ?? null,
                alias: acc?.alias ?? acc?.account?.alias ?? u.alias ?? null,
                available_amount: (acc?.available_amount ??
                  acc?.balance ??
                  null) as number | null,
              };
            }
            try {
              const meResponse = await fetch("/api/me");
              if (meResponse.ok) {
                const me = await meResponse.json();
                if (me && u) {
                  const prev = u as Partial<DecodedToken> | null;
                  u = {
                    ...(prev ?? {}),
                    name: me.name ?? prev?.name ?? null,
                    lastname: me.lastname ?? prev?.lastname ?? null,
                    email: me.email ?? prev?.email ?? null,
                    phone: me.phone ?? prev?.phone ?? null,
                  } as DecodedToken;
                }
              }
            } catch (e) {
              console.debug("Error al obtener /api/me en refreshSession", e);
            }
          }
        } catch (e) {
          console.debug("Error al obtener /api/account en refreshSession", e);
        }
        setUserInfo(u);
        setToken(null);
        // cache minimal profile client-side for faster subsequent renders
        try {
          if (u) {
            const up = u as Partial<DecodedToken>;
            const cached: CachedProfile = {
              id: (up.id ?? up.user_id ?? up.sub ?? "") as string,
              name: up.name ?? null,
              lastname: up.lastname ?? null,
              email: up.email ?? null,
              phone: up.phone ?? null,
              exp: up.exp ?? null,
              fetchedAt: Date.now(),
            };
            setCachedProfile(cached);
          }
        } catch (err) {
          console.debug("Could not cache profile", err);
        }
      } else {
        setUserInfo(null);
        setToken(null);
        // ensure the slide menu (drawer/aside) is closed when session ends
        setSlideMenuOpen(false);
        try {
          if (typeof window !== "undefined") {
            clearCachedProfile();
            try {
              const { clearIsLogin } = await import("@/lib/authClient");
              clearIsLogin();
            } catch {
              // ignore
            }
            window.dispatchEvent(new CustomEvent("session:expired"));
          }
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.error("Error al obtener la sesión", err);
      setUserInfo(null);
      setToken(null);
      // close slide menu on error/failed refresh to avoid stale UI
      setSlideMenuOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refreshSession();
    // keep profile in sync across tabs: when another tab updates profile we should re-hydrate
    function onStorage(e: StorageEvent) {
      if (e.key === "dm_profile_changed") {
        const cached = getCachedProfile();
        if (cached) {
          setUserInfo({
            id: cached.id,
            email: cached.email ?? "",
            exp: cached.exp ?? 0,
            name: cached.name ?? null,
            lastname: cached.lastname ?? null,
            phone: cached.phone ?? null,
          } as DecodedToken);
        } else {
          setUserInfo(null);
        }
      }
      if (e.key === null && typeof window !== "undefined") {
        if (!hasAuthCookie()) void refreshSession();
      }
    }

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      if (userInfo) {
        const up = userInfo as Partial<DecodedToken>;
        const cached: CachedProfile = {
          id: (up.id ?? up.user_id ?? up.sub ?? "") as string,
          name: up.name ?? null,
          lastname: up.lastname ?? null,
          email: up.email ?? null,
          phone: up.phone ?? null,
          exp: up.exp ?? null,
          fetchedAt: Date.now(),
        };
        setCachedProfile(cached);
      } else {
        clearCachedProfile();
      }
    } catch (err) {
      console.debug("Error syncing cached profile from AppContext", err);
    }
  }, [userInfo]);

  const toggleSlideMenu = () => setSlideMenuOpen((prev) => !prev);

  return (
    <AppContext.Provider
      value={{
        slideMenuOpen,
        toggleSlideMenu,
        token,
        userInfo,
        isLoading,
        refreshSession,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext debe usarse dentro de un AppProvider");
  return context;
};
