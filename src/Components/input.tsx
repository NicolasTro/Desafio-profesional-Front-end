"use client"

import * as React from "react";
import Input from "@mui/joy/Input";
import style from "./input.module.css";

type InputProps = {
  placeholder?: string;
  value?: string;
  type?: string;
  name?: string;
  onChange?: (value: string) => void;
  className?: string; // Added className prop for dynamic styling
};

export default function BasicInput({ placeholder, value, type = "text", name, onChange, className }: InputProps) {
  return (
    <Input
      placeholder={placeholder}
      value={value}
      type={type}
      name={name}
      onChange={(e) => onChange?.(e.target.value)}
      className={`${style.input} ${className || ""}`} // Combine existing and dynamic classes
    />
  );
}
