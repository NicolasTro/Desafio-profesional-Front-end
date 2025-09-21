"use client";
import Arrow from "../../public/arrow.svg";
import styles from "./PageHeader.module.css";

type PageHeaderProps = {
  nombre: string;
};

export default function PageHeader({ nombre }: PageHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.arrow}>
        <Arrow />
      </div>
      <p className={styles.title}>{nombre}</p>
    </div>
  );
}
