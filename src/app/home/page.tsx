import Button from "@/Components/Button";
import SearchBar from "@/Components/SearchBar";
import Arrow from "../../../public/arrow.svg";
import Card from "./Components/Card";
import TableActivity from "./Components/TableActivity";
import style from "./styles/home.module.css";

export default function Dashboard() {
  return (
    <section className={style["home-section"]}>
      <div className={style["home-container"]}>
        <div className={style["home-section-top"]}>
          <Arrow />
          <p>Inicio</p>
        </div>

        <div className={style["home-section-middle"]}>
          <div className={style["home-width-100"]}>
            <Card />
          </div>
          <div
            className={`${style["home-buttons"]} ${style["home-width-100"]}`}
          >
            <Button
              label="Ingresar dinero"
              className={style["home-width-100"]}
            />
            <Button
              label="Pago de servicios"
              className={style["home-width-100"]}
            />
          </div>
          <div className={`${style["home-width-100"]}`}>
            <SearchBar
              placeholder="Buscar en tu actividad"
              className={`${style["home-width-100"]} ${style[
                "home-search-bar"
              ]}`}
            />
          </div>
        </div>
        <div className={style["home-section-bottom"]}>
          <TableActivity />
        </div>
      </div>
    </section>
  );
}
