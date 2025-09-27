"use client";
import styles from "./Spinner.module.css";
import React from "react";

export default function Spinner() {
  return (
    <div className={styles.spinnerCenter} aria-live="polite" aria-busy="true">
      <div className={styles.spinner} />
    </div>
  );
}
