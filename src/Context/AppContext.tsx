"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

interface DecodedToken {
  id: string;
  email: string;
  exp: number;
  // optional account id that will be populated by calling /api/account
  account_id?: string;
}

// Define the shape of the context state
interface AppContextType {
  slideMenuOpen: boolean;
  toggleSlideMenu: () => void;
  token: string | null;
  userInfo: DecodedToken | null;
  refreshSession: () => void;
}

// Create the context with a default value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Create a provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [slideMenuOpen, setSlideMenuOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<DecodedToken | null>(null);

  const refreshSession = () => {
    (async () => {
      try {
        const res = await fetch('/api/session');
        const data = await res.json();
        if (data?.authenticated) {
          let u = data.userInfo || null;
          // Try to obtain account info once from server-side /api/account
          try {
            const accRes = await fetch('/api/account');
            if (accRes.ok) {
              const acc = await accRes.json();
              if (u) u = { ...u, account_id: acc?.account_id || acc?.id || acc?.accountId || null };
            }
          } catch (e) {
            console.debug('Failed to fetch /api/account in refreshSession', e);
          }
          setUserInfo(u);
          setToken(null);
        } else {
          setUserInfo(null);
          setToken(null);
        }
      } catch (err) {
        console.error('Failed to fetch session', err);
        setUserInfo(null);
        setToken(null);
      }
    })();
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const toggleSlideMenu = () => {
    setSlideMenuOpen(prev => !prev);
  };

  return (
    <AppContext.Provider
      value={{ slideMenuOpen, toggleSlideMenu, token, userInfo, refreshSession }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the AppContext
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
