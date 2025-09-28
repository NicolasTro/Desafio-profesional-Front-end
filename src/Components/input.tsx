"use client";

import * as React from "react";
import Input from "@mui/joy/Input";
import style from "./input.module.css";

type InputProps = {
  id?: string;
  border?: string;
  error?: boolean;
  placeholder?: string;
  value?: string;
  type?: string;
  name?: string;
  onChange?: (value: string) => void;
  onKeyDown?: React.KeyboardEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
  className?: string;
};

export default function BasicInput({
  id,
  placeholder,
  value,
  type = "text",
  name,
  onChange,
  className,
  border,
  error,
  onKeyDown,
}: InputProps) {
  return (
    <Input
      id={id}
      placeholder={placeholder}
      value={value}
      type={type}
      name={name}
      onChange={(e) => onChange?.(e.target.value)}
      onKeyDown={onKeyDown}
      className={`${style.input} ${className || ""} ${error ? style.error : ""}`}
      sx={{
        border: border,
      }}
    />
  );
}
