"use client";
import { useState, useEffect } from "react";
import { useAppContext } from "@/Context/AppContext";
import { useRouter } from "next/navigation";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import InputCard from "./InputCard";
import style from "./Card.module.css";

export default function CardForm() {
  const [cardForm, setCardForm] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    focus: "",
  });

  const { userInfo, account, refreshSession } = useAppContext();
  const router = useRouter();
  const [existingCardsCount, setExistingCardsCount] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!userInfo && !account) return;
        const accountId = account?.account_id || userInfo?.id;
      if (!accountId) return;
      try {
        const res = await fetch(`/api/accounts/${accountId}/cards`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        if (Array.isArray(data)) setExistingCardsCount(data.length);
        else if (data?.cards && Array.isArray(data.cards))
          setExistingCardsCount(data.cards.length);
      } catch {
        
      }
    })();
    return () => {
      mounted = false;
    };
  }, [userInfo, account]);

  // Devuelve sólo los caracteres numéricos de una cadena.
  // Útil para normalizar inputs que pueden contener espacios o guiones.
  const onlyDigits = (s: string) => (s || "").replace(/\D/g, "");

  const formatCardNumber = (value: string) => {
    const v = onlyDigits(value).slice(0, 16);
    const groups = v.match(/.{1,4}/g);
    return groups ? groups.join(" ") : "";
  };
  // Formatea el número de tarjeta en grupos de 4 dígitos para mostrar en el input.

  const formatExpiry = (value: string) => {
    const v = onlyDigits(value).slice(0, 4); 
    if (!v) return "";
    if (v.length <= 2) return v; 
    return `${v.slice(0, 2)}/${v.slice(2, 4)}`; 
  };
  // Convierte una cadena de dígitos a formato MM/YY mientras el usuario escribe.

  // Normaliza el CVC (3 o 4 dígitos) y recorta caracteres extra.
  const formatCvc = (value: string) => onlyDigits(value).slice(0, 4);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let next = value;
    if (name === "number") next = formatCardNumber(value);
    if (name === "expiry") next = formatExpiry(value);
    if (name === "cvc") next = formatCvc(value);
    setCardForm((s) => ({ ...s, [name]: next }));
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) =>
    setCardForm((s) => ({ ...s, focus: e.target.name }));

  // handleInputChange: actualiza el estado del formulario aplicando
  // el formateo correspondiente según el campo (número, expiry, cvc).
  // handleInputFocus: guarda el nombre del campo en foco para que la
  // librería de preview muestre el foco correctamente.

  
  // Valida el número de tarjeta usando el algoritmo de Luhn.
  // Recorre los dígitos de derecha a izquierda, duplica cada segundo
  // dígito y suma los dígitos resultantes. Si la suma total es múltiplo
  // de 10, el número es válido.
  const luhnValid = (cardNumber: string) => {
    const digitsOnly = onlyDigits(cardNumber);
    if (digitsOnly.length < 12) return false;

    let total = 0;
    let shouldDouble = false; 

    for (let index = digitsOnly.length - 1; index >= 0; index--) {
      let digit = parseInt(digitsOnly[index], 10);
      if (shouldDouble) {
        digit = digit * 2;
        if (digit > 9) digit -= 9;
      }
      total += digit;
      shouldDouble = !shouldDouble; 
    }

    return total % 10 === 0;
  };

  // Valida que el expiry esté en formato MM/YY y que no corresponda
  // a una fecha pasada.
  const expiryValid = (exp: string) => {
    const m = exp.match(/^(\d{2})\/(\d{2})$/);
    if (!m) return false;
    const [, MM, YY] = m;
    const month = parseInt(MM, 10);
    if (month < 1 || month > 12) return false;
    const year = 2000 + parseInt(YY, 10);
    const now = new Date();
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);
    return endOfMonth >= now;
  };

  // Nombre del titular: se considera válido si tiene al menos 3 caracteres.
  const nameValid = (name: string) => name.trim().length >= 3;
  // CVC: 3 o 4 dígitos.
  const cvcValid = (c: string) => /^(\d{3,4})$/.test(c);

  const isCardFormValid =
    luhnValid(cardForm.number) &&
    expiryValid(cardForm.expiry) &&
    cvcValid(onlyDigits(cardForm.cvc)) &&
    nameValid(cardForm.name);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  // Control del evento submit: prevenir comportamiento por defecto
  // y validar el formulario antes de intentar crear la tarjeta.
  e.preventDefault();
  if (!isCardFormValid) return;

  // Si el usuario ya tiene 10 tarjetas registradas, evitar envío.
  if (existingCardsCount !== null && existingCardsCount >= 10) {
      try {
        const Swal = (await import("sweetalert2")).default;
        await Swal.fire({
          icon: "warning",
          title: "Límite de tarjetas",
          text: "Has alcanzado el límite de 10 tarjetas. No puedes registrar más.",
          confirmButtonText: "Cerrar",
          customClass: {
            popup: "swal-popup",
            title: "swal-title",
            htmlContainer: "swal-html",
            confirmButton: "swal-confirm",
          },
        });
      } catch (err) {
        console.warn("Swal failed to load for limit warning:", err);
      }
      return;
    }

    

  let accountId = account?.account_id || (userInfo ? userInfo.id : undefined);

    if (!accountId) {
      try {
          await refreshSession();
        if (userInfo) {
          accountId = userInfo.id;
        }
      } catch {
        console.debug("refreshSession failed");
      }
    }

    if (!accountId) {
      console.error("No accountId available in context or session");
      return;
    }

    const expiryParts = cardForm.expiry.split("/");
    const expiration_date =
      expiryParts.length === 2
        ? `${expiryParts[0]}/20${expiryParts[1]}`
        : cardForm.expiry;

    const codDigits = onlyDigits(cardForm.cvc);
    const codNumber = codDigits ? parseInt(codDigits, 10) : NaN;
    if (Number.isNaN(codNumber)) {
      try {
        const Swal = (await import("sweetalert2")).default;
        await Swal.fire({
          icon: "error",
          title: "Código inválido",
          text: "Código de seguridad inválido",
          confirmButtonText: "Cerrar",
          customClass: {
            popup: "swal-popup",
            title: "swal-title",
            htmlContainer: "swal-html",
            confirmButton: "swal-confirm",
          },
        });
      } catch (err) {
        console.warn("Swal failed to load for code invalid:", err);
      }
      return;
    }

  const numberIdDigits = cardForm.number.replace(/\s/g, "");
    const numberIdInt = numberIdDigits ? parseInt(numberIdDigits, 10) : NaN;
    if (Number.isNaN(numberIdInt)) {
      try {
        const Swal = (await import("sweetalert2")).default;
        await Swal.fire({
          icon: "error",
          title: "Número inválido",
          text: "Número de tarjeta inválido",
          confirmButtonText: "Cerrar",
          customClass: {
            popup: "swal-popup",
            title: "swal-title",
            htmlContainer: "swal-html",
            confirmButton: "swal-confirm",
          },
        });
      } catch (err) {
        console.warn("Swal failed to load for number invalid:", err);
      }
      return;
    }
    if (!Number.isSafeInteger(numberIdInt)) {
      try {
        const Swal = (await import("sweetalert2")).default;
        await Swal.fire({
          icon: "error",
          title: "Número inválido",
          text: "Número de tarjeta demasiado largo",
          confirmButtonText: "Cerrar",
          customClass: {
            popup: "swal-popup",
            title: "swal-title",
            htmlContainer: "swal-html",
            confirmButton: "swal-confirm",
          },
        });
      } catch (err) {
        console.warn("Swal failed to load for number too long:", err);
      }
      return;
    }

    // Construcción del payload que el backend espera para crear la tarjeta.
    const payload = {
      cod: codNumber,
      expiration_date,
      first_last_name: cardForm.name,
      number_id: numberIdInt,
    };

    

    try {
      const response = await fetch(`/api/accounts/${accountId}/cards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "<no response body>");
        console.error("Upstream response error:", response.status, text);
          try {
            const Swal = (await import("sweetalert2")).default;
            await Swal.fire({
              icon: "error",
              title: "Error al crear la tarjeta",
              text: `${response.status} - ${text}`,
              confirmButtonText: "Cerrar",
            });
          } catch {
          }
        return;
      }

      
      try {
        // Feedback visual al usuario: éxito en el registro de tarjeta.
        const Swal = (await import("sweetalert2")).default;
        await Swal.fire({
          icon: "success",
          title: "Tarjeta registrada",
          text: "Tu tarjeta fue registrada correctamente.",
          confirmButtonText: "Ver tarjetas",
          customClass: {
            popup: "swal-popup",
            title: "swal-title",
            htmlContainer: "swal-html",
            confirmButton: "swal-confirm",
          },
        });
      } catch {
        // No interrumpir flujo si la librería de alertas falla.
      }
      try {
        await refreshSession();
      } catch {
      }
  router.push("/personalCards");
    } catch (error) {
      console.error("Error creando tarjeta:", error);
      try {
        const Swal = (await import("sweetalert2")).default;
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al crear la tarjeta. Intenta nuevamente.",
          confirmButtonText: "Cerrar",
          customClass: {
            popup: "swal-popup",
            title: "swal-title",
            htmlContainer: "swal-html",
            confirmButton: "swal-confirm",
          },
        });
      } catch {
      }
    }
  };

  return (
    <div className={style["card-container"]}>
      <form className={style["card-form-container"]} onSubmit={handleSubmit}>
        {/* Banner que avisa si el usuario ya alcanzó el límite de tarjetas */}
        {existingCardsCount !== null && existingCardsCount >= 10 && (
          <div className={style["limit-banner"]} role="status">
            Has alcanzado el límite de 10 tarjetas. No puedes registrar más.
          </div>
        )}
        <div className={style["card-preview"]}>
          <Cards
            number={cardForm.number}
            name={cardForm.name}
            expiry={cardForm.expiry}
            cvc={cardForm.cvc}
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
                value: cardForm.number,
                className: `${style["input-card"]} ${style["placeholder"]}`,
                handleInputChange,
                handleInputFocus,
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
                value: cardForm.name,
                className: `${style["input-card"]}`,
                handleInputChange,
                handleInputFocus,
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
                value: cardForm.expiry,
                className: `${style["input-card"]}`,
                handleInputChange,
                handleInputFocus,
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
                value: cardForm.cvc,
                className: `${style["input-card"]}`,
                handleInputChange,
                handleInputFocus,
              }}
            />
          </div>

          <div className={style["button-container"]}>
            <div className={style["button-content"]}>
              <div className={style["card-left"]}></div>
              {/* Botón de envío: deshabilitado si el formulario no es válido
                  o si el usuario ya tiene 10 tarjetas registradas. */}
              <button
                type="submit"
                disabled={
                  !isCardFormValid || (existingCardsCount !== null && existingCardsCount >= 10)
                }
                className={`w-full rounded-xl px-4 py-3 font-semibold shadow-md transition-all ${
                  isCardFormValid && !(existingCardsCount !== null && existingCardsCount >= 10)
                    ? "bg-lime-400 hover:bg-lime-300 active:scale-[0.99]"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
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
