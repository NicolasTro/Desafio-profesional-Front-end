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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
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
        setCachedProfile(cached);
      } else {
        setUser(null);
        setAccount(null);
        setExp(null);
        clearCachedProfile();
      }
    } catch (err) {
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

  // 🚪 logout
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
      }

      if (redirect) redirect();
      else router.push("/login");
    }
  };

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

export const useAppContext = (): AppContextType => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext debe usarse dentro de AppProvider");
  return ctx;
};
