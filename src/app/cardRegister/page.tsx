"use client";
import Card from "./Components/Card";
import style from "./styles/card-register.module.css";
import Arrow from "../../../public/arrow.svg";

export default function CardRegisterPage() {
  return (
    <div className={style["container"]}>
      <div className={style.content}>
        <div className={style.flex}>
          <Arrow />
          <p>Tarjetas</p>
        </div>

        <Card />
      </div>
    </div>
  );
}
