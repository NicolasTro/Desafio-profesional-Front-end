"use client";
import Card from "./Components/Card";
import Arrow from "../../../public/arrow.svg";
import TableCards from "./Components/TableCards";
import styles from "./styles/personalCards.module.css";

export default function PersonalCards() {
  return (
    <div className={styles["container-personal-card"]}>
      <div className={styles.header}>
        <div className={styles.arrow}><Arrow /></div>
        <p className={styles.title}>Tarjetas</p>
      </div>

      <div className={styles.middle}>
        <Card />
      </div>

      <div className={styles.bottom}>
        <TableCards />
      </div>
    </div>
  );
}
