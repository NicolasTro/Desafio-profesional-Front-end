"use client";
import React from "react";

type InputCardProps = {
  data: {
    type: string;
    inputMode:
      | "search"
      | "email"
      | "tel"
      | "text"
      | "url"
      | "none"
      | "numeric"
      | "decimal"
      | undefined;
    name: string;
    placeholder1: string;
    placeholder2?: string;
    autoComplete: string;
    value: string;
    className: string;

    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleInputFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
  };
};
export default function InputCard(data: InputCardProps) {
  const {
    type,
    inputMode,
    name,
    placeholder1,
    placeholder2,
    autoComplete,
    value,
    className,
    handleInputChange,
    handleInputFocus
  } = data.data;
  return (
    <input
      type={type}
      inputMode={inputMode}
      name={name}
      placeholder={`${placeholder1} ${placeholder2}`}
      autoComplete={autoComplete}
      value={value}
      onChange={handleInputChange}
      onFocus={handleInputFocus}
      className={className}
    />
  );
}
