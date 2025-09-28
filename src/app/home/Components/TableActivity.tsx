"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Table from "@mui/joy/Table";
import style from "./TableActivity.module.css";
import { useAppContext } from "@/Context/AppContext";
import Sheet from "@mui/joy/Sheet";
import Arrow from "../../../../public/arrow.svg";
import Link from "next/link";
import Filter from "../../../../public/Filter.svg";
import modalStyle from "./FilterModal.module.css";

type TableActivityProps = {
  showControls?: boolean;
  searchQuery?: string;
};

type ActivityRow = {
  id: number | string;
  label: string;
  amount: number;
  weekday: string;
  dated?: number | null;
};

export default function TableActivity({
  showControls = false,
  searchQuery
}: TableActivityProps) {
  const router = useRouter();
  const { userInfo, account } = useAppContext();

  const accountId = account?.account_id;

  const [activityItems, setActivityItems] = useState<ActivityRow[]>([]);
  const [allItems, setAllItems] = useState<ActivityRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const perPage = 10;
  const [totalPages, setTotalPages] = useState<number>(0);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const INITIAL_PERIOD: string | null = null;
  const [appliedPeriod, setAppliedPeriod] = useState<string | null>(INITIAL_PERIOD);
  const [stagedSelectedPeriod, setStagedSelectedPeriod] = useState<string | null>(INITIAL_PERIOD);
  const modalFirstInputRef = useRef<HTMLInputElement | null>(null);
  const prevSearchRef = useRef<string | null>(null);
  const prevAppliedRef = useRef<string | null>(appliedPeriod);

  useEffect(() => {
    const onOpen = () => {
      setStagedSelectedPeriod(appliedPeriod);
      setShowFilterModal(true);
    };
    if (typeof window !== "undefined") {
      window.addEventListener("open-activity-filter", onOpen as EventListener);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("open-activity-filter", onOpen as EventListener);
      }
    };
  }, [appliedPeriod]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const applied = appliedPeriod !== INITIAL_PERIOD && appliedPeriod != null;
    const ev = new CustomEvent("activity-filter-changed", { detail: { applied } });
    window.dispatchEvent(ev);
  }, [appliedPeriod]);

  useEffect(() => {
    if (showFilterModal) {
      const id = setTimeout(() => {
        modalFirstInputRef.current?.focus();
      }, 10);
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setShowFilterModal(false);
      };
      window.addEventListener("keydown", onKey);
      return () => {
        clearTimeout(id);
        window.removeEventListener("keydown", onKey);
      };
    }
    return;
  }, [showFilterModal]);

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
        if (!mounted) return;

        const responseItems = Array.isArray(data)


          ? (data as unknown[])
          : Array.isArray((data as { items?: unknown[] }).items)
            ? (data as { items?: unknown[] }).items!
            : [];
        console.log(responseItems);

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

          // Deposit
          if (s.includes("deposit") || s.includes("depósito") || s.includes("dinheiro")) {
            return "Ingresaste dinero";
          }

          // Transfer: try to extract recipient name from description
          // Examples: 'Transferiu para Fulano', 'Transferiu para MENGANO', 'Transfer to Alice'
          if (s.includes("transfer") || s.includes("transferiste") || s.includes("transferido") || s.includes("transf")) {
            // attempt to match common patterns like 'para NAME' or 'to NAME'
            const mPara = raw.match(/para\s+([\wÀ-ÿ'’\-\s]+)/i);
            if (mPara && mPara[1]) {
              const name = mPara[1].trim();
              return `Transferencia para ${name}`;
            }
            const mTo = raw.match(/to\s+([\wÀ-ÿ'’\-\s]+)/i);
            if (mTo && mTo[1]) {
              const name = mTo[1].trim();
              return `Transferencia para ${name}`;
            }
            // fallback if name not found
            return "Transferencia";
          }

          // Payment: preserve description (capitalized)
          if (s.includes("pagar") || s.includes("pago") || s.includes("payment") || s.includes("servicio") || s.includes("pagado") || s.includes("pago")) {
            return raw
              .split(/\s+/)
              .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
              .join(" ");
          }

          // Ingress / credited
          if (s.includes("ingres") || s.includes("recib") || s.includes("receive") || s.includes("credited")) {
            return "Ingreso";
          }

          // Withdraw
          if (s.includes("retiro") || s.includes("retirada") || s.includes("withdraw")) {
            return "Retiro";
          }

          // Default: return capitalized original
          return raw
            .split(/\s+/)
            .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
            .join(" ");
        };

        type Normalized = ApiTransaction & { __dated: number | null; __amount: number };
        const normalized: Normalized[] = (responseItems as unknown[])
          .map((r) => {
            const tx = r as ApiTransaction;
            const datedNum = tx.dated ? Date.parse(String(tx.dated)) : NaN;
            const amountNum = typeof tx.amount === "number" ? tx.amount : Number(String(tx.amount)) || 0;
            return { ...(tx as ApiTransaction), __dated: isNaN(datedNum) ? null : datedNum, __amount: amountNum };
          })
          .sort((a, b) => {
            const A = a.__dated ?? Number.NEGATIVE_INFINITY;
            const B = b.__dated ?? Number.NEGATIVE_INFINITY;
            return B - A;
          });

        const mapped: ActivityRow[] = normalized.map((tx) => {
          const weekdayName = tx.__dated ? new Date(tx.__dated).toLocaleDateString("es-AR", { weekday: "long" }) : "";
          return {
            id: tx.id ?? `${tx.account_id}-${Math.random().toString(36).slice(2, 8)}`,
            label: normalizeLabel(tx),
            amount: tx.__amount,
            weekday: weekdayName,
            dated: tx.__dated ?? null,
          };
        });

        setAllItems(mapped);
        setTotalPages(Math.max(1, Math.ceil(mapped.length / perPage)));
        setPage(1);
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

  useEffect(() => {
    const normalizeForSearch = (s: string) =>
      s.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

    const prevSearch = prevSearchRef.current;
    const prevApplied = prevAppliedRef.current;
    if ((searchQuery || prevSearch) && searchQuery !== prevSearch) {
      prevSearchRef.current = searchQuery ?? null;
      if (page !== 1) {
        setPage(1);
        return;
      }
    }
    if ((appliedPeriod || prevApplied) && appliedPeriod !== prevApplied) {
      prevAppliedRef.current = appliedPeriod;
      if (page !== 1) {
        setPage(1);
        return;
      }
    }

    const qNorm = searchQuery?.trim() ? normalizeForSearch(String(searchQuery)) : null;

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
    } else if (appliedPeriod === "last_week") setDaysBack(7);
    else if (appliedPeriod === "last_15_days") setDaysBack(15);
    else if (appliedPeriod === "last_month") setDaysBack(30);
    else if (appliedPeriod === "last_year") setDaysBack(365);

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

  return (
    <Sheet sx={{ height: "100%", overflow: "auto", width: "100%" }}>
      <Table className={style["table-container"]} stickyHeader stickyFooter>
        <thead>
          <tr>
            <th>
              <div className={style["thead-row"]}>
                <div className={style.title}>Tu actividad</div>
                {showControls && (
                  <div className={style.filter}>
                    <button
                      type="button"
                      className={
                        appliedPeriod !== INITIAL_PERIOD
                          ? `${style.filterButton} ${style.filterActive}`
                          : style.filterButton
                      }
                      onClick={() => {
                        setStagedSelectedPeriod(appliedPeriod);
                        setShowFilterModal(true);
                      }}
                    >
                      {appliedPeriod !== INITIAL_PERIOD ? "Filtrado" : "Filtrar"} <Filter fontSize={25} />
                    </button>
                  </div>
                )}
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          {activityItems.map((row) => (
            <tr
              key={String(row.id)}
              className={style.row}
              role="button"
              tabIndex={0}
              onClick={() => {
                if (!accountId) return;
                router.push(
                  `/activityDetail?account_id=${encodeURIComponent(String(accountId))}&transaction_id=${encodeURIComponent(
                    String(row.id)
                  )}`
                );
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  if (!accountId) return;
                  router.push(
                    `/activityDetail?account_id=${encodeURIComponent(String(accountId))}&transaction_id=${encodeURIComponent(
                      String(row.id)
                    )}`
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
                    <span className={row.amount < 0 ? style.negativeAmount : style.positiveAmount}>
                      {row.amount < 0 ? "-" : "+"}$
                      {Math.abs(row.amount).toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
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
              {showControls ? (
                <div className={style.pagination}>
                  {totalPages > 0
                    ? Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        className={n === page ? `${style.pageButton} ${style.active}` : style.pageButton}
                        onClick={() => setPage(n)}
                      >
                        {n}
                      </button>
                    ))
                    : <span />}
                </div>
              ) : (
                <Link href="/activity">
                  <div className={style.footerLink}>
                    <span>Ver toda tu actividad</span>
                    <Arrow />
                  </div>
                </Link>
              )}
            </td>
          </tr>
        </tfoot>
      </Table>
      {showFilterModal && (
        <div
          className={modalStyle.overlay}
          role="dialog"
          aria-modal="true"
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target === e.currentTarget) setShowFilterModal(false);
          }}
        >
          <div
            className={modalStyle.modal}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              e.stopPropagation();
            }}
          >
            <div className={modalStyle.header}>
              <div className={modalStyle.title}>Período</div>
              <button
                className={modalStyle.clear}
                onClick={() => {
                  setStagedSelectedPeriod(INITIAL_PERIOD);
                  setAppliedPeriod(INITIAL_PERIOD);
                  setShowFilterModal(false);
                }}
              >
                Borrar filtros
              </button>
            </div>

            <div className={modalStyle.list}>
              <label className={modalStyle.row}>
                <input
                  ref={modalFirstInputRef}
                  type="radio"
                  name="period"
                  checked={stagedSelectedPeriod === "today"}
                  onChange={() => setStagedSelectedPeriod("today")}
                />
                <span>Hoy</span>
              </label>
              <label className={modalStyle.row}>
                <input
                  type="radio"
                  name="period"
                  checked={stagedSelectedPeriod === "yesterday"}
                  onChange={() => setStagedSelectedPeriod("yesterday")}
                />
                <span>Ayer</span>
              </label>
              <label className={modalStyle.row}>
                <input
                  type="radio"
                  name="period"
                  checked={stagedSelectedPeriod === "last_week"}
                  onChange={() => setStagedSelectedPeriod("last_week")}
                />
                <span>Última semana</span>
              </label>
              <label className={modalStyle.row}>
                <input
                  type="radio"
                  name="period"
                  checked={stagedSelectedPeriod === "last_15_days"}
                  onChange={() => setStagedSelectedPeriod("last_15_days")}
                />
                <span>Últimos 15 días</span>
              </label>
              <label className={modalStyle.row}>
                <input
                  type="radio"
                  name="period"
                  checked={stagedSelectedPeriod === "last_month"}
                  onChange={() => setStagedSelectedPeriod("last_month")}
                />
                <span>Último mes</span>
              </label>
              <label className={modalStyle.row}>
                <input
                  type="radio"
                  name="period"
                  checked={stagedSelectedPeriod === "last_year"}
                  onChange={() => setStagedSelectedPeriod("last_year")}
                />
                <span>Último año</span>
              </label>
              <label className={modalStyle.row}>
                <input
                  type="radio"
                  name="period"
                  checked={stagedSelectedPeriod === "other"}
                  onChange={() => setStagedSelectedPeriod("other")}
                />
                <span>Otro período</span>
              </label>
            </div>

            <div className={modalStyle.footer}>
              <button
                className={modalStyle.apply}
                onClick={() => {
                  setAppliedPeriod(stagedSelectedPeriod);
                  setShowFilterModal(false);
                }}
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </Sheet>
  );
}
