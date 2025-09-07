"use client"
import { useEffect, useState } from "react";
import { useAppContext } from "@/Context/AppContext";
import { useUser } from "@/hooks/useUser";
import Box from "@mui/joy/Box";
import Drawer from "@mui/joy/Drawer";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import Link from "next/link";
import style from "./SlideMenu.module.css";
import { useRouter } from "next/navigation";

interface SlideMenuProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function SlideMenu({ isOpen, onClose }: SlideMenuProps) {
  const router = useRouter();
  // prevent Drawer (which may mutate body / document during mount) from
  // rendering during SSR. Render it only after client mount to avoid
  // hydration attribute mismatches.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  // combine user data from context and remote /me
  const { userInfo, refreshSession, slideMenuOpen, toggleSlideMenu } = useAppContext();
  const { data: meData } = useUser();
  const first = (meData as { name?: string })?.name ?? userInfo?.name ?? '';
  const last = (meData as { lastname?: string })?.lastname ?? userInfo?.lastname ?? '';

  if (!mounted) return null;

  // if parent didn't provide isOpen/onClose, use context
  const drawerOpen = typeof isOpen === 'boolean' ? isOpen : !!slideMenuOpen;
  const handleClose = onClose ?? (() => toggleSlideMenu?.());

  const items = [
    "Inicio",
    "Actividad",
    "Tu perfil",
    "Cargar dinero",
    "Pagar Servicios",
    "Tarjetas",
    "Cerrar sesión",
  ];

  const routeMap: Record<string, string> = {
    "Inicio": "/home",
    "Actividad": "/activity",
    "Tu perfil": "/profile",
    "Cargar dinero": "/deposit",
    "Pagar Servicios": "/pay-services",
    "Tarjetas": "/personalCards",
    "Cerrar sesión": "/logout",
  };

  return (
    <>
      <aside className={style["slide-body"]} aria-hidden={false}>
        <div className={style["slide-header"]}>
          <h2>Hola,  <br /> {`${first} ${last}`.trim() || 'Hola'}</h2>
        </div>
        <nav>
          <List>
            {items.map(text => {
              const href = routeMap[text] ?? `/${text.toLowerCase().replace(/\s+/g, "-")}`;
              if (text === "Cerrar sesión") {
                return (
                  <ListItem key={text} className={style["slide-content"]}>
                    <button onClick={async (e) => {
                      e.preventDefault();
                      try {
                        await fetch('/api/logout', { method: 'POST', cache: 'no-store' });
                        void refreshSession();
                        router.push('/');
                      } catch {
                        void refreshSession();
                        router.push('/');
                      }
                    }}>
                      <p>{text}</p>
                    </button>
                  </ListItem>
                );
              }
              return (
                <ListItem key={text} className={style["slide-content"]}>
                  <Link href={href}>
                    <p>{text}</p>
                  </Link>
                </ListItem>
              );
            })}
          </List>
        </nav>
      </aside>

      {/* Mobile Drawer */}
      <Drawer open={drawerOpen} onClose={handleClose} >
        <Box role="presentation" onClick={handleClose} onKeyDown={handleClose} className={style["drawer-body"]}>
          <div className={style["slide-header"]}>
            <h2>Hola,  <br /> {`${first} ${last}`.trim() || 'Hola'}</h2>
          </div>
          <List >
            {items.map(text => {
              const href = routeMap[text] ?? `/${text.toLowerCase().replace(/\s+/g, "-")}`;

              if (text === "Cerrar sesión") {
                return (
                  <ListItem key={text} className={style["slide-content"]}>
                    <button onClick={async (e) => {
                      e.preventDefault();
                      // attempt server logout
                      try {
                        await fetch('/api/logout', { method: 'POST', cache: 'no-store' });
                        // refresh client session state regardless of response
                        void refreshSession();
                        // navigate to landing
                        router.push('/');
                      } catch {
                        // on network error still refresh and redirect
                        void refreshSession();
                        router.push('/');
                      } finally {
                        onClose?.();
                      }
                    }}>
                      <p>{text}</p>
                    </button>
                  </ListItem>
                );
              }

              return (
                <ListItem key={text} className={style["slide-content"]}>
                  <Link href={href}>
                    <p>{text}</p>
                  </Link>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
