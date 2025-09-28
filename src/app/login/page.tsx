"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import BasicButtons from "./Components/buttonLogin";
import BasicInput from "../../Components/input";
import style from "./styles/login.module.css";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/Context/AppContext";

const errorMessage = {
  color: "text-red-400",
  font: "italic",
  size: "text-[15px]",
};

export default function Login() {
  const router = useRouter();
  const { refreshSession, userInfo, isLoading } = useAppContext();
  const [loginSuccess, setLoginSuccess] = useState(false);
  const hasRedirected = useRef(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  type SweetAlertModule = typeof import("sweetalert2")["default"];

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
  
  let swalRef: SweetAlertModule | null = null;
    try {
      const Swal = (await import("sweetalert2")).default;
      swalRef = Swal;
  
      Swal.fire({
        title: "Iniciando sesión",
        html: "<div>Cargando...</div>",
        allowOutsideClick: false,
        didOpen: () => {
          
          Swal.showLoading();
        },
        customClass: {
          popup: "swal-popup",
          title: "swal-title",
          htmlContainer: "swal-html",
        },
        showConfirmButton: false,
      });
    } catch (err) {
      console.warn("Swal failed to load for login loading modal:", err);
    }
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
        try {
          if (swalRef && typeof swalRef.close === "function") swalRef.close();
        } catch {}
        if (res.status === 404) {
          setStep(1);
          setPassword("");
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
          message = (payload as { error: string }).error;
        }
        setError(message);
        return;
      }

      await refreshSession();
      setLoginSuccess(true); 
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error de login";
      try {
        if (swalRef && typeof swalRef.close === "function") swalRef.close();
      } catch {}
      try {
        const Swal = (await import("sweetalert2")).default;
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: msg,
          confirmButtonText: "Cerrar",
          customClass: {
            popup: "swal-popup",
            title: "swal-title",
            htmlContainer: "swal-html",
            confirmButton: "swal-confirm",
          },
        });
      } catch (errSwal) {
        console.warn("Swal failed to load for login error:", errSwal);
        setError(msg);
      }
    } finally {
      try {
        if (swalRef && typeof swalRef.close === "function") swalRef.close();
      } catch {}
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loginSuccess && userInfo && !isLoading && !hasRedirected.current) {
      hasRedirected.current = true;
      router.push("/home");
    }
  }, [loginSuccess, userInfo, isLoading, router]);

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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleContinue();
                }
              }}
              type="email"
              name="email"
              border={
                error?.includes("Usuario inexistente")
                  ? "solid red 1px"
                  : "none"
              }
            />
            <BasicButtons
              id="continue-button"
              label="Continuar"
              color="Black"
              onClick={handleContinue}
            />
            <BasicButtons
              id="create-account-button"
              label="Crear cuenta"
              backgroundColor="#CECECE"
              onClick={() => router.push("/register")}
            />
            {error?.includes("Usuario inexistente. Vuelve a intentarlo") && (
              <p
                className={`${errorMessage.color} ${errorMessage.font} ${errorMessage.size} `}
              >
                {error}
              </p>
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              border={
                error?.includes("Contraseña incorrecta")
                  ? "1px solid red"
                  : "none"
              }
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
              <p
                className={`${errorMessage.color} ${errorMessage.font} ${errorMessage.size} `}
              >
                {error}
              </p>
            )}

            <BasicButtons
              id="back-button"
              label="Volver"
              backgroundColor="#CECECE"
              onClick={() => {
                setError(null);
                setPassword("");
                setStep(1);
              }}
            />
          </>
        )}
      </div>
    </section>
  );
}
