"use client";
type NameTagProps = {
  nameTag?: string | null | undefined;
  className?: string;
};

export default function NameTag({ nameTag, className }: NameTagProps) {
  return (
    <div className={`${className || ""}`}>
      <span className="name">
        {nameTag || ""}
      </span>
    </div>
  );
}
