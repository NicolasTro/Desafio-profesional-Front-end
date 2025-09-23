"use client";
import React from "react";
import { useRouter } from "next/navigation";
import SearchBar from "./SearchBar";

type Props = {
  className?: string;
  placeholder?: string;
  defaultValue?: string;
};

export default function ActivitySearchNavigator({ className, placeholder, defaultValue }: Props) {
  const router = useRouter();

  return (
    <SearchBar
      className={className}
      placeholder={placeholder || "Buscar en tu actividad"}
      defaultValue={defaultValue}
      onSearch={(q) => {
        const trimmed = (q || "").toString().trim();
        const url = trimmed ? `/activity?q=${encodeURIComponent(trimmed)}` : `/activity`;
        router.push(url);
      }}
    />
  );
}
