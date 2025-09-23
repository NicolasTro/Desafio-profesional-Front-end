import React from "react";
import styles from "../styles/CardTransfer.module.css";
import EditorTransfer from "../../../../../public/EditorTransfer.svg";

type ConfirmCardProps = {
  amount: number;
  cvu: string;
  variant?: "confirm" | "success";
  dated?: string | null;
  // called when user clicks Transferir inside this component
  onConfirm?: () => void;
  // called when user wants to go back to step 1 (clicking the edit icon)
  onBack?: () => void;
  // whether the parent is currently submitting
  isSubmitting?: boolean;
};

export default function ConfirmCard({
  amount,
  cvu,
  variant = "confirm",
  dated,
  onConfirm,
  onBack,
  isSubmitting,
}: ConfirmCardProps) {
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

  return (
    <div className={`${styles.step2} ${variant === "success" ? styles["success-variant"] : ""}`}>
      <div className={styles["step2-header"]}>
        <h2>Revisá que está todo bien</h2>
      </div>

      <hr />

      <div className={styles["step2-body"]}>
        <div className="flex flex-col gap-2">
          <div className={styles["step2-body-header"]}>
            {variant === "confirm" ? (
              <div className="flex gap-4 items-center">
                <h3>Vas a transferir</h3>
                <button
                  type="button"
                  aria-label="Editar transferencia"
                  onClick={() => {
                    if (onConfirm) {
                      // leave onConfirm untouched
                    }
                    if (typeof onBack === "function") onBack();
                  }}
                  style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer" }}
                >
                  <EditorTransfer fontSize={30} color="var(--lima)" />
                </button>
              </div>
            ) : (
              <div>
                <p>{dated ? formatDatedEsAR(dated) : ""}</p>
              </div>
            )}
          </div>

          <div
            className={
              variant === "confirm"
                ? styles["step2-amount"]
                : styles["step3-color"]
            }
          >
            {"$" + amount}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="text-[12px]">Para</h4>
          <h2
            className={`text-[20px] ${variant === "confirm" ? "" : styles["step3-color"]
              }`}
          >
            Cuenta propia
          </h2>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[16px]">Brubank</p>
          <div className="flex gap-2">
            <p>CVU</p>
            <div>{cvu}</div>
          </div>
        </div>

        {variant === "confirm" && (
          <button
            type="button"
            className={`${styles["button-select"]} ${styles["button-step"]}`}
            onClick={() => {
              console.log("ConfirmCard: internal Transferir clicked");
              if (onConfirm) onConfirm();
            }}
            disabled={isSubmitting}
          >
            <span>{isSubmitting ? "Procesando..." : "Transferir"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
