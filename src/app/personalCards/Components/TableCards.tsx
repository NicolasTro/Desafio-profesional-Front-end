"use client";
import { useAppContext } from "@/Context/AppContext";
import Table from "@mui/joy/Table";
import { useEffect, useState } from "react";
import style from "./table-card.module.css";

export default function DataProfileTable() {
  const { account } = useAppContext();

  const accountId = account?.account_id;

  type Card = {
    id: number;
    account_id: number;
    number_id: number | string;
    first_last_name?: string;
    cod?: number;
    expiration_date?: string;
  };

  const [cards, setCards] = useState<Card[]>([]);
  const [removingIds, setRemovingIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accountId) return;
    let mounted = true;

    const fetchCards = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/accounts/${accountId}/cards`, {
          method: "GET",
          headers: { Accept: "application/json" },
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
        setError(e instanceof Error ? e.message : String(e));
        setCards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
    return () => {
      mounted = false;
    };
  }, [accountId]);

  const last4 = (n: number | string) => {
    const s = String(n || "");
    return s.slice(-4);
  };

  const handleDelete = async (cardId: number) => {
    if (!accountId) return;

    try {
      const Swal = (await import("sweetalert2")).default;
      const confirmation = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará la tarjeta de tu cuenta.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
        customClass: {
          popup: "swal-popup",
          confirmButton: "swal-confirm",
        },
      });

      if (!confirmation.isConfirmed) return;

      setRemovingIds((s) => new Set(s).add(cardId));

      const DELAY = 300;
      setTimeout(async () => {
        const previous = cards;
        setCards((prev) => prev.filter((c) => c.id !== cardId));
        setRemovingIds((s) => {
          const copy = new Set(s);
          copy.delete(cardId);
          return copy;
        });

        const res = await fetch(`/api/accounts/${accountId}/cards/${cardId}`, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          setCards(previous);
          const text = await res.text().catch(() => "");
          console.error("Failed to delete card", text);
          try {
            await Swal.fire({
              icon: "error",
              title: "No se pudo eliminar",
              text: `${res.status} - ${text}`,
              confirmButtonText: "Cerrar",
              customClass: { confirmButton: "swal-confirm", popup: "swal-popup" },
            });
          } catch {
            // ignore
          }
        } else {
          try {
            await Swal.fire({
              icon: "success",
              title: "Tarjeta eliminada",
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 1800,
            });
          } catch {
            // ignore
          }
        }
      }, DELAY);
    } catch (err) {
      console.error("Error deleting card", err);
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

        {!loading && error && cards.length === 0 && (
          <tr className={style.row}>
            <td colSpan={1} className={style.placeholder}>
              {error}
            </td>
          </tr>
        )}

        {!loading && !error && cards.length === 0 && (
          <tr className={style.row}>
            <td colSpan={1} className={style.placeholder}>
              No hay tarjetas registradas.
            </td>
          </tr>
        )}

        {cards.map((card) => {
          const isRemoving = removingIds.has(card.id);
          const trClass = `${style.row} ${style['row-item']} ${
            isRemoving ? style.removing : ""
          }`.trim();

          return (
            <tr key={card.id} className={trClass}>
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
                      card.number_id
                    )}`}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
