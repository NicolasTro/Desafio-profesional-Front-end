"use client";
import Logo from "./Logo";
import Button from "./Button";
import style from "./Button.module.css";
import headerStyle from "./Header.module.css";
import { useRouter } from "next/navigation";


export default function Header() {
  const router = useRouter();
  const goToLogin = () => router.push("/login");
  return (
    <header className={headerStyle.header}>
      <div>
        <Logo onClick={() => router.push("/")} />
      </div>
      
      <div className={style.buttonGroup}>
        <Button className={style.button1} label="Ingresar" backgroundColor="var(--dark)" border="solid var(--lima) 1px" textColor="var(--lima)" onClick={goToLogin} />
        <Button className={style.button2} label="Crear cuenta" backgroundColor="var(--lima)" border="" textColor="black" />
      </div>
    </header>
  );
}
