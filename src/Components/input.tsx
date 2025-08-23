"use client"

import * as React from "react";
import Input from "@mui/joy/Input";
import style from "./input.module.css";

type InputProps = {
  id: string;
  border?: string;
  placeholder?: string;
  value?: string;
  type?: string;
  name?: string;
  onChange?: (value: string) => void;
  className?: string; 
};

export default function BasicInput({ id, placeholder, value, type = "text", name, onChange, className, border }: InputProps) {
  return (
    <Input
      id={id}
      placeholder={placeholder}
      value={value}
      type={type}
      name={name}
      onChange={(e) => onChange?.(e.target.value)}
      className={`${style.input} ${className || ""}`} 
      sx={{
        border: border
      }}
    />
  );
}
