"use client";
import style from "./Header.module.css";
import Image from "next/image";
import { usePathname } from "next/navigation";

type LogoProps = {
  onClick: () => void;
};

export default function Logo({ onClick }: LogoProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  
  const src = isHome ? "/LogoMobile.png" : "/LogoMobileDark.png";
  return (
    <div className={style.logo} onClick={onClick}>
      <Image src={src} width={120} height={40} alt="Logo" priority />
    </div>
  );
}
