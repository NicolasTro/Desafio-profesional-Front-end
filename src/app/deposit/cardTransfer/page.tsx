"use client";
import PageHeader from "@/Components/PageHeader";
import { useAppContext } from "@/Context/AppContext";
import { useRouter } from "next/navigation";
import React from "react";
import AddCard from "../../../../public/addCard.svg";
import TransferModule from "@/Components/TransferModule";
import CardsSelector from "./Components/CardsSelector";
import styles from "./styles/CardTransfer.module.css";
import ConfirmCard from "./Components/ConfirmCard";
import Success from "../../../../public/Success.svg";

export default function CardTransfer() {
  const { userInfo, account, refreshSession } = useAppContext();

  // Steps: 0 = select card, 1 = enter amount, 2 = confirm, 3 = success
  const [step, setStep] = React.useState<number>(0);
  type Card = { id: number; number_id?: string | number };
  const [selectedCard, setSelectedCard] = React.useState<Card | null>(null);
  const [amount, setAmount] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  type Transaction = {
    account_id: number;
    amount: number;
    dated?: null;
    description?: string;
    destination?: string;
    id: number;
    origin?: string;
    type?: string;
  };
  const [transaction, setTransaction] = React.useState<Transaction | null>(
    null,
  );

  // prefer the explicit account object (AccountData) for account-scoped fields
  const accountId = account?.account_id ?? (userInfo && (userInfo as { account_id?: string }).account_id);

  const goNext = () => setStep((step) => Math.min(3, step + 1));

  const handleSelect = (card: Card | null) => {
    setSelectedCard(card);
  };

  const handleAmountChange = (v: string) => {
    // allow only numbers and dot
    setAmount(v.replace(/[^\d.]/g, ""));
  };

  const canContinueFromSelect = !!selectedCard;
  const numericAmount = parseFloat(amount || "0");
  const canContinueFromAmount = numericAmount > 0;

  const cvu = (account && account.cvu) || "No disponible";

  const handleConfirm = async () => {
    console.log("handleConfirm called", { accountId, numericAmount, selectedCard });

    if (!accountId) {
      try {
        const Swal = (await import("sweetalert2")).default;
        await Swal.fire({
          icon: "warning",
          title: "Cuenta no encontrada",
          text: "No se encontró la cuenta. Intenta recargar la sesión.",
          confirmButtonText: "Cerrar",
          customClass: {
            popup: "swal-popup",
            title: "swal-title",
            htmlContainer: "swal-html",
            confirmButton: "swal-confirm",
          },
        });
      } catch (err) {
        console.warn("Swal failed to load for account not found:", err);
      }
      return;
    }

    if (numericAmount <= 0) {
      try {
        const Swal = (await import("sweetalert2")).default;
        await Swal.fire({
          icon: "warning",
          title: "Monto inválido",
          text: "Ingresa un monto mayor a 0 para continuar.",
          confirmButtonText: "Cerrar",
          customClass: {
            popup: "swal-popup",
            title: "swal-title",
            htmlContainer: "swal-html",
            confirmButton: "swal-confirm",
          },
        });
      } catch (err) {
        console.warn("Swal failed to load for invalid amount:", err);
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const body = {
        amount: numericAmount,
        source_card_id: selectedCard ? selectedCard.id : undefined,
      };
      const res = await fetch(`/api/accounts/${accountId}/deposits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        console.error("Deposit failed", await res.text().catch(() => ""));
        setIsSubmitting(false);
        return;
      }
      const data = (await res.json().catch(() => null)) as Transaction | null;
      setTransaction(data);
      // refresh the session so AppContext.account is updated with the new balance
      try {
        if (typeof refreshSession === "function") await refreshSession();
      } catch (e) {
        console.warn("refreshSession failed after deposit", e);
      }
      setStep(3);
    } catch (e) {
      console.error("Error posting deposit", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <PageHeader nombre="Cargar dinero" />
      </div>
      <TransferModule
        header={
          step === 3 ? (
            <div className={styles.successHeader}>
              <Success fontSize={40} color="dark" />
              <div>Ya cargamos el dinero en tu cuenta</div>
            </div>
          ) : null
        }
        main={
          step === 0 ? (
            <div className={styles.step0}>
              <h2 className={styles.stepTitle}>Seleccionar tarjeta</h2>
              <div className={styles["card-selector"]}>
                <CardsSelector
                  onSelect={handleSelect}
                  selectedId={selectedCard ? selectedCard.id : null}
                />
              </div>

              <div className={styles["new-card"]}>
                <div
                  className={styles["add-card"]}
                  onClick={() => router.push("/cardRegister")}
                >
                  <AddCard fontSize={40} />
                  <h2>Nueva tarjeta</h2>
                </div>



                <div
                  className={
                    step < 3
                      ? `${styles["button-select"]} ${"w-full"} ${styles["button-step"]}`
                      : styles["button-select"]
                  }
                >
                  <button
                    disabled={!canContinueFromSelect}
                    onClick={() => goNext()}
                    value="Continuar"
                    className={!canContinueFromSelect ? styles["btn-disabled"] : styles["btn-enabled"]}
                  >
                    Continuar
                  </button>
                </div>
              </div>
            </div>
          ) : step === 1 ? (
            <div className={styles.step1}>

              <h2 className={styles["font-size"]}>
                ¿Cuánto querés <br className={styles.br} /> ingresar a la
                cuenta?
              </h2>

              <div className={`${styles["amount-input"]}`}>

                <span>$</span>
                <input
                  className={`${styles["input-inside"]} ${styles["font-size"]}`}
                  aria-label="Monto a ingresar"
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="0"
                />

              </div>


              <div className={
                step < 3
                  ? `${styles["button-select"]} ${"w-full"} ${styles["button-step"]}`
                  : styles["button-select"]
              }
              
              >
                <button
                  disabled={!canContinueFromAmount}
                  onClick={() => goNext()}
                  value="Continuar"
                  className={!canContinueFromAmount ? styles["btn-disabled"] : styles["btn-enabled"]}
                >
                  Continuar
                </button>
              </div>

            </div>

          ) : step === 2 ? (
            <ConfirmCard amount={numericAmount} cvu={cvu} variant="confirm" onConfirm={handleConfirm} onBack={() => setStep(1)} isSubmitting={isSubmitting} />
          ) : (
            <ConfirmCard
              amount={numericAmount}
              cvu={cvu}
              variant="success"
              dated={transaction?.dated ?? ""}
              isSubmitting={isSubmitting}
              description={transaction?.description ?? ""}

            />
          )
        }
        aside={
          <div
            className={
              step < 3
                ? `${styles["button-select"]} ${styles["button-width"]} ${styles["button-hide"]}`
                : styles["button-select"]
            }
          >
            {step === 0 && (
              <button
                disabled={!canContinueFromSelect}
                onClick={() => goNext()}
                value="Continuar"
                className={!canContinueFromSelect ? `${styles["button-hide"]} ${styles["btn-disabled"]}` : `${styles["button-hide"]} ${styles["btn-enabled"]}`}
              >
                Continuar
              </button>
            )}

            {step === 1 && (
              <button
                disabled={!canContinueFromAmount}
                onClick={() => goNext()}
                className={!canContinueFromAmount ? styles["btn-disabled"] : styles["btn-enabled"]}
              >
                Continuar
              </button>
            )}
            {step === 2 && (
              <button onClick={handleConfirm} disabled={isSubmitting} className={isSubmitting ? styles["btn-disabled"] : styles["btn-enabled"]}>
                {isSubmitting ? "Procesando..." : "Continuar"}
              </button>
            )}

            {step === 3 &&

              <div className={styles["button-step3"]}>
                <button
                  className={styles["change-color"]}
                  onClick={() => router.push("/home")}
                >
                  Ir al inicio
                </button>
                <button className={styles["step3-color"]}>Descargar comprobante</button>
              </div>
            }
          </div>
        }
      />
    </div>
  );
}
