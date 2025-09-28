"use client";
import { useAppContext } from "@/Context/AppContext";
import { usePathname, useRouter } from "next/navigation";
import type { ReactElement } from "react";
import MenuHamb from "../../public/menuHamb.svg";
import Button from "./Button";
import style from "./Button.module.css";
import headerStyle from "./Header.module.css";
import Logo from "./Logo";
import NameTag from "./nameTag";
import styleTag from "./nameTag.module.css";

export default function Header(): ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const { userInfo, toggleSlideMenu } = useAppContext();

  const authenticated = Boolean(userInfo);

  const routeClass =
    pathname !== "/login" && pathname !== "/register"
      ? headerStyle["route-home"]
      : headerStyle["route-default"];

  const getInitials = (
    name?: string | null,
    lastname?: string | null
  ): string => {
    const safeName = (name || "").trim();
    const safeLast = (lastname || "").trim();

    if (safeName && safeLast) {
      return `${safeName[0]}${safeLast[0]}`.toUpperCase();
    }
    if (safeName) {
      return safeName[0].toUpperCase();
    }
    if (safeLast) {
      return safeLast[0].toUpperCase();
    }
    return "U";
  };

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
          <div className={headerStyle.nameWrapper} onClick={() => router.push("/home")}>
            <div
              className="w-8 h-8 flex items-center justify-center bg-gray-800 text-white rounded-full text-sm font-bold"
              title="Usuario Autenticado"
            >
              <NameTag
                className={styleTag.nameTag}
                nameTag={getInitials(userInfo?.name, userInfo?.lastname)}
              />
            </div>
            <div className={headerStyle.userName} > 
              {userInfo
                ? `Hola, ${
                    [userInfo.name, userInfo.lastname]
                      .filter(Boolean)
                      .join(" ") || userInfo.email || ""
                  }`
                : ""}
            </div>
          </div>
          <div className={headerStyle.hamburgerWrapper}>
            <button
              className="flex flex-col space-y-1.5 focus:outline-none"
              aria-label="Abrir menú"
              onClick={() => toggleSlideMenu()}
            >
              <MenuHamb fontSize="35" />
            </button>
          </div>
        </div>
      ) : (
        <div className={headerStyle.authButtons}>
          {pathname !== "/register" ? (
            <div className="flex items-center gap-4">
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
            </div>
          ) : (
            <Button
              className={`${style.button1} flex justify-center items-center`}
              height="40px"
              width="133px"
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
