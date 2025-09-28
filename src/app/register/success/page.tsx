"use client";
import Button from "@/Components/Button";
import { useRouter } from "next/navigation";
import style from "./success.module.css";
import SuccessIcon from "../../../../public/Success.svg"


export default function Success() {
  const router = useRouter();
  return (
    <section className={style["success-section"]}>
      <div className={style["success-container"]}>
        <h1 className="text-white text-[34px] font-semibold">
          Registro Exitoso
        </h1>
        <SuccessIcon fontSize={96} color="var(--lima)" />
        <p className="text-white text-[12px] w-[210px] text-center">
          Hemos enviado un correo de confirmación para validar tu email, por
          favor revísalo para iniciar sesión.
        </p>
        <Button
          label="Continuar"
          backgroundColor="var(--lima)"
          className="w-full h-[50px] rounded-[8px] text-black font-bold"
          onClick={() => router.push("/login")}
        />
      </div>
    </section>
  );
}
