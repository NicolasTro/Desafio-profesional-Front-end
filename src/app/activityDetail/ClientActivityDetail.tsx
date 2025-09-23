"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./styles/activity-detail.module.css";
import PageHeader from "@/Components/PageHeader";

type Transaction = Record<string, unknown> | null;

export default function ClientActivityDetail() {
  const search = useSearchParams();
  const router = useRouter();
  const accountId = search.get("account_id");
  const transactionId = search.get("transaction_id");

  const [tx, setTx] = useState<Transaction>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accountId || !transactionId) {
      setError("Faltan parámetros");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    fetch(`/api/accounts/${encodeURIComponent(accountId)}/transactions/${encodeURIComponent(transactionId)}`, { cache: "no-store" })
      .then(async res => {
        if (!res.ok) throw new Error(await res.text().catch(() => res.statusText || "Error"));
        return res.json();
      })
      .then(data => setTx(data))
      .catch(err => setError(String(err.message || err)))
      .finally(() => setLoading(false));
  }, [accountId, transactionId]);

  if (loading) return <div className={styles.container}>Cargando...</div>;
  if (error) return <div className={styles.container}>Error: {error}</div>;
  if (!tx) return <div className={styles.container}>Transacción no encontrada</div>;

  const raw = tx as Record<string, unknown>;
  const record = (raw && typeof raw === "object")
    ? ((raw.transaction as Record<string, unknown>) || (raw.data as Record<string, unknown>) || raw)
    : raw;

  const status = String(record?.status ?? "Aprobada");
  const title = String((record?.title as string) || (record?.description as string) || "Transferencia de dinero");

  const amountCandidate = record?.amount as unknown;
  const amountNum = typeof amountCandidate === "number" ? (amountCandidate as number) : Number(amountCandidate as string);
  const amount = Number.isFinite(amountNum) ? amountNum : 0;
  const formattedAmount = amount.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const destinationCandidate = (record?.destination as string) || (record?.to_name as string) || (record?.recipient as string) || (record?.payee as string) || (record?.counterparty as string) || (record?.origin as string) || "";
  const destination = String(destinationCandidate || "");

  const operationNumber = String((record?.id as string) || (record?.operation_number as string) || transactionId || "");
  const dateStr = record?.dated ? new Date(String(record.dated)).toLocaleString("es-AR") : "";

  return (
    <div className={styles.page}>
      <div className="">
        <PageHeader nombre="Tu actividad" />
      </div>

      <div className={styles.card}>
        <div className={styles.cardStatus}>
          <div className={styles.check}>✓</div>
          <div className={styles.statusText}>{status}</div>
        </div>

        <hr className={styles.sep} />

        <div className={styles.cardBody}>
          <div className={styles.created}>Creada el {dateStr}</div>
          <div className={styles.title}>{title}</div>
          <div className={styles.amount}>${formattedAmount}</div>
          {destination ? <div className={styles.toLabel}>Le transferiste a<br/><strong>{destination}</strong></div> : null}
          <div className={styles.opNumber}>Número de operación<br/>{operationNumber}</div>
        </div>
      </div>

      <button className={styles.primary}>Descargar comprobante</button>
      <button className={styles.secondary} onClick={() => router.push("/")}>Ir al inicio</button>
    </div>
  );
}
