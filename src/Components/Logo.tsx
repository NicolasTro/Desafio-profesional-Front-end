"use client";
import style from './Header.module.css';

type LogoProps = {
  onClick: () => void;
};



export default function Logo({ onClick }: LogoProps) {
  return (
    <div className={style.logo} onClick={onClick}>
      <img src="/LogoMobile.png"  alt="My Website Logo" />
    </div>
  );
}