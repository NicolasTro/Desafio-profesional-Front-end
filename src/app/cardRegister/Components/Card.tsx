"use client";
import { useState, useEffect } from "react";
import { useAppContext } from "@/Context/AppContext";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import InputCard from "./InputCard";
import style from "./card.module.css";

export default function CardForm() {
  const [form, setForm] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    focus: ""
  });

  const { userInfo, refreshSession } = useAppContext();
  const [cardsCount, setCardsCount] = useState<number | null>(null);

  // fetch existing cards count on mount/user change
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!userInfo) return;
      const accountId = userInfo.account_id || userInfo.id;
      if (!accountId) return;
      try {
        const res = await fetch(`/api/accounts/${accountId}/cards`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        if (Array.isArray(data)) setCardsCount(data.length);
        else if (data?.cards && Array.isArray(data.cards)) setCardsCount(data.cards.length);
      } catch {
        // ignore fetch errors; leave cardsCount null
      }
    })();
    return () => { mounted = false; };
  }, [userInfo]);

  // ===== helpers
  const onlyDigits = (s: string) => (s || "").replace(/\D/g, "");

  const formatCardNumber = (value: string) => {
    const v = onlyDigits(value).slice(0, 16);
    const groups = v.match(/.{1,4}/g);
    return groups ? groups.join(" ") : "";
  };

  const formatExpiry = (value: string) => {
    const v = onlyDigits(value).slice(0, 4); // MMYY
    if (!v) return "";
    if (v.length <= 2) return v; // MM
    return `${v.slice(0, 2)}/${v.slice(2, 4)}`; // MM/YY
  };

  const formatCvc = (value: string) => onlyDigits(value).slice(0, 4);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let next = value;
    if (name === "number") next = formatCardNumber(value);
    if (name === "expiry") next = formatExpiry(value);
    if (name === "cvc") next = formatCvc(value);
    setForm(s => ({ ...s, [name]: next }));
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) =>
    setForm(s => ({ ...s, focus: e.target.name }));

  // ===== Validaciones
  const luhnValid = (num: string) => {
    const n = onlyDigits(num);
    if (n.length < 12) return false; // mínimo razonable
    let sum = 0,
      dbl = false;
    for (let i = n.length - 1; i >= 0; i--) {
      let d = parseInt(n[i], 10);
      if (dbl) {
        d *= 2;
        if (d > 9) d -= 9;
      }
      sum += d;
      dbl = !dbl;
    }
    return sum % 10 === 0;
  };

  const expiryValid = (exp: string) => {
    const m = exp.match(/^(\d{2})\/(\d{2})$/);
    if (!m) return false;
    const [, MM, YY] = m;
    const month = parseInt(MM, 10);
    if (month < 1 || month > 12) return false;
    // Asumimos 20YY (funciona hasta 2099)
    const year = 2000 + parseInt(YY, 10);
    const now = new Date();
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);
    return endOfMonth >= now;
  };

  const nameValid = (name: string) => name.trim().length >= 3;
  const cvcValid = (c: string) => /^(\d{3,4})$/.test(c);

  const isFormValid =
    luhnValid(form.number) &&
    expiryValid(form.expiry) &&
    cvcValid(onlyDigits(form.cvc)) &&
    nameValid(form.name);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;

    // Prevent creating more than 10 cards
    if (cardsCount !== null && cardsCount >= 10) {
      window.alert('Has alcanzado el límite de 10 tarjetas. No puedes registrar más.');
      return;
    }

    console.log("userInfo from context:", userInfo);

    let accountId = userInfo ? userInfo.account_id || userInfo.id : undefined;

    if (!accountId) {
      try {
        refreshSession();
        if (userInfo) {
          accountId = userInfo.id;
        }
      } catch (err) {
        console.debug("refreshSession failed", err);
      }
    }

    if (!accountId) {
      console.error("No accountId available in context or session");
      return;
    }

    const expiryParts = form.expiry.split("/");
    const expiration_date =
      expiryParts.length === 2
        ? `${expiryParts[0]}/20${expiryParts[1]}`
        : form.expiry;

    const payload = {
      cod: onlyDigits(form.cvc),
      expiration_date,
      first_last_name: form.name,
      number_id: form.number.replace(/\s/g, "")
    };

    console.debug("Posting card payload to proxy", { accountId, payload });

    try {
      const response = await fetch(`/api/accounts/${accountId}/cards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "<no response body>");
        console.error("Upstream response error:", response.status, text);
        window.alert(`Error al crear la tarjeta: ${response.status} - ${text}`);
        return;
      }

      const data = await response.json();
      console.log("Éxito:", data);
      window.alert("Tarjeta creada correctamente");
    } catch (error) {
      console.error("Error creando tarjeta:", error);
      window.alert(
        "Error al crear la tarjeta. Revisa la consola para más detalles."
      );
    }
  };

  return (
    <div className={style["card-container"]}>
      <form className={style["card-form-container"]} onSubmit={handleSubmit}>
        {cardsCount !== null && cardsCount >= 10 && (
          <div className={style["limit-banner"]} role="status">
            Has alcanzado el límite de 10 tarjetas. No puedes registrar más.
          </div>
        )}
        <div className={style["card-preview"]}>
          <Cards
            number={form.number}
            name={form.name}
            expiry={form.expiry}
            cvc={form.cvc}
          
            locale={{ valid: "VENCE" }}
            placeholders={{ name: "NOMBRE DEL TITULAR" }}
          />

          <div className={style["row-inputs1"]}>
            <InputCard
              data={{
                type: "tel",
                inputMode: "numeric",
                name: "number",
                placeholder1: "Número de la tarjeta*",
                placeholder2: "",
                autoComplete: "cc-number",
                value: form.number,
                className: `${style["input-card"]} ${style["placeholder"]}`,
                handleInputChange,
                handleInputFocus
              }}
            />

            <InputCard
              data={{
                type: "text",
                inputMode: "text",
                name: "name",
                placeholder1: "Nombre y apellido*",
                placeholder2: "",
                autoComplete: "cc-name",
                value: form.name,
                className: `${style["input-card"]}`,
                handleInputChange,
                handleInputFocus
              }}
            />
          </div>
          <div className={style["row-inputs2"]}>
            <InputCard
              data={{
                type: "text",
                inputMode: "text",
                name: "expiry",
                placeholder1: "Fecha de",
                placeholder2: "vencimiento (MM/YY)",
                autoComplete: "cc-exp",
                value: form.expiry,
                className: `${style["input-card"]}`,
                handleInputChange,
                handleInputFocus
              }}
            />

            <InputCard
              data={{
                type: "tel",
                inputMode: "numeric",
                name: "cvc",
                placeholder1: "Código de ",
                placeholder2: "seguridad*",
                autoComplete: "cc-csc",
                value: form.cvc,
                className: `${style["input-card"]}`,
                handleInputChange,
                handleInputFocus
              }}
            />
          </div>

          <div className={style["button-container"]}>
            <div className={style["button-content"]}>
              <div className={style["card-left"]}></div>
              <button
                type="submit"
                disabled={!isFormValid || (cardsCount !== null && cardsCount >= 10)}
                className={`w-full rounded-xl px-4 py-3 font-semibold shadow-md transition-all ${isFormValid && !(cardsCount !== null && cardsCount >= 10)
                  ? "bg-lime-400 hover:bg-lime-300 active:scale-[0.99]"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
