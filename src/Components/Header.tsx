"use client";
import Logo from "./Logo";
import Button from "./Button";
import style from "./Button.module.css";
import headerStyle from "./Header.module.css";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import NameTag from "./nameTag";
import styleTag from "./nameTag.module.css";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const routeClass = pathname === "/" || pathname === "/home" ? headerStyle["route-home"] : headerStyle["route-default"];
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        const res = await fetch("/api/session", { cache: "no-store" });
        const data = await res.json();
        if (!cancelled) setAuthenticated(Boolean(data?.authenticated));
      } catch {
        if (!cancelled) setAuthenticated(false);
      }
    };
    check();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const goToLogin = () => router.push("/login");
  const goToRegister = () => router.push("/register");
  const doLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } finally {
      setAuthenticated(false);
      router.push("/");
      router.refresh?.();
    }
  };

  // Change the logo color to --lima when authenticated
  return (
    <header className={`${headerStyle.header} ${routeClass}`}>
      <div>
        <Logo
          onClick={() => router.push("/")}

          // style={{ color: authenticated ? "var(--dark)" : "inherit" }}
        />
      </div>

      <div className={style.buttonGroup} style={{ display: pathname === "/login" ? "none" : "flex" }}>
        {authenticated ? (
          <div className="flex items-center gap-4">
            {/* User initials */}
            <div
              className="w-8 h-8 flex items-center justify-center bg-gray-800 text-white rounded-full text-sm font-bold"
              title="Usuario Autenticado"
            >
              <NameTag className={styleTag.nameTag} name="AB" />
            </div>

            
            <div className="md:hidden">
              <button
                className="flex flex-col space-y-1.5 focus:outline-none"
                aria-label="Abrir menú"
              >
                <Image src="/menuHamb.png" width={34} height={34} alt="Menu" />
              </button>
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </header>
  );
}
