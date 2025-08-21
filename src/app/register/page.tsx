"use client";
import Button from "@/Components/Button";
import { useState } from "react";
import BasicInput from "../../Components/input";
import styleRegister from "./register.module.css";

export default function Register() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [dni, setDni] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <section className={styleRegister["section-register"]}>
      <div className={styleRegister["form-container"]}>
        <h1 className="text-white font-bold text-[20px]">Crear cuenta</h1>
        <BasicInput
          placeholder="Nombre*"
          value={name}
          onChange={setName}
          type="text"
          name="name"
        />

        <BasicInput
          placeholder="Apellido*"
          value={surname}
          onChange={setSurname}
          type="text"
          name="surname"
        />
        <BasicInput
          placeholder="DNI*"
          value={dni}
          onChange={setDni}
          type="text"
          name="dni"
        />

        <BasicInput
          placeholder="Correo electrónico*"
          value={email}
          onChange={setEmail}
          type="email"
          name="email"
        />

        <BasicInput
          placeholder="Contraseña*"
          value={password}
          onChange={setPassword}
          type="password"
          name="password"
        />

        <BasicInput
          placeholder="Confirmar contraseña*"
          value={confirmPassword}
          onChange={setConfirmPassword}
          type="password"
          name="confirm-password"
        />

        <BasicInput
          placeholder="Teléfono*"
          value={telefono}
          onChange={setTelefono}
          type="tel"
          name="telefono"
        />

        <Button label="Crear cuenta" backgroundColor="var(--lima)" className="w-full h-[50px] rounded-[8px] font-bold" />
      </div>
    </section>
  );
}
