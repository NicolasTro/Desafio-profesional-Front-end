"use client";
import Logo from "./Logo";
import Button from "./Button";
import style from "./Button.module.css";
import headerStyle from "./Header.module.css";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const routeClass = pathname === "/" ? headerStyle["route-home"] : headerStyle["route-default"];
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
      router.push("/login");
      router.refresh?.();
    }
  };

  return (
    <header className={`${headerStyle.header} ${routeClass}`}>
      <div>
        <Logo onClick={() => router.push("/")} />
      </div>

      <div className={style.buttonGroup}>
        {authenticated ? (
          <Button
            className={style.button1}
            label="Cerrar sesión"
            backgroundColor="var(--dark)"
            border="solid var(--lima) 1px"
            textColor="var(--lima)"
            onClick={doLogout}
          />
        ) : (
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
      </div>
    </header>
  );
}
