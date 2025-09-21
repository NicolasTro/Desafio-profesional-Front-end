import React from "react";
import styles from "../styles/CardTransfer.module.css";
import EditorTransfer from "../../../../../public/EditorTransfer.svg";

export default function ConfirmCard({
  amount,
  cvu,
  variant = "confirm",
  dated
}: {
  amount: number;
  cvu: string;
  variant?: "confirm" | "success";
  dated?: string | null;
}) {

  const formatDatedEsAR = (d?: string | null) => {
    if (!d) return "";
    try {
      const date = new Date(d);
      const datePart = new Intl.DateTimeFormat("es-AR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      }).format(date);
      const timePart = new Intl.DateTimeFormat("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }).format(date);
      return `${datePart} a ${timePart} hs`;
    } catch (e) {
      void e;
      return d || "";
    }
  };

  return (
    <div className={styles.step2}>
      <div className={styles["step2-header"]}>
        <h2>Revisá que está todo bien</h2>
      </div>

      <hr />

      <div className={styles["step2-body"]}>
        <div className="flex flex-col gap-2">
          <div className={styles["step2-body-header"]}>
            {variant === "confirm"
              ? <div className="flex gap-4 items-center">
                  <h3>Vas a transferir</h3>
                  <EditorTransfer fontSize={30} color="var(--lima)" />
                </div>
              : <div>
                  <p>
                    {dated ? formatDatedEsAR(dated) : ""}
                  </p>
                </div>}
          </div>

          <div className={variant === "confirm" ? styles["step2-amount"] : styles["step3-color"]}>
            {"$" + amount}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="text-[12px]">Para</h4>
          <h2 className={`text-[20px] ${variant === "confirm" ? "" : styles["step3-color"]}`}>Cuenta propia</h2>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[16px]">Brubank</p>
          <div className="flex gap-2">
            <p>CVU</p>
            <div>
              {cvu}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
