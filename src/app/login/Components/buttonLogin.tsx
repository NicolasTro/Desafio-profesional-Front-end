"use client";

import Button from "@mui/joy/Button";
import styleButton from "./button.module.css";

type ButtonProps = {
  id?: string;
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
  id,
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
      id={id}
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
