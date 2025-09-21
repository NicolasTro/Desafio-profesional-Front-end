"use client";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import React, { useState } from "react";

type SearchBarProps = {
  placeholder: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  // called when user presses Enter with the current input value
  onSearch?: (q: string) => void;
  // optional initial value
  defaultValue?: string;
};

export default function SearchBar(props: SearchBarProps) {
  const [value, setValue] = useState(String(props.defaultValue || ""));

  return (
    <Stack spacing={1.5}>
      <Input
        className={props.className}
        placeholder={props.placeholder}
        value={value}
        onChange={(e) => setValue(String((e.target as HTMLInputElement).value))}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            props.onSearch?.(value);
          }
        }}
        sx={{
          width: props.width || "100%",
          height: props.height || "64px",
        }}
        startDecorator={
          <i className="fas fa-search" style={{ color: "gray" }}></i>
        }
      />
    </Stack>
  );
}
