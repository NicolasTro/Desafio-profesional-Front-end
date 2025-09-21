"use client";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/Context/AppContext";
import Table from "@mui/joy/Table";

import style from "./table-card.module.css";

export default function DataProfileTable() {
  const { userInfo, token } = useAppContext();
  const accountId =
    userInfo && (userInfo as { account_id?: string }).account_id;

  type Card = {
    id: number;
    account_id: number;
    number_id: number | string;
    first_last_name?: string;
    cod?: number;
    expiration_date?: string;
  };

  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accountId) return;
    let mounted = true;

    const fetchCards = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers: Record<string, string> = {
          Accept: "application/json",
        };
        if (token) headers["Authorization"] = token as string;

        const res = await fetch(`/api/accounts/${accountId}/cards`, {
          method: "GET",
          headers,
        });

        if (!mounted) return;

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          setError(`Error al obtener tarjetas: ${res.status} ${txt}`);
          setCards([]);
          return;
        }

        const data = await res.json();
        if (Array.isArray(data)) setCards(data);
        else setCards([]);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError(String(e));
        }
        setCards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();

    return () => {
      mounted = false;
    };
  }, [accountId, token]);

  const last4 = (n: number | string) => {
    const s = String(n || "");
    return s.slice(-4);
  };

  const handleDelete = async (cardId: number) => {
    if (!accountId) return;
    const previous = cards;
    setCards((prev) => prev.filter((c) => c.id !== cardId));

    try {
      const headers: Record<string, string> = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      if (token) headers["Authorization"] = token as string;

      const res = await fetch(`/api/accounts/${accountId}/cards/${cardId}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) {
        setCards(previous);
        console.error(
          "Failed to delete card",
          await res.text().catch(() => ""),
        );
      }
    } catch (e) {
      setCards(previous);
      console.error("Error deleting card", e);
    }
  };

  return (
    <Table className={style.table}>
      <thead>
        <tr>
          <th colSpan={1}>Tus tarjetas</th>
        </tr>
      </thead>
      <tbody>
        {loading && (
          <tr className={style.row}>
            <td colSpan={1} className={style.placeholder}>
              Cargando tarjetas...
            </td>
          </tr>
        )}

        {!loading && error && (!cards || cards.length === 0) && (
          <tr className={style.row}>
            <td colSpan={1} className={style.placeholder}>
              {error}
            </td>
          </tr>
        )}

        {!loading && !error && (!cards || cards.length === 0) && (
          <tr className={style.row}>
            <td colSpan={1} className={style.placeholder}>
              No hay tarjetas registradas.
            </td>
          </tr>
        )}

        {cards.map((card) => (
          <tr key={card.id} className={style.row}>
            <td className={style.cell}>
              <div className={style.left}>
                <span className={style.dot} aria-hidden />
                <div className={style.text}>
                  <span className={style.title}>
                    Terminada en {last4(card.number_id)}
                  </span>
                </div>
              </div>

              <div className={style.actions}>
                <button
                  className={style.delete}
                  onClick={() => handleDelete(card.id)}
                  aria-label={`Eliminar tarjeta termina en ${last4(
                    card.number_id,
                  )}`}
                >
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        ))}
        <tr></tr>
      </tbody>
    </Table>
  );
}
