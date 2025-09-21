import Card from "@/Components/Card";
import style from "./landing.module.css";

export default function Home() {
  return (
    <div className={style.container}>
      <div className={style.landingTop}>
        <h1>
          De ahora <br className={style.hide} />
          en adelante, <br className={style.hide} />
          hacés más <br className={style.hide} />
          con tu dinero
        </h1>
        <hr className={style.divider} />
        <p className={style.subtitle}>
          {" "}
          Tu nueva <br className={style.hide} />
          <span className="font-bold">billetera virtual</span>
        </p>
      </div>

      <div className={`${style.landingBottom} flex flex-col md:flex-row gap-4`}>
        <div className={style.landingBottomUp} />
        <div className={style.landingBottomDown}>
          <div className={style.landingBottomGroup}>
            <Card
              title="Transferí dinero"
              content="Desde Digital Money House vas a poder transferir dinero a otras cuentas, así como también recibir transferencias y nuclear tu capital en nuestra billetera virtual."
            />
            <Card
              title="Pago de servicios"
              content="Pagá mensualmente los servicios en 3 simples clicks. Fácil, rápido y conveniente. Olvidate de las facturas en papel."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
