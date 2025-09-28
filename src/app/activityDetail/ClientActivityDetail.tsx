"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./styles/ActivityDetail.module.css"
import Spinner from "@/Components/Spinner";
import PageHeader from "@/Components/PageHeader";
import SuccessIcon from "../../../public/Success.svg"

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

  if (loading) return (
    <div className={styles.page} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60dvh' }}>
      <Spinner />
    </div>
  );
  if (error) return <div className={styles.page}>Error: {error}</div>;
  if (!tx) return <div className={styles.page}>Transacción no encontrada</div>;

  const raw = tx as Record<string, unknown>;
  const record = (raw && typeof raw === "object")
    ? ((raw.transaction as Record<string, unknown>) || (raw.data as Record<string, unknown>) || raw)
    : raw;

  const status = String(record?.status ?? "Aprobada");

  const amountCandidate = record?.amount as unknown;
  const amountNum = typeof amountCandidate === "number" ? (amountCandidate as number) : Number(amountCandidate as string);
  const amount = Number.isFinite(amountNum) ? amountNum : 0;
  const positiveAmount = Math.abs(amount);
  const formattedAmount = positiveAmount.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const description = String((record?.description as string) || (record?.title as string) || "");

  const destinationCandidate = (record?.destination as string) || (record?.to_name as string) || (record?.recipient as string) || (record?.payee as string) || (record?.counterparty as string) || (record?.origin as string) || "";
  const destination = String(destinationCandidate || "");

  const cvuCandidate = (record?.cvu as string) || (record?.account as string) || (record?.account_id as string) || (record?.origin as string) || (record?.destination as string) || "";
  const cvu = String(cvuCandidate || "");

  const operationNumber = String((record?.id as string) || (record?.operation_number as string) || transactionId || "");

  let datePart = "";
  let timePart = "";
  if (record?.dated) {
    const dt = new Date(String(record.dated));
    datePart = dt.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
    timePart = dt.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });
  }

  const title = String((record?.title as string) || (record?.description as string) || "");

  const typeStr = String((record?.type as string) || "").toLowerCase();
  const isTransfer = typeStr.includes("transfer") || /transfer/i.test(description) || /transfer/i.test(title || "");
  const isDeposit = typeStr.includes("deposit") || /deposit/i.test(description) || /deposit/i.test(title || "");
  const isPayment = !isTransfer && !isDeposit && (typeStr.includes("transaction") || typeStr.includes("payment") || amount < 0 || /pago|pagado|pagar|servicio/i.test(description));

  return (
    <div className={styles.page}>
      <PageHeader nombre="Tu actividad" />

      <div className={styles.card}>
        <div className={styles["card-status"]}>
          <div className={styles.check}><SuccessIcon fontSize="30px" color="var(--lima)" /></div>
          <div className={styles["status-text"]}>{status}</div>
        </div>

        <hr className={styles.sep} />

        <div className={styles["card-body"]}>
          <div className={styles.created}>Creada el {datePart}{datePart && timePart ? ` a ${timePart} hs.` : ""}</div>

          {isTransfer && (
            <>
              <div>

                <div className={styles.title}>Transferencia de dinero</div>
                <div className={styles.amount}>${formattedAmount}</div>
              </div>

              {destination ? (
                <div className={styles.toLabel}>
                  Le transferiste a<br />
                  <strong>{destination}</strong>
                </div>
              ) : (
                description ? (
                  <div className={styles.toLabel}>
                    Descripción<br />
                    <strong>{description}</strong>
                  </div>
                ) : null
              )}

              <div className={styles.opNumber}>Número de operación<br /><span>{operationNumber}</span></div>
            </>
          )}

          {isPayment && (
            <>
              <div className={styles.title}>Pago de servicio</div>
              <div className={styles.amount}>${formattedAmount}</div>
              <div className={styles.toLabel}>
                Pagaste el servicio<br />
                <strong>{description || title}</strong>
              </div>
              <div className={styles.opNumber}>Número de operación<br />{operationNumber}</div>
            </>
          )}

          {isDeposit && (
            <>
              <div className={styles.title}>Depositaste dinero</div>
              <div className={styles.amount}>${formattedAmount}</div>
              <div className={styles.toLabel}>
                CVU / Cuenta<br />
                <strong>{cvu || "-"}</strong>
              </div>
              <div className={styles.opNumber}>Número de operación<br />{operationNumber}</div>
            </>
          )}

          {!isTransfer && !isPayment && !isDeposit && (
            <>
              <div className={styles.title}>{title}</div>
              <div className={styles.amount}>${formattedAmount}</div>
              {description ? (
                <div className={styles.toLabel}>
                  Descripción<br />
                  <strong>{description}</strong>
                </div>
              ) : null}
              <div className={styles.opNumber}>Número de operación<br />{operationNumber}</div>
            </>
          )}

        </div>
      </div>
      <div className={styles["button-group"]}>

        <button className={styles.secondary} onClick={() => router.push("/home")}>Ir al inicio</button>
        <button className={styles.primary}>Descargar comprobante</button>
      </div>
    </div>
  );
}
