import Link from "next/link";
import style from "./card.module.css";

export default function Card() {
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
        <p> $ 6.890.534,17</p>
      </div>
    </div>
  );
}
