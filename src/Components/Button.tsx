"use client";

type ButtonProps = {
  className?: string;
  label?: string;
  backgroundColor?: string;
  border?: string;
  textColor?: string;
  onClick?: () => void;
};

export default function Button({
  className,
  label,
  backgroundColor,
  border,
  textColor,
  onClick
}: ButtonProps) {
  return (
    <button
      className={className}
      style={{ backgroundColor, border, color: textColor }}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
