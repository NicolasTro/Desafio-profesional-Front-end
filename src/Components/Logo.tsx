"use client";
import style from "./Header.module.css";
import Image from "next/image";

type LogoProps = {
  onClick: () => void;
};

export default function Logo({ onClick }: LogoProps) {
  return (
    <div className={style.logo} onClick={onClick}>
      <Image
        src="/LogoMobile.png"
        width={120}
        height={40}
        alt="My Website Logo"
        priority
      />
    </div>
  );
}
