"use client";
import { useAppContext } from "@/Context/AppContext";
import Box from "@mui/joy/Box";
import Drawer from "@mui/joy/Drawer";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import style from "./SlideMenu.module.css";

interface SlideMenuProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function SlideMenu({ isOpen, onClose }: SlideMenuProps) {
  const router = useRouter();
  const { userInfo, slideMenuOpen, toggleSlideMenu, logout } = useAppContext();

  const [isDesktop, setIsDesktop] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    function onResize() {
      setIsDesktop(window.innerWidth >= 768);
    }
    onResize();
    window.addEventListener("resize", onResize);
    setMounted(true);
    return () => window.removeEventListener("resize", onResize);
  }, []);


  if (!mounted) return null;
  if (!userInfo || !userInfo.id) {
    return null;
  }

  const drawerOpen = typeof isOpen === "boolean" ? isOpen : !!slideMenuOpen;
  const handleClose = onClose ?? (() => toggleSlideMenu?.());

  const first = userInfo?.name ?? "";
  const last = userInfo?.lastname ?? "";

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
    Inicio: "/home",
    Actividad: "/activity",
    "Tu perfil": "/profile",
    "Cargar dinero": "/deposit",
    "Pagar Servicios": "/pay-services",
    Tarjetas: "/personalCards",
    "Cerrar sesión": "/logout",
  };

  const renderItems = () => (
    <List>
      {items.map((text) => {
        const href =
          routeMap[text] ?? `/${text.toLowerCase().replace(/\s+/g, "-")}`;

        if (text === "Cerrar sesión") {
          return (
            <ListItem key={text} className={style["slide-content"]}>
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  await logout(() => router.push("/"));
                  onClose?.();
                }}
              >
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
  );

  return (
    <div className="slide-content">
      {isDesktop && (
        <aside className={`${style["slide-body"]} `} aria-hidden={false}>
          <div className={style["slide-header"]}>
            <h2>
              Hola, <br /> {`${first} ${last}`.trim() || "Hola"}
            </h2>
          </div>
          <nav>{renderItems()}</nav>
        </aside>
      )}

      <Drawer open={drawerOpen} onClose={handleClose}>
        <Box
          role="presentation"
          onClick={handleClose}
          onKeyDown={handleClose}
          className={`${style["drawer-body"]}`}
        >
          <div className={style["slide-header"]}>
            <h2>
              Hola, <br /> {`${first} ${last}`.trim() || "Hola"}
            </h2>
          </div>
          {renderItems()}
        </Box>
      </Drawer>
    </div>
  );
}
