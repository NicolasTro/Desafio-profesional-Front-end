"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

// Interfaz para el token decodificado, que contiene información del usuario
interface DecodedToken {
  id: string;
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
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estado para controlar si el menú deslizante está abierto
  const [slideMenuOpen, setSlideMenuOpen] = useState(false);
  // Estado para almacenar el token de autenticación
  const [token, setToken] = useState<string | null>(null);
  // Estado para almacenar la información del usuario decodificada
  const [userInfo, setUserInfo] = useState<DecodedToken | null>(null);
  // Estado para indicar si se está cargando la sesión
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Función para refrescar la sesión del usuario
  const refreshSession = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/session');
      const data = await response.json();
      if (data?.authenticated) {
        let u = data.userInfo || null;
        try {
          const accountResponse = await fetch('/api/account');
          if (accountResponse.ok) {
            const acc = await accountResponse.json();
            if (u)
              u = {
                ...u,
                account_id: acc?.account_id || acc?.id || acc?.accountId || u.account_id || null,
                cvu: acc?.cvu ?? acc?.account?.cvu ?? u.cvu ?? null,
                alias: acc?.alias ?? acc?.account?.alias ?? u.alias ?? null,
                available_amount: (acc?.available_amount ?? acc?.balance ?? null) as number | null,
              };
            try {
              const meResponse = await fetch('/api/me');
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
              console.debug('Error al obtener /api/me en refreshSession', e);
            }
          }
        } catch (e) {
          console.debug('Error al obtener /api/account en refreshSession', e);
        }
        setUserInfo(u);
        setToken(null);
      } else {
        setUserInfo(null);
        setToken(null);
      }
    } catch (err) {
      console.error('Error al obtener la sesión', err);
      setUserInfo(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Efecto para refrescar la sesión al montar el componente
  useEffect(() => {
    void refreshSession();
  }, []);

  // Función para alternar el estado del menú deslizante
  const toggleSlideMenu = () => {
    setSlideMenuOpen(prev => !prev);
  };

  // Proporcionar el contexto a los componentes hijos
  return (
    <AppContext.Provider value={{ slideMenuOpen, toggleSlideMenu, token, userInfo, isLoading, refreshSession }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook personalizado para usar el contexto de la aplicación
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext debe usarse dentro de un AppProvider");
  }
  return context;
};
