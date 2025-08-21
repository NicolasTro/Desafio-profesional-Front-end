"use client";

import Button from "@mui/joy/Button";
import styleButton from "./button.module.css";

type ButtonProps = {
  fontWeight?: string;
  fontSize?: string;
  backgroundColor?: string;
  color?: string;
  className?: string;
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
};

export default function BasicButtons({
  fontSize,
  fontWeight,
  backgroundColor,
  color,
  className,
  onClick,
  label,
  disabled
}: ButtonProps) {
  return (
    <Button
      className={`${styleButton["button-size"]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      sx={{
        backgroundColor: backgroundColor || "var(--lima)",
        color: color || "black",
        fontSize: fontSize || "16px",
        fontWeight: fontWeight || "bold"
      }}
    >
      {label}
    </Button>
  );
}
