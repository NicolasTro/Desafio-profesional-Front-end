"use client"
import { useState, useMemo } from "react";
import BasicButtons from "./Components/buttonLogin";
import BasicInput from "../../Components/input";
import style from "./styles/login.module.css";
import { useRouter } from "next/navigation";

const errorMessage ={
  color: "text-red-400",
  font: "italic",
  size: "text-[15px]",
}


export default function Login() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailValid = useMemo(() => /.+@.+\..+/.test(email), [email]);
  const canContinue = emailValid;
  const canSubmit = password.trim().length >= 6; 

  const handleContinue = () => {
    if (!canContinue) return;
    setError(null);
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!canSubmit || loading) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const contentType = res.headers.get("content-type") || "";
      const payload: unknown = contentType.includes("application/json")
        ? await res.json()
        : await res.text();

      if (!res.ok) {
        if (res.status === 404) {
          setStep(1);
          setPassword("")
          setError("Usuario inexistente. Vuelve a intentarlo");
          return;
        }
        if (res.status === 401) {
          setStep(2);
          setError("Contraseña incorrecta. Vuelve a intentarlo");
          return;
        }
        let message = "Error de login";
        if (typeof payload === "string") {
          message = payload || message;
        } else if (
          payload &&
          typeof payload === "object" &&
          "error" in payload &&
          typeof (payload as { error?: unknown }).error === "string"
        ) {
          message = (payload as { error?: string }).error ?? message;
        }
        setError(message);
        return;
      }

      router.push("/home");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error de login";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={style["main-section"]}>
      <div className={style["form-container"]}>
        {step === 1 ? (
          <>
            <h1 className="text-white text-[20px]">¡Hola! Ingresá tu e-mail</h1>
            <BasicInput
              id="email-input"
              placeholder="Correo electrónico"
              value={email}
              onChange={(value) => {
                setEmail(value);
                if (error?.includes("Usuario inexistente")) setError(null);
              }}
              type="email"
              name="email"
              border={error?.includes("Usuario inexistente") ? "solid red 1px" : "none"}
            />
            <BasicButtons
              id="continue-button"
              label="Continuar"
              color="Black"
              onClick={handleContinue}
            />
            <BasicButtons id="create-account-button" label="Crear cuenta" backgroundColor="#CECECE" onClick={() => router.push("/register")}/>
            {error?.includes("Usuario inexistente. Vuelve a intentarlo") && (
              <p className={`${errorMessage.color} ${errorMessage.font} ${errorMessage.size} `}>{error}</p>
            )}
          </>
        ) : (
          <>
            <h1 className="text-white text-[20px]">Ingresá tu contraseña</h1>
            
            <BasicInput
              id="password-input"
              placeholder="Contraseña"
              value={password}
              onChange={(value) => {
                setPassword(value);
                if (error?.includes("Contraseña incorrecta")) setError(null);
              }}
              border={error?.includes("Contraseña incorrecta") ? "1px solid red" : "none"}
              type="password"
              name="password"              
            />

            <BasicButtons
              id="login-button"
              label="Ingresar"
              color="Black"
              onClick={handleSubmit}
            />

            {error?.includes("Contraseña incorrecta") && (
              <p className={`${errorMessage.color} ${errorMessage.font} ${errorMessage.size} `}>{error}</p>
            )}

            <BasicButtons
              id="back-button"
              label="Volver"
              backgroundColor="#CECECE"
              onClick={() => {
                setError(null);
                setPassword("")
                setStep(1);
              }}
            />

          </>
        )}
      </div>
    </section>
  );
}
