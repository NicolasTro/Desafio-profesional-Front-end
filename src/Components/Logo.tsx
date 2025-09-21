"use client";
import { usePathname } from "next/navigation";
import LogoSvg from "../../public/LogoMobileSVG.svg";
import styleLogo from "./Header.module.css";

interface LogoProps {
  onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ onClick }) => {
  const pathname = usePathname();
  const isAuth = pathname === "/login" || pathname === "/register";

  return (
    <LogoSvg
      className={`${styleLogo.logo}  ${!isAuth ? styleLogo["green-log"] : styleLogo["dark-logo"]}`}
      onClick={onClick}
    />
  );
};

export default Logo;
