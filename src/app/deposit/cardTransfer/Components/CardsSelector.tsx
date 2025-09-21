"use client";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/Context/AppContext";
import Table from "@mui/joy/Table";
import style from "./TableCard.module.css";

type Card = {
  id: number;
  account_id: number;
  number_id: number | string;
  first_last_name?: string;
  cod?: number;
  expiration_date?: string;
};

export default function CardsSelector({
  onSelect,
  selectedId
}: {
  onSelect?: (card: Card | null) => void;
  selectedId?: number | null;
}) {
  const { userInfo, token } = useAppContext();
  const accountId =
    userInfo && (userInfo as { account_id?: string }).account_id;

  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetched, setFetched] = useState(false);
  const [selected, setSelected] = useState<number | null>(
    selectedId == null ? null : selectedId
  );

  useEffect(
    () => {
      if (!accountId) return;
      let mounted = true;

      const fetchCards = async () => {
        setLoading(true);
        setError(null);
        try {
          const headers: Record<string, string> = {
            Accept: "application/json"
          };
          if (token) headers["Authorization"] = token as string;

          const res = await fetch(`/api/accounts/${accountId}/cards`, {
            method: "GET",
            headers
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
          if (e instanceof Error) setError(e.message);
          else setError(String(e));
          setCards([]);
        } finally {
          setLoading(false);
          setFetched(true);
        }
      };

      void fetchCards();

      return () => {
        mounted = false;
      };
    },
    [accountId, token]
  );

  useEffect(
    () => {
      setSelected(selectedId == null ? null : selectedId);
    },
    [selectedId]
  );

  const last4 = (n: number | string) => {
    const s = String(n || "");
    return s.slice(-4);
  };

  const handleSelect = (card: Card) => {
    setSelected(card.id);
    if (onSelect) onSelect(card);
  };

  return (
    <Table className={style.table}>
      <thead>
        <tr>
          <th colSpan={1}>Tus tarjetas</th>
        </tr>
      </thead>
      <tbody>
        {loading &&
          <tr className={style.row}>
            <td colSpan={1} className={style.placeholder}>
              Cargando tarjetas...
            </td>
          </tr>}

        {!loading && error && (
          <tr className={style.row}>
            <td colSpan={1} className={style.placeholder}>
              {error}
            </td>
          </tr>
        )}

        {!loading && fetched && !error && (!cards || cards.length === 0) && (
          <tr className={style.row}>
            <td colSpan={1} className={style.placeholder}>
              No hay tarjetas registradas.
            </td>
          </tr>
        )}

        {cards.map(card =>
          <tr key={card.id} className={style.row}>
            <td className={style.cell}>
              <div className={style.left}>
                <div className={style.text}>
                  <div className={style["card-info"]}>
                    <span className={style.dot} />

                    <div className={style.title}>
                      Terminada en {last4(card.number_id)}
                    </div>
                  </div>

                  <input
                    type="radio"
                    name="selectedCard"
                    className={`${style.radioLarge} ${style.radioCustom}`}
                    checked={selected === card.id}
                    onChange={() => handleSelect(card)}
                    aria-label={`Seleccionar tarjeta termina en ${last4(
                      card.number_id
                    )}`}
                  />
                </div>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}
