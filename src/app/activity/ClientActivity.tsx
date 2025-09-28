"use client";
import React, { useEffect, useState } from "react";
import SearchBar from "@/Components/SearchBar";
import TableActivity from "../home/Components/TableActivity";
import styles from "./styles/activity.module.css";
import { useSearchParams } from "next/navigation";
import Filter from "../../../public/Filter.svg"

export default function ClientActivity() {
  const searchParams = useSearchParams();
  const q = searchParams?.get("q") ?? "";
  const [searchQuery, setSearchQuery] = useState<string>(q);
  const [filterApplied, setFilterApplied] = useState<boolean>(false);

  useEffect(() => {
    setSearchQuery(searchParams?.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    const onChange = (e: Event) => {
      const ce = e as CustomEvent<{ applied: boolean }>;
      setFilterApplied(Boolean(ce.detail?.applied));
    };
    if (typeof window !== "undefined") {
      window.addEventListener("activity-filter-changed", onChange as EventListener);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("activity-filter-changed", onChange as EventListener);
      }
    };
  }, []);

  return (
    <div className={styles.content}>
      <div className={styles.searchWrapper}>
        <SearchBar
          placeholder="Buscar en tu actividad"
          className={styles["search-width"]}
          onSearch={(q) => setSearchQuery(q)}
        />

        <div
          className={styles["content-button"]}
          onClick={() => {
            if (typeof window !== "undefined") {
              window.dispatchEvent(new Event("open-activity-filter"));
            }
          }}
        >
          <button aria-label="Abrir filtros de actividad">{filterApplied ? "Filtrado" : "Filtrar"}</button>
          <Filter className={styles["filter-icon"]} />
        </div>
      </div>
      <div className={styles["table-wrapper"]}>
        <TableActivity showControls={true} searchQuery={searchQuery} />
      </div>
    </div>
  );
}
