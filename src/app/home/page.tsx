"use client"
import { useEffect, useState } from "react";
import Button from "@/Components/Button";
import Link from "next/link";
import ActivitySearchNavigator from "@/Components/ActivitySearchNavigator";
import PageHeader from "@/Components/PageHeader";
import Card from "./Components/Card";
import TableActivity from "./Components/TableActivity";
import style from "./styles/home.module.css";
import { useAppContext } from "@/Context/AppContext";
import Spinner from "@/Components/Spinner";

export default function Dashboard() {
  const { account } = useAppContext();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const minDelay = account ? 800 : 2500;

    const timeout = setTimeout(() => {
      if (mounted) setIsLoading(false);
    }, minDelay);

    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, [account]);

  if (isLoading) {
    return (
      <div className={style["home-container"]} style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100dvh" }}>
        <Spinner />
      </div>
    );
  }


  return (
    <div className={style["home-container"]}>
      <div className={style["home-section-top"]}>
        <PageHeader nombre="Inicio" />
      </div>

      <div className={style["home-section-middle"]}>
        <div className={style["home-width-100"]}>
          <Card />
        </div>
        <div className={`${style["home-buttons"]} ${style["home-width-100"]}`}>
          <Link href="/deposit" className={style["home-width-100"]}>
            <Button label="Ingresar dinero" className={style["home-width-100"]} />
          </Link>
          <Link href="/services" className={style["home-width-100"]}>
            <Button label="Pago de servicios" className={style["home-width-100"]} />
          </Link>
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
  );
}
