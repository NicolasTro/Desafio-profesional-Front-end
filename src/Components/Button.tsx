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
  disabled?: boolean;
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
  disabled,
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
      disabled={disabled}
    >
      {label}
    </button>
  );
}
