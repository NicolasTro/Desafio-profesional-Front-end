"use client";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Input from "@mui/joy/Input";
import { useState } from "react";

type SearchBarProps = {
  placeholder: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  onSearch?: (q: string) => void;
  defaultValue?: string;
};

export default function SearchBar(props: SearchBarProps) {
  const [value, setValue] = useState(String(props.defaultValue || ""));

  return (
      <Input
        className={props.className}
        placeholder={props.placeholder}
        value={value}
        onChange={(e) => {
          const v = String((e.target as HTMLInputElement).value);
          setValue(v);
          props.onSearch?.(v); // real-time
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            props.onSearch?.(value);
          }
        }}
        sx={{
          width: props.width || "100%",
          height: props.height || "64px",
          border: "solid var(--input--border--color) 1px",
          boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)",
        }}
        startDecorator={
          <i className="fas fa-search" style={{ color: "gray" }}></i>
        }
      />
  );
}
