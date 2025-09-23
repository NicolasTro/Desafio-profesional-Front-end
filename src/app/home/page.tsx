"use client"
import Button from "@/Components/Button";
import Link from "next/link";
import ActivitySearchNavigator from "@/Components/ActivitySearchNavigator";
import PageHeader from "@/Components/PageHeader";
import Card from "./Components/Card";
import TableActivity from "./Components/TableActivity";
import style from "./styles/home.module.css";
import { useAppContext } from "@/Context/AppContext";


export default function Dashboard() {
  const { userInfo } = useAppContext();

  return (
    <>

      {userInfo && (
        <div className={style["home-container"]}>
          <div className={style["home-section-top"]}>
            <PageHeader nombre="Inicio" />
          </div>

          <div className={style["home-section-middle"]}>
            <div className={style["home-width-100"]}>
              <Card />
            </div>
            <div
              className={`${style["home-buttons"]} ${style["home-width-100"]}`}
            >
              <Link href="/deposit" className={style["home-width-100"]}>
                <Button
                  label="Ingresar dinero"
                  className={style["home-width-100"]}
                />
              </Link>
              <Button
                label="Pago de servicios"
                className={style["home-width-100"]}
              />
            </div>
            <div className={`${style["home-width-100"]}`}>
              <ActivitySearchNavigator
                placeholder="Buscar en tu actividad"
                className={`${style["home-width-100"]} ${style["home-search-bar"]}`}
              />
            </div>
          </div>
          <div className={style["home-section-bottom"]}>
            <TableActivity />
          </div>
        </div>
      )}
    </>

  );
}
