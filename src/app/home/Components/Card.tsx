import Link from "next/link";
import style from "./Card.module.css";

export default function Card() {
  return (
    <div className={`${style.card}  shadow-md rounded-lg p-4`}>
      <div className={style["top-card-container"]}>
        <div className={style["top-card-container1"]}>
          <Link href="/card">
            <h3 className="text-lg font-semibold">Ver tarjetas</h3>
          </Link>
          <Link href="/card">
            <h3 className="text-lg font-semibold">Ver CVU</h3>
          </Link>
        </div>
      </div>

      <h2>Dinero disponible</h2>

      <div>$6565656556</div>
    </div>
  );
}
