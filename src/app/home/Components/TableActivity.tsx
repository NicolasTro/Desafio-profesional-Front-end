"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Table from "@mui/joy/Table";
import style from "./table-activity.module.css";
import { useAppContext } from "@/Context/AppContext";
import Sheet from "@mui/joy/Sheet";
import Arrow from "../../../../public/arrow.svg";
import Link from "next/link";
import Filter from "../../../../public/Filter.svg";

type TableActivityProps = {
  showControls?: boolean;
  searchQuery?: string;
};
// Arrow and Link removed: this component now renders pagination controls instead of a footer link

type ActivityRow = {
  id: number | string;
  label: string;
  amount: number;
  weekday: string;
  dated?: number | null; // numeric timestamp used for filtering/sorting
};

export default function TableActivity({
  showControls = false,
  searchQuery
}: TableActivityProps) {
  const router = useRouter();
  const { userInfo } = useAppContext();
  const accountId = userInfo
    ? (userInfo as { account_id?: string | number }).account_id
    : undefined;

  const [activityItems, setActivityItems] = useState<ActivityRow[]>([]);
  // all items fetched from backend (list-all)
  const [allItems, setAllItems] = useState<ActivityRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const perPage = 10;
  const [totalPages, setTotalPages] = useState<number>(0);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  // controlled filter state
  const INITIAL_PERIOD: string | null = null; // null = no filter applied by default
  // value currently applied to the table (only changes when user clicks Aplicar)
  const [appliedPeriod, setAppliedPeriod] = useState<string | null>(INITIAL_PERIOD);
  // value staged inside the modal while the user is choosing (not yet applied)
  const [stagedSelectedPeriod, setStagedSelectedPeriod] = useState<string | null>(INITIAL_PERIOD);
  const modalFirstInputRef = useRef<HTMLInputElement | null>(null);
  const prevSearchRef = useRef<string | null>(null);
  const prevAppliedRef = useRef<string | null>(appliedPeriod);

  // fetch activity items for the account and store them in `allItems`
  useEffect(() => {
    let mounted = true;
    if (!accountId) {
      setAllItems([]);
      setActivityItems([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setFetchError(null);

    const apiUrl = `/api/accounts/${accountId}/activity`;

    fetch(apiUrl, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => "Error");
          throw new Error(text || res.statusText || "Error fetching activity");
        }
  return res.json();
      })
      .then((data: { items?: unknown[] } | unknown[]) => {

        console.log(data);
        
        if (!mounted) return;

        const responseItems = Array.isArray(data)
          ? (data as unknown[])
          : Array.isArray((data as { items?: unknown[] }).items)
          ? (data as { items?: unknown[] }).items!
          : [];

        type ApiTransaction = {
          id?: number | string;
          account_id?: number | string;
          description?: string | null;
          title?: string | null;
          type?: string | null;
          amount?: number | string | null;
          dated?: string | null;
        };

        const normalizeLabel = (tx: ApiTransaction) => {
          const raw = (tx.description || tx.title || tx.type || "").toString().trim();
          if (!raw) return "(sin descripción)";
          const s = raw.toLowerCase();
          if (s.includes("deposit") || s.includes("depósito") || s.includes("dinheiro")) return "Ingresaste dinero";
          if (s.includes("transfer") || s.includes("transferiste") || s.includes("transferido") || s.includes("transf")) return "Transferencia";
          if (s.includes("pagar") || s.includes("pago") || s.includes("payment") || s.includes("servicio")) return "Pago";
          if (s.includes("ingres") || s.includes("recib") || s.includes("receive") || s.includes("credited")) return "Ingreso";
          if (s.includes("retiro") || s.includes("retirada") || s.includes("withdraw")) return "Retiro";
          return raw
            .split(/\s+/)
            .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
            .join(" ");
        };

        // Normalize and sort by dated (newest first). Transactions without a valid date go last.
        type Normalized = ApiTransaction & { __dated: number | null; __amount: number };
        const normalized: Normalized[] = (responseItems as unknown[])
          .map((r) => {
            const tx = r as ApiTransaction;
            const datedNum = tx.dated ? Date.parse(String(tx.dated)) : NaN;
            const amountNum = typeof tx.amount === "number" ? tx.amount : Number(String(tx.amount)) || 0;
            return { ...(tx as ApiTransaction), __dated: isNaN(datedNum) ? null : datedNum, __amount: amountNum } as Normalized;
          })
          .sort((a, b) => {
            const A = a.__dated ?? Number.NEGATIVE_INFINITY;
            const B = b.__dated ?? Number.NEGATIVE_INFINITY;
            return B - A; // newest first
          });

        const mapped: ActivityRow[] = normalized.map((tx) => {
          const weekdayName = tx.__dated ? new Date(tx.__dated).toLocaleDateString("es-AR", { weekday: "long" }) : "";
          return {
            id: tx.id !== undefined && tx.id !== null ? tx.id : `${tx.account_id}-${Math.random().toString(36).slice(2, 8)}`,
            label: normalizeLabel(tx),
            amount: tx.__amount,
            weekday: weekdayName,
            dated: tx.__dated ?? null,
          };
        });

        // store full sorted list and initialize pagination (page 1)
        setAllItems(mapped);
        setTotalPages(Math.max(1, Math.ceil(mapped.length / perPage)));
        setPage(1);
        // home view will render the first page (latest 10). activity view can paginate through allItems.
        setActivityItems(mapped.slice(0, perPage));
      })
      .catch((err) => {
        if (!mounted) return;
        setFetchError(String(err.message || err));
      })
      .finally(() => {
        if (!mounted) return;
        setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [accountId]);

  // compute displayed items from the full list with client-side period filter, search + pagination
  useEffect(() => {
    const normalizeForSearch = (s: string) =>
      s
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

    // if appliedPeriod or searchQuery changed since last run, reset to page 1 first
    const prevSearch = prevSearchRef.current;
    const prevApplied = prevAppliedRef.current;
    if ((searchQuery || prevSearch) && searchQuery !== prevSearch) {
      prevSearchRef.current = searchQuery ?? null;
      if (page !== 1) {
        setPage(1);
        return; // wait for next run with page=1
      }
    }
    if ((appliedPeriod || prevApplied) && appliedPeriod !== prevApplied) {
      prevAppliedRef.current = appliedPeriod;
      if (page !== 1) {
        setPage(1);
        return; // wait for next run with page=1
      }
    }

    const qNorm = searchQuery && String(searchQuery).trim() !== "" ? normalizeForSearch(String(searchQuery)) : null;

    // apply period filter based on appliedPeriod
    const now = Date.now();
    const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

    let fromTs: number | null = null;
    let toTs: number | null = null;

    const setDaysBack = (days: number) => {
      toTs = now;
      fromTs = now - days * 24 * 60 * 60 * 1000;
    };

    if (appliedPeriod === "today") {
      fromTs = startOfDay(new Date(now));
      toTs = now;
    } else if (appliedPeriod === "yesterday") {
      const yesterday = new Date(now - 24 * 60 * 60 * 1000);
      fromTs = startOfDay(yesterday);
      toTs = startOfDay(new Date(now)) - 1;
    } else if (appliedPeriod === "last_week") {
      setDaysBack(7);
    } else if (appliedPeriod === "last_15_days") {
      setDaysBack(15);
    } else if (appliedPeriod === "last_month") {
      setDaysBack(30);
    } else if (appliedPeriod === "last_year") {
      setDaysBack(365);
    }

    let filtered = allItems.filter((item) => {
      if (fromTs != null && toTs != null) {
        if (!item.dated) return false;
        if (item.dated < fromTs || item.dated > toTs) return false;
      }
      return true;
    });

    if (qNorm) filtered = filtered.filter((item) => normalizeForSearch(item.label).includes(qNorm));

    const tp = Math.max(1, Math.ceil(filtered.length / perPage));
    setTotalPages(tp);
    if (page > tp) setPage(tp);

    const start = (page - 1) * perPage;
    setActivityItems(filtered.slice(start, start + perPage));
  }, [allItems, searchQuery, page, appliedPeriod]);


  // silence unused-vars in the short-term: UI uses these later when adding spinners/errors
  void isLoading;
  void fetchError;

  // if (isLoading) {
  //   return React.createElement(
  //     "div",
  //     { className: style["table-container"] },
  //     "Cargando actividad..."
  //   );
  // }

  // if (fetchError) {
  //   return React.createElement(
  //     "div",
  //     { className: style["table-container"] },
  //     `Error: ${fetchError}`
  //   );
  // }

  // keyboard handlers & focus trap for modal
  useEffect(() => {
    if (!showFilterModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowFilterModal(false);
    };
    document.addEventListener("keydown", onKey);
    // focus first input
    setTimeout(() => modalFirstInputRef.current?.focus(), 0);
    return () => document.removeEventListener("keydown", onKey);
  }, [showFilterModal]);

  // removed JS fallback; now use CSS sibling selector with input + span ordering

  return (
    <Sheet sx={{ height: "100%", overflow: "auto", width: "100%" }}>
      <Table className={style["table-container"]} stickyHeader stickyFooter>
        <thead>
          <tr>
            <th>
              <div className={style["thead-row"]}>
                <div className={style.title}>Tu actividad</div>
                {showControls ? (
                    <div className={style.filter}>
                      <button
                        type="button"
                        className={
                          appliedPeriod !== INITIAL_PERIOD
                            ? `${style.filterButton} ${style.filterActive}`
                            : style.filterButton
                        }
                        onClick={() => {
                          // initialize modal staged selection from current applied value
                          setStagedSelectedPeriod(appliedPeriod);
                          setShowFilterModal(true);
                        }}
                      >
                        {appliedPeriod !== INITIAL_PERIOD ? "Filtrado" : "Filtrar"} <Filter fontSize={25} />
                      </button>
                    </div>
                  ) : null}
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          {activityItems.map(row => (
            <tr
              key={String(row.id)}
              className={style.row}
              role="button"
              tabIndex={0}
              onClick={() => {
                if (!accountId) return;
                router.push(
                  `/activityDetail?account_id=${encodeURIComponent(String(accountId))}&transaction_id=${encodeURIComponent(String(row.id))}`
                );
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  if (!accountId) return;
                  router.push(
                    `/activityDetail?account_id=${encodeURIComponent(String(accountId))}&transaction_id=${encodeURIComponent(String(row.id))}`
                  );
                }
              }}
            >
              <td className={style.cell} colSpan={2}>
                <div className={style["row-content"]}>
                  <div className={style.left}>
                    <div className={style.dot} />
                    <div className={style.text}>
                      <span className={style.title}>{row.label}</span>
                    </div>
                  </div>

                  <div className={style.right}>
                    <span
                      className={
                        row.amount < 0 ? style.negativeAmount : style.positiveAmount
                      }
                    >
                      {row.amount < 0 ? "-" : "+"}$
                      {Math.abs(row.amount).toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>

                    <div className={style.weekday}>{row.weekday}</div>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr>
            <td>
              {showControls
                ? <div className={style.pagination}>
                    {totalPages > 0
                      ? Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map(n =>
                          <button
                            key={n}
                            className={
                              n === page
                                ? `${style.pageButton} ${style.active}`
                                : style.pageButton
                            }
                            onClick={() => setPage(n)}
                          >
                            {n}
                          </button>
                        )
                      : <span />}
                  </div>
                : <Link href="/activity">
                    <div className={style.footerLink}>
                      <span>Ver toda tu actividad</span>
                      <Arrow />
                    </div>
                  </Link>}
            </td>
          </tr>
        </tfoot>
      </Table>
      {showFilterModal ? (
        <div
          className={style.modalOverlay}
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            // close when clicking on the overlay (outside the panel)
            if (e.currentTarget === e.target) {
              setShowFilterModal(false);
            }
          }}
        >
          <div className={style.modalPanel}>
            <div className={style.modalHeader}>
              <div className={style.modalTitle}>Período</div>
              <button
                type="button"
                className={style.clearFilters}
                disabled={appliedPeriod === INITIAL_PERIOD}
                aria-disabled={appliedPeriod === INITIAL_PERIOD}
                onClick={() => {
                  // reset staged and applied filters to initial/default, trigger a refetch and close modal
                  setStagedSelectedPeriod(INITIAL_PERIOD);
                    setAppliedPeriod(INITIAL_PERIOD);
                  setShowFilterModal(false);
                }}
              >
                Borrar filtros
              </button>
            </div>

            <div className={style.modalBody}>
              <fieldset className={style.fieldset}>
                <label className={style.radioRow}>
                  <input
                    ref={modalFirstInputRef}
                    type="radio"
                    name="period"
                    value="today"
                    checked={stagedSelectedPeriod === "today"}
                    onChange={() => setStagedSelectedPeriod("today")}
                  />
                  <span>Hoy</span>
                </label>

                <label className={style.radioRow}>
                  <input
                    type="radio"
                    name="period"
                    value="yesterday"
                    checked={stagedSelectedPeriod === "yesterday"}
                    onChange={() => setStagedSelectedPeriod("yesterday")}
                  />
                  <span>Ayer</span>
                </label>

                <label className={style.radioRow}>
                  <input
                    type="radio"
                    name="period"
                    value="last_week"
                    checked={stagedSelectedPeriod === "last_week"}
                    onChange={() => setStagedSelectedPeriod("last_week")}
                  />
                  <span>Última semana</span>
                </label>

                <label className={style.radioRow}>
                  <input
                    type="radio"
                    name="period"
                    value="last_15_days"
                    checked={stagedSelectedPeriod === "last_15_days"}
                    onChange={() => setStagedSelectedPeriod("last_15_days")}
                  />
                  <span>Últimos 15 días</span>
                </label>

                <label className={style.radioRow}>
                  <input
                    type="radio"
                    name="period"
                    value="last_month"
                    checked={stagedSelectedPeriod === "last_month"}
                    onChange={() => setStagedSelectedPeriod("last_month")}
                  />
                  <span>Último mes</span>
                </label>

                <label className={style.radioRow}>
                  <input
                    type="radio"
                    name="period"
                    value="last_year"
                    checked={stagedSelectedPeriod === "last_year"}
                    onChange={() => setStagedSelectedPeriod("last_year")}
                  />
                  <span>Último año</span>
                </label>

                <label className={style.radioRow}>
                  <input
                    type="radio"
                    name="period"
                    value="other"
                    checked={stagedSelectedPeriod === "other"}
                    onChange={() => setStagedSelectedPeriod("other")}
                  />
                  <span>Otro período</span>
                </label>
              </fieldset>
            </div>

            <div className={style.modalFooter}>
              <div style={{ width: "100%", display: "flex", gap: 12 }}>
                <button
                  type="button"
                  className={style.applyButton}
                  onClick={() => {
                    // apply staged filters: set as applied, trigger refetch and close
                    setAppliedPeriod(stagedSelectedPeriod);
                    setShowFilterModal(false);
                  }}
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </Sheet>
  );
}
