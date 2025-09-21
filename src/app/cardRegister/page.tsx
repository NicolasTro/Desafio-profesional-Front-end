"use client";
import Card from "./Components/Card";
import style from "./styles/card-register.module.css";
import PageHeader from "@/Components/PageHeader";

export default function CardRegisterPage() {
  return (
    <div className={style["container"]}>
      <div className={style.content}>
        <div className={style.flex}>
          <PageHeader nombre="Tarjetas" />
        </div>

        <Card />
      </div>
    </div>
  );
}
