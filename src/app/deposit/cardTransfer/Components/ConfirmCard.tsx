import React from "react";
import styles from "../styles/CardTransfer.module.css";
import EditorTransfer from "../../../../../public/EditorTransfer.svg";
import { usePathname } from "next/navigation";

type ConfirmCardProps = {
  amount: number;
  cvu: string;
  variant?: "confirm" | "success";
  dated?: string | null;
  description?: string | null;
  // called when user clicks Transferir inside this component
  onConfirm?: () => void;
  // called when user wants to go back to step 1 (clicking the edit icon)
  onBack?: () => void;
  // whether the parent is currently submitting
  isSubmitting?: boolean;
  // payment method info for success view
  paymentMethod?: "wallet" | "card";
  walletBalance?: number;
  cardBrand?: string;
  cardLast4?: string;
  // optional download handler for receipt (not used inside component; kept for extensibility)
  onDownload?: () => void;
  // optional: when coming from services flow, the service name to display
  serviceName?: string;
};

export default function ConfirmCard({
  amount,
  cvu,
  variant = "confirm",
  dated,
  description,
  onConfirm,
  onBack,
  isSubmitting,
  paymentMethod,
  walletBalance,
  cardBrand,
  cardLast4,
  serviceName,
}: ConfirmCardProps) {
  const pathname = usePathname();
  const isServices = Boolean(
    pathname && ["service", "services", "servicio", "servicios"].some((seg) => pathname.toLowerCase().includes(seg)),
  );
  const formatDatedEsAR = (d?: string | null) => {
    if (!d) return "";
    try {
      const date = new Date(d); // ISO string parseado por JS
      const datePart = new Intl.DateTimeFormat("es-AR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(date);
      const timePart = new Intl.DateTimeFormat("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(date);
      return `${datePart} a ${timePart} hs`;
    } catch {
      return d || "";
    }
  };

  const formatCurrency = (n: number | undefined | null) => {
    const value = Number(n ?? 0);
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className={`${styles.step2} ${variant === "success" ? styles["success-variant"] : ""}`}>
      {/* success variant: show dated and amount, no header nor divider */}
      {variant === "success" ? (
        <div className={styles["step2-body"]}>
          <div className="flex flex-col gap-2">
            <div>
              <p>{dated ? formatDatedEsAR(dated) : ""}</p>
            </div>

            <div className={styles["step3-color"]}>{formatCurrency(amount)}</div>
          </div>

          { (isServices || serviceName) ? (
            <>
              <div className="flex flex-col gap-2">
                <h4 className="text-[12px]">Para</h4>
                <h2 className={`text-[20px] ${styles["step3-color"]}`}>{serviceName ?? "Servicio"}</h2>
                {description ? <div style={{ fontSize: 14 }}>{description}</div> : null}
              </div>

              <div className="flex flex-col gap-2">
                {/* Payment method details for services: show card/wallet info */}
                {paymentMethod === "wallet" ? (
                  <>
                    <p className="text-[16px]">Billetera</p>
                    <div style={{ fontSize: 14 }}>Saldo: {formatCurrency(walletBalance)}</div>
                  </>
                ) : (
                  <>
                    <p className="text-[16px]">Tarjeta</p>
                    <div className="flex flex-col">
                      <div style={{ textTransform: "capitalize" }}>{cardBrand ?? "Tarjeta"}</div>
                      <div>{`**** ${cardLast4 ?? ""}`}</div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <h4 className="text-[12px]">Para</h4>
                <h2 className={`text-[20px] ${styles["step3-color"]}`}>Cuenta propia</h2>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-[16px]">Brubank</p>
                <div style={{ fontSize: 14 }}>{cvu}</div>
              </div>
            </>
          )}
        </div>
      ) : (
        <>
          <div className={styles["step2-header"]}>
            <h2>Revisá que está todo bien</h2>
          </div>

          <hr />

          <div className={styles["step2-body"]}>
            <div className="flex flex-col gap-2">
              <div className={styles["step2-body-header"]}>
                <div className="flex gap-4 items-center">
                  <h3>Vas a transferir</h3>
                  <button
                    type="button"
                    aria-label="Editar transferencia"
                    onClick={() => {
                      if (onConfirm) {
                      }
                      if (typeof onBack === "function") onBack();
                    }}
                    style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", boxShadow: "none" }}
                     
                  >
                    <EditorTransfer fontSize={30} color="var(--lima)" />
                  </button>
                </div>
              </div>

              <div className={styles["step2-amount"]}>{formatCurrency(amount)}</div>
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-[12px]">Para</h4>
              <h2 className={`text-[20px] ${styles["step3-color"]}`}>Cuenta propia</h2>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-[16px]">Brubank</p>
              <div className="flex gap-2">
                <p>CVU</p>
                <div>{cvu}</div>
              </div>
            </div>

            <button
              type="button"
              className={` ${styles["button-step"]}`}
              onClick={() => {
                console.log("ConfirmCard: internal Transferir clicked");
                if (onConfirm) onConfirm();
              }}
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? "Procesando..." : "Transferir"}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
