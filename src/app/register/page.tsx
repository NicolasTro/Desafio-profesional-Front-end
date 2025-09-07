"use client";
import Button from "@/Components/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BasicInput from "../../Components/Input";
import styleRegister from "./styles/register.module.css";

export default function Register() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [dni, setDni] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const router = useRouter();

  const handleSubmit = async () => {
    const newErrors: string[] = [];
    // Required fields
    if (!name || !surname || !dni || !telefono || !email || !password || !confirmPassword) {
      newErrors.push("Completa los campos requeridos");
    }
    // Format validations
    if (dni && !/^\d+$/.test(dni)) newErrors.push("DNI: solo números");
    if (telefono && !/^\d+$/.test(telefono)) newErrors.push("Teléfono: solo números");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.push("Ingresa un email válido");
    if (password && confirmPassword && password !== confirmPassword) newErrors.push("Las contraseñas no coinciden");

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors([]);
    try {
  const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          surname,
          dni,
          telefono,
          email,
          password,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Registro fallido");
      }
      router.push("/register/success");
    } catch (e) {
      setErrors([e instanceof Error ? e.message : "Error de registro"]);
    }
  };

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
          onChange={(v) => setDni(v.replace(/\D/g, ""))}
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
        <p
          className="text-white text-[11.2px] text-justify"
        >
          Usa entre 6 y 20 caracteres (debe contener al menos 1 carácter
          especial, una mayúscula y un número)
        </p>
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
          onChange={(v) => setTelefono(v.replace(/\D/g, ""))}
          type="tel"
          name="telefono"
        />

        <Button
          label="Crear cuenta"
          backgroundColor="var(--lima)"
          className="w-full h-[50px] rounded-[8px] font-bold"
          onClick={handleSubmit}
        />
        {errors.length > 0 && (
          <div className="w-full text-left mt-2">
            {errors.map((err, idx) => (
                <p key={idx} className="text-center text-red-400 text-[15px] italic">{err}</p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
