"use client";
import React, { useMemo } from "react";
import Table from "@mui/joy/Table";
import style from "./table-activity.module.css";

type Row = {
  id: number;
  label: string;
  amount: number;
  weekday: string;
};

export default function TableActivity() {
  const rows: Row[] = useMemo(() => {
    const names = [
      "Ana",
      "Carlos",
      "María",
      "Luis",
      "Sofía",
      "Pedro",
      "Lucía",
      "Mateo",
      "Camila",
      "Diego"
    ];
    const weekdays = [
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
      "Domingo"
    ];

    return Array.from({ length: 10 }).map((_, i) => {
      const type = Math.floor(Math.random() * 3); // 0: sent, 1: ingresaste, 2: te transfirieron
      const name = names[Math.floor(Math.random() * names.length)];
      const amount = Number((Math.random() * 990 + 10).toFixed(2));
      const weekday = weekdays[Math.floor(Math.random() * weekdays.length)];

      if (type === 0) {
        return {
          id: i,
          label: `Transferiste a ${name}`,
          amount: -amount,
          weekday
        } as Row;
      }

      if (type === 1) {
        return {
          id: i,
          label: `Ingresaste dinero`,
          amount: amount,
          weekday
        } as Row;
      }

      return {
        id: i,
        label: `Te transfirieron dinero`,
        amount: amount,
        weekday
      } as Row;
    });
  }, []);

  return (
    <Table className={style["table-container"]}>
      <thead className={style["table-header"]}>
        <tr className={style["table-row"]}>
          <th>Tu actividad</th>
        </tr>
      </thead>

      <tbody>
        {rows.map(row =>
          <tr key={row.id} className={style.row}>
            <td className={style.cell}>
              <div className={style.left}>
                <div className={style.dot} />
                <div className={style.text}>
                  <span className={style.title}>
                    {row.label}
                  </span>
                </div>
              </div>

              <div className={style.right}>
                <span
                  className={
                    row.amount < 0 ? style.negativeAmount : style.positiveAmount
                  }
                >
                  {row.amount < 0 ? "-" : "+"}${Math.abs(
                    row.amount
                  ).toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>

                <div className={style.weekday}>
                  {row.weekday}
                </div>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}
