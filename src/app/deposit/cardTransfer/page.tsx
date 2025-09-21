"use client";
import PageHeader from "@/Components/PageHeader";
import { useAppContext } from "@/Context/AppContext";
import { useRouter } from "next/navigation";
import React from "react";
import AddCard from "../../../../public/addCard.svg";
import TransferModule from "../Components/TransferModule";
import CardsSelector from "./Components/CardsSelector";
import styles from "./styles/CardTransfer.module.css";
import ConfirmCard from "./Components/ConfirmCard";
import Success from "../../../../public/Success.svg"

export default function CardTransfer() {
  const { userInfo } = useAppContext();

  // Steps: 0 = select card, 1 = enter amount, 2 = confirm, 3 = success
  const [step, setStep] = React.useState<number>(0);
  type Card = { id: number; number_id?: string | number };
  const [selectedCard, setSelectedCard] = React.useState<Card | null>(null);
  const [amount, setAmount] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  type Transaction = {
    account_id: number;
    amount: number;
    dated?: string | null;
    description?: string;
    destination?: string;
    id: number;
    origin?: string;
    type?: string;
  };
  const [transaction, setTransaction] = React.useState<Transaction | null>(null);

  const accountId =
    userInfo && (userInfo as { account_id?: string }).account_id;

  const goNext = () => setStep(step => Math.min(3, step + 1));

  const handleSelect = (card: Card | null) => {
    setSelectedCard(card);
  };

  const handleAmountChange = (v: string) => {
    // allow only numbers and dot
    setAmount(v);
  };

  const canContinueFromSelect = !!selectedCard;
  const numericAmount = parseFloat(amount || "0");
  const canContinueFromAmount = numericAmount > 0;



  const cvu = (userInfo && userInfo.cvu) || "No disponible";

  const handleConfirm = async () => {
    if (!accountId) return;
    setIsSubmitting(true);
    try {
      const body = {
        amount: numericAmount,
        source_card_id: selectedCard ? selectedCard.id : undefined
      };
      const res = await fetch(`/api/accounts/${accountId}/deposits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        // show an error minimally
        console.error("Deposit failed", await res.text().catch(() => ""));
        setIsSubmitting(false);
        return;
      }

      // parse and save the created transaction so we can show dated, id, etc.
  const data = (await res.json().catch(() => null)) as Transaction | null;
  setTransaction(data);
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
          step === 3 && (
            <div className={styles.successHeader}>
              
                <Success fontSize={40} color="dark" />
              

              <div>Ya cargamos el dinero en tu cuenta</div>
            </div>
          )
        }
        main={
          step === 0
            ? <div className={styles.step0}>
                <h2 className={styles.stepTitle}>Seleccionar tarjeta</h2>

                <div className={styles["card-selector"]}>
                  <CardsSelector
                    onSelect={handleSelect}
                    selectedId={selectedCard ? selectedCard.id : null}
                  />
                </div>
                <div
                  className={styles["add-card"]}
                  onClick={() => router.push("/cardRegister")}
                >
                  <AddCard fontSize="40" />
                  <h2>Nueva tarjeta</h2>
                </div>
              </div>
            : step === 1
              ? <div className={styles.step1}>
                  <h2>
                    ¿Cuánto querés <br className={styles.br} /> ingresar a la
                    cuenta?
                  </h2>
                  <div className={styles["amount-input"]}>
                    <span>$</span>
                    <input
                      className={styles["input-inside"]}
                      aria-label="Monto a ingresar"
                      type="number"
                      min="0"
                      value={amount}
                      onChange={e => handleAmountChange(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
              : step === 2
                ? <ConfirmCard
                    amount={numericAmount}
                    cvu={cvu}
                    variant="confirm"
                  />
                : 
                    <ConfirmCard
                      amount={numericAmount}
                      cvu={cvu}
                      variant="success"
                      dated={transaction?.dated}
                    />
                  
        }
        aside={

            <div className={step < 3 ? `${styles["button-select"]} ${styles["button-width"]}` : styles["button-select"]} >
              {step === 0 &&
                <button
                  disabled={!canContinueFromSelect}
                  onClick={() => goNext()}
                  value="Continuar"
                >
                 Continuar
                </button>
                }
              {step === 1 &&
                <button
                  // className="primary"
                  disabled={!canContinueFromAmount}
                  onClick={() => goNext()}
                
                >
Continuar
</button>
                 
                }
              {step === 2 &&
                <button
                  // className="primary"
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  
                  >

                  {isSubmitting ? "Procesando..." : "Continuar"}

                </button>
                  
                }
                {step === 3 && 
                <button>{"Descargar comprobante"}</button>                
                  
                }
            </div>
          
        }
        footer={
          step === 3 && (
            <div className={styles["button-select"]}>
              <button className="bg-[var(--editGrey)]" onClick={() => router.push("/home")}>Ir al inicio</button>
            </div>
          )
        }
      />
    </div>
  );
}
