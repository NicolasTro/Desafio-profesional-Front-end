import Button from "@/Components/Button";
import Link from "next/dist/client/link";
import Image from "next/image";
import Card from "./Components/Card";
import style from "./home.module.css";
import SearchBar from "@/Components/SearchBar";
import TableActivity from "./Components/TableActivity";
import tableStyle from "./Components/TableActivity.module.css"

export default function Dashboard() {
  return (
    <section className={style["home-section"]}>
      <div className={style["home-container"]}>
        <div className={style["home-section-top"]}>
          <Image
            src="/darkArrow.png"
            alt="Description"
            width={14}
            height={14}
          />
          <Link href="/somewhere">Inicio</Link>
        </div>

        <div className="">
          <div>
            <Card />
          </div>
          <div className={style["home-buttons"]}>
            <Button label="Continuar" />
            <Button label="Continuar" />
          </div>
          <div>
            <SearchBar placeholder="Buscar en tu actividad" />
          </div>
        </div>
        <div>
          <TableActivity></TableActivity>
        </div>
      </div>
    </section>
  );
}
