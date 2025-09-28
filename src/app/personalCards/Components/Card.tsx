"use client";
import style from "./Card.module.css";
import Add_Card from "../../../../public/addCard.svg";
import Arrow from "../../../../public/arrow.svg";
import { useRouter } from "next/navigation";

export default function Card() {
  const router = useRouter();

  return (
    <div className={style["card-container"]}>
      <div className={style["card-top"]}>
        <h3>Agregá tu tarjeta débito o crédito</h3>
      </div>

      <div
        className={`${style["card-body"]}`}
        onClick={() => router.push("/cardRegister")}
        style={{ cursor: "pointer" }}
      >
        <div className="flex gap-[20px]">
          <div>
            <Add_Card fontSize="34" />
          </div>
          <div>
            <p>Nueva tarjeta</p>
          </div>
        </div>
        <div>
          <Arrow color="var(--lima)" fontSize="25" />
        </div>
      </div>
    </div>
  );
}
