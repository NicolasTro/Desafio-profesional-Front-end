"use client";

import styles from "./styles/deposit.module.css";
import PageHeader from "@/Components/PageHeader";
import Card from "../../../public/DepositCard.svg";
import Arrow from "../../../public/arrow.svg";
import UserIcon from "../../../public/UserIcon.svg";
import { useRouter } from "next/navigation";

export default function DepositPage() {
  const router = useRouter();

  return (
    <main className={styles.container}>
      <PageHeader nombre="Cargar dinero" />

      <div className={styles["deposit-blocks"]}>
        <div
          className={styles.block}
          onClick={() => router.push("/deposit/bankTransfer")}
        >
          <div className={styles["left-block"]}>
            <UserIcon color={"var(--lima)"} fontSize={40} />
            <p className={styles.blockText}>Transferencia bancaria</p>
          </div>

          <Arrow color={"var(--lima)"} fontSize={22} />
        </div>

        <div
          className={styles.block}
          onClick={() => router.push("/deposit/cardTransfer")}
        >
          <div className={styles["left-block"]}>
            <Card color={"var(--lima)"} fontSize={40} />
            <p className={styles.blockText}>Seleccionar tarjeta</p>
          </div>
          <Arrow color={"var(--lima)"} fontSize={22} />
        </div>
      </div>
    </main>
  );
}
