"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";



interface LogoProps {
  onClick?: () => void;
  style?: React.CSSProperties;
}

const Logo: React.FC<LogoProps> = ({ onClick, style }) => {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname==="/home";

  const src = isHome ? "/LogoMobile.png" : "/LogoMobileDark.png";
  return (
    <div
      onClick={onClick}
      style={style}
      className="cursor-pointer text-2xl font-bold"
    >
      <Image src={src} width={80} height={40} alt="Logo" priority />
    </div>
  );
};

export default Logo;
