"use client";

import PageHeader from "@/Components/PageHeader";
import SearchBar from "@/Components/SearchBar";
import TableActivity from "../home/Components/TableActivity";
import styles from "./styles/activity.module.css";
import React, { useState } from "react";

export default function ActivityPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <div className={styles.container}>
      <PageHeader nombre="Tu actividad" />

      <div className={styles.content}>
        <div className={styles.searchWrapper}>
          <SearchBar
            placeholder="Buscar en tu actividad"
            height="64px"
            defaultValue={searchQuery}
            onSearch={(q) => setSearchQuery(q)}
          />
        </div>

        <div className={styles.tableWrapper}>
          <TableActivity showControls={true} searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
}
