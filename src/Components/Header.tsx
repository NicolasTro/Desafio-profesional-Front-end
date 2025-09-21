"use client";
import Logo from "./Logo";
import Button from "./Button";
import style from "./Button.module.css";
import headerStyle from "./Header.module.css";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import NameTag from "./nameTag";
import MenuHamb from "../../public/menuHamb.svg";
import styleTag from "./nameTag.module.css";
import { useAppContext } from "@/Context/AppContext";
import { hasAuthCookie } from "@/lib/authClient";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { userInfo, toggleSlideMenu } =
    useAppContext();
  
  const [authenticated, setAuthenticated] = useState(false)
  




// const isRouteHome = (
//   pathname === "/" ||
//   pathname === "/home" ||
//   pathname === "/profile" ||
//   pathname === "/personalCards" ||
//   pathname === "/cardRegister" ||
//   pathname === "/deposit" ||
//   pathname === "/deposit/bankTransfer" ||
//   pathname === "/deposit/cardTransfer"
// );


const routeClass =  pathname !== "/login" && pathname !== "/register" ? headerStyle["route-home"] : headerStyle["route-default"];

  const computeInitialsFrom = (src: { name?: string | null; lastname?: string | null } | null | undefined) => {
    if (!src) return "U";
    const namePart = (src.name || "").trim();
    const lastPart = (src.lastname || "").trim();
    if (namePart && lastPart) return (namePart[0] + lastPart[0]).toUpperCase();
    if (namePart) {
      const parts = namePart.split(/\s+/).filter(Boolean);
      if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
      return parts[0][0].toUpperCase();
    }
    return "U";
  };



useEffect(() => {


const logiIn= localStorage.getItem("dm_is_login")
if (logiIn === "1") {
  setAuthenticated(true);
} else {
  setAuthenticated(false);
}






},[])

  // Use cached profile as single source for initials. Keep initials in sync when
  // `dm_profile_changed` is emitted via localStorage (other tabs or writes).

  useEffect(() => {
    // Keep `authenticated` in sync with cookie/profile changes.
    const update = () => {
      try {
        setAuthenticated(Boolean(hasAuthCookie() || userInfo));
      } catch (_e) {
        void _e;
        setAuthenticated(Boolean(userInfo));
      }
    };

    const onFocus = () => update();
    const onSessionExpired = () => update();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "dm_profile_changed") update();
      if (e.key === "dm_is_login_changed") update();
    };

    window.addEventListener("focus", onFocus);
    window.addEventListener("session:expired", onSessionExpired as EventListener);
    window.addEventListener("storage", onStorage);
    // run once to initialize
    update();

    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("session:expired", onSessionExpired as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, [userInfo]);

  const goToLogin = () => router.push("/login");
  const goToRegister = () => router.push("/register");

  

  return (
    <header className={`${headerStyle.header} ${routeClass}`}>
      <div className={headerStyle.logo}>
        <Logo onClick={() => router.push("/")} />
      </div>

      <div
        className={headerStyle.actions}
        style={{ display: pathname === "/login" ? "none" : "flex" }}
      >
        {authenticated ? (
          <div className={headerStyle.userArea}>
            <div className={headerStyle.nameWrapper}>
              <div
                className="w-8 h-8 flex items-center justify-center bg-gray-800 text-white rounded-full text-sm font-bold"
                title="Usuario Autenticado"
              >
                <NameTag className={styleTag.nameTag} name={computeInitialsFrom(userInfo)} />
              </div>
              <div className={headerStyle.userName}>
                {userInfo?.name || userInfo?.email || ""}
              </div>
            </div>
            <div className={headerStyle.hamburgerWrapper}>
              <button
                className="flex flex-col space-y-1.5 focus:outline-none"
                aria-label="Abrir menú"
                onClick={() => toggleSlideMenu?.()}
              >
                <MenuHamb fontSize="35" />
              </button>
            </div>
          </div>
        ) : (
          <div className={headerStyle.authButtons}>
            {pathname !== "/register" && (
              <>
                <Button
                  className={style.button1}
                  label="Ingresar"
                  backgroundColor="var(--dark)"
                  border="solid var(--lima) 1px"
                  textColor="var(--lima)"
                  onClick={goToLogin}
                />

                <Button
                  className={style.button2}
                  label="Crear cuenta"
                  backgroundColor="var(--lima)"
                  border=""
                  textColor="black"
                  onClick={goToRegister}
                />
              </>
            )}
            {pathname === "/register" && (
              <Button
                className={`${style.button1} flex justify-center items-center`}
                height="31px"
                width="122px"
                label="Iniciar sesión"
                backgroundColor="#3B3A3F"
                border="solid var(--lima) 1px"
                textColor="white"
                onClick={goToLogin}
              />
            )}
          </div>
        )}
      </div>
      
    </header>
  );
}
