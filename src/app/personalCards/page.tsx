"use client";
import Card from "./Components/Card";
import PageHeader from "@/Components/PageHeader";
import TableCards from "./Components/TableCards";
import styles from "./styles/PersonalCards.module.css";

export default function PersonalCards() {
  return (
    <div className={styles["container-personal-card"]}>
      <PageHeader nombre="Tarjetas" />

      <div className={styles.middle}>
        <Card />
      </div>

      <div className={styles.bottom}>
        <TableCards />
      </div>
    </div>
  );
}
