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
 

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { userInfo, toggleSlideMenu, isLoading } = useAppContext();
  const routeClass = pathname === "/" || pathname === "/home" || pathname === "/profile" || pathname === "/personalCards" || pathname === "/cardRegister" ? headerStyle["route-home"] : headerStyle["route-default"];
  // NOTE: do not treat root ("/") as an authenticated path; root should show public actions
  const authPaths = new Set(["/home", "/profile", "/personalCards", "/cardRegister"]);
  const isAuthRoute = authPaths.has(pathname || "");
  const [authenticated, setAuthenticated] = useState<boolean>(isAuthRoute);
  // user display name is taken from userInfo directly; no separate state needed
  const [userInitials, setUserInitials] = useState<string>('U');

  useEffect(() => {
    // Use either userInfo presence or the path to determine auth UI
  setAuthenticated(Boolean(userInfo) || isAuthRoute);
    const namePart = (userInfo?.name || '').trim();
    const lastPart = (userInfo?.lastname || '').trim();
    if (namePart && lastPart) {
      setUserInitials((namePart[0] + lastPart[0]).toUpperCase());
    } else if (namePart) {
      const parts = namePart.split(/\s+/).filter(Boolean);
      if (parts.length >= 2) setUserInitials((parts[0][0] + parts[1][0]).toUpperCase());
      else setUserInitials(parts[0][0].toUpperCase());
    } else {
      setUserInitials('U');
    }
  }, [userInfo, isLoading, isAuthRoute]);

  const goToLogin = () => router.push("/login");
  const goToRegister = () => router.push("/register");

  
  

  return (
    <header className={`${headerStyle.header} ${routeClass}`}>
      <div className={headerStyle.logo}>
        <Logo onClick={() => router.push("/")} />
      </div>

      <div className={headerStyle.actions} style={{ display: pathname === "/login" ? "none" : "flex" }}>
        {isLoading ? (
          <div style={{ minWidth: 200 }} />
        ) : authenticated ? (
            <div className={headerStyle.userArea}>
            <div className={headerStyle.nameWrapper}>
              <div
                className="w-8 h-8 flex items-center justify-center bg-gray-800 text-white rounded-full text-sm font-bold"
                title="Usuario Autenticado"
              >
                <NameTag className={styleTag.nameTag} name={userInitials} />
              </div>
              <div className={headerStyle.userName}>
                {userInfo?.name || userInfo?.email || ''}
              </div>
            </div>
            <div className={headerStyle.hamburgerWrapper}>
              <button
                className="flex flex-col space-y-1.5 focus:outline-none"
                aria-label="Abrir menú"
                onClick={() => toggleSlideMenu?.()}
              >
                <MenuHamb />
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
