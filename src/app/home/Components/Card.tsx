"use client";
import Link from "next/link";
import style from "./card.module.css";
import { useAppContext } from "@/Context/AppContext";

export default function Card() {
  const { userInfo } = useAppContext();
  const amount = userInfo?.available_amount ?? 0;

  const formatted = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return (
    <div className={`${style.card}  shadow-md rounded-lg p-4`}>
      <div className={style["top-card-container"]}>
        <div className={style["top-card-container1"]}>
          <Link href="/personalCards">
            <h3>Ver tarjetas</h3>
          </Link>
          <Link href="/profile">
            <h3>Ver CVU</h3>
          </Link>
        </div>
      </div>

      <div className={style["middle-card-container"]}>
        <h2>Dinero disponible</h2>
      </div>

      <div className={style["bottom-card-container"]}>
        <p>{formatted}</p>
      </div>
    </div>
  );
}
