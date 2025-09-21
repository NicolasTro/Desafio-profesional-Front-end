"use client";

type ButtonProps = {
  height?: string;
  width?: string;
  className?: string;
  label?: string;
  backgroundColor?: string;
  border?: string;
  textColor?: string;
  onClick?: () => void;
};

export default function Button({
  className,
  height,
  width,
  label,
  backgroundColor,
  border,
  textColor,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={className}
      style={{
        backgroundColor: backgroundColor,
        border: border,
        color: textColor,
        height: height,
        width: width,
      }}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
