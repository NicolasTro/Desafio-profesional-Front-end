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

// Props opcionales: permitir controlar la apertura y cierre desde afuera
interface SlideMenuProps {
  isOpen?: boolean;
  onClose?: () => void;
}

// Componente que muestra un menú deslizante (drawer) y una versión fija en
// escritorio. Usa el contexto de la app para obtener info del usuario y
// acciones como `logout` y `toggleSlideMenu`.
export default function SlideMenu({ isOpen, onClose }: SlideMenuProps) {
  const router = useRouter();
  const { userInfo, slideMenuOpen, toggleSlideMenu, logout } = useAppContext();

  // isDesktop: detecta ancho de ventana para mostrar versión fija en escritorio
  const [isDesktop, setIsDesktop] = useState(false);
  // mounted: evita renderizar en SSR y hasta que tengamos medidas del cliente
  const [mounted, setMounted] = useState(false);


  useEffect(() => {
    function onResize() {
      setIsDesktop(window.innerWidth >= 768);
    }
    onResize();
    window.addEventListener("resize", onResize);
    // Indicamos que el componente ya se montó en cliente
    setMounted(true);
    return () => window.removeEventListener("resize", onResize);
  }, []);


  // No renderizamos hasta estar montados (evita discrepancias SSR/CSR)
  if (!mounted) return null;
  // Si no hay usuario o no tiene id, no mostrar el menú
  if (!userInfo || !userInfo.id) {
    return null;
  }

  // Determina si el drawer debe estar abierto: prioridad a la prop `isOpen`
  const drawerOpen = typeof isOpen === "boolean" ? isOpen : !!slideMenuOpen;
  // Handler de cierre: si pasan onClose lo usamos, si no usamos toggle del contexto
  const handleClose = onClose ?? (() => toggleSlideMenu?.());

  const first = userInfo?.name ?? "";
  const last = userInfo?.lastname ?? "";

  // Items del menú y mapeo a rutas. Mantener aquí facilita traducciones y cambios
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
    "Pagar Servicios": "/services",
    Tarjetas: "/personalCards",
    "Cerrar sesión": "/logout",
  };

  // Renderiza la lista de items. El item "Cerrar sesión" se maneja con
  // una acción en lugar de un Link porque debe ejecutar logout y luego redirigir.
  const renderItems = () => (
    <List>
      {items.map((text) => {
        const href =
          routeMap[text] ?? `/${text.toLowerCase().replace(/\s+/g, "-")}`;

        if (text === "Cerrar sesión") {
          return (
            <ListItem key={text} className={style["slide-content"]}
              onClick={async (e) => {
                e.preventDefault();
                // Ejecuta logout desde el contexto y redirige a la home
                await logout(() => router.push("/"));
                onClose?.();
              }}

            >
              <p>{text}</p>
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


    <div className={style["slide-container"]}>
      {/* Versión para escritorio: menú fijo con saludo y la lista */}
      {isDesktop && (
        <section className={style["slide-body"]}>
          <div
            className={style["slide-header"]}
            onClick={() => router.push("/home")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") router.push("/home");
            }}
          >
            <h2>
              Hola, <br /> {`${first} ${last}`.trim() || "Hola"}
            </h2>
          </div>
          <nav>{renderItems()}</nav>
        </section>
      )}

      {/* Drawer (versión móvil): usa MUI Drawer y un Box como contenedor */}
      <Drawer open={drawerOpen} onClose={handleClose} className={style["drawer-container"]}>
        <Box
          role="presentation"
          onClick={handleClose}
          onKeyDown={handleClose}
          className={`${style["drawer-body"]}`}
        >
          <div
            className={style["slide-header"]}
            onClick={(e) => {
              // Evitamos que el click en el header cierre el drawer por el
              // onClick del Box (por eso stopPropagation) y luego navegamos
              e.stopPropagation();
              handleClose();
              router.push("/home");
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === "Enter" || e.key === " ") {
                handleClose();
                router.push("/home");
              }
            }}
          >
            <h2>
              Hola, <br /> {`${first} ${last}`.trim() || "Hola"}
            </h2>
          </div>
          <div className={style["drawer-content"]}>

            {renderItems()}
          </div>
        </Box>
      </Drawer>
    </div>
  );
}
