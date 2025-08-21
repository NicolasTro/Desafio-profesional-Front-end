"use client"
import { useState, useMemo } from "react";
import BasicButtons from "./Components/buttonLogin";
import BasicInput from "../../Components/input";
import style from "./styles/login.module.css";

export default function Login() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailValid = useMemo(() => /.+@.+\..+/.test(email), [email]);
  const canContinue = emailValid;
  const canSubmit = password.trim().length >= 6; // simple min length check

  const handleContinue = () => {
    if (!canContinue) return;
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
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error de login");
      // éxito: cookie seteada por el route handler. Redirigir o mostrar estado.
      // TODO: useRouter().push('/dashboard') si corresponde
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
              placeholder="Correo electrónico"
              value={email}
              onChange={setEmail}
              type="email"
              name="email"
            />
            <BasicButtons
              label="Continuar"
              color="Black"
              onClick={handleContinue}
            //   disabled={!canContinue}
            />
            <BasicButtons label="Crear cuenta" backgroundColor="#CECECE" />
          </>
        ) : (
          <>
            <h1 className="text-white text-[20px]">Ingresá tu contraseña</h1>
            <BasicInput
              placeholder="Contraseña"
              value={password}
              onChange={setPassword}
              type="password"
              name="password"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <BasicButtons
              label="Ingresar"
              color="Black"
              onClick={handleSubmit}
              disabled={!canSubmit || loading}
            />
            <BasicButtons
              label="Volver"
              backgroundColor="#CECECE"
              onClick={() => setStep(1)}
            />
          </>
        )}
      </div>
    </section>
  );
}
