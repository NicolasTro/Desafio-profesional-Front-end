"use client";
import Button from "@/Components/Button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import style from "./success.module.css";

export default function Success() {
  const router = useRouter();
  return (
    <section className={style["success-section"]}>
      <div className={style["success-container"]}>
        <h1 className="text-white text-[34px] font-semibold">
          Registro Exitoso
        </h1>
        <Image
          src="/Success.png"
          alt="Registro Exitoso"
          width={96}
          height={96}
        />
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
