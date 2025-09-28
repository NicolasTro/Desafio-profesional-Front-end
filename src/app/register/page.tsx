"use client";
import Button from "@/Components/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BasicInput from "../../Components/input";
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const validateField = (field: string, value: string) => {
    const fe = { ...fieldErrors };
    const setError = (flag: boolean) => {
      if (flag) fe[field] = true;
      else delete fe[field];
    };

    switch (field) {
      case "name":
      case "surname":
        // Error when empty or contains digits
        setError(value.trim() === "" || /\d/.test(value));
        break;
      case "dni":
        setError(value.trim() === "" || !/^\d+$/.test(value));
        break;
      case "telefono":
        setError(value.trim() === "" || !/^\d+$/.test(value));
        break;
      case "email":
        setError(value.trim() === "" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
        break;
      case "password":
        setError(value.trim() === "" || (Boolean(confirmPassword) && value !== confirmPassword));
        break;
      case "confirmPassword":
        setError(value.trim() === "" || (Boolean(password) && value !== password));
        break;
      default:
        break;
    }
    setFieldErrors(fe);
  };

  // onChange wrappers for real-time validation
  const handleNameChange = (v: string) => { const cleaned = v.replace(/\d/g, ""); setName(cleaned); validateField("name", cleaned); };
  const handleSurnameChange = (v: string) => { const cleaned = v.replace(/\d/g, ""); setSurname(cleaned); validateField("surname", cleaned); };
  const handleDniChange = (v: string) => { const cleaned = v.replace(/\D/g, ""); setDni(cleaned); validateField("dni", cleaned); };
  const handleTelefonoChange = (v: string) => { const cleaned = v.replace(/\D/g, ""); setTelefono(cleaned); validateField("telefono", cleaned); };
  const handleEmailChange = (v: string) => { setEmail(v); validateField("email", v); };
  const handlePasswordChange = (v: string) => { setPassword(v); validateField("password", v); validateField("confirmPassword", confirmPassword); };
  const handleConfirmPasswordChange = (v: string) => { setConfirmPassword(v); validateField("confirmPassword", v); validateField("password", password); };

  const handleSubmit = async () => {
    const newErrors: string[] = [];
    const newFieldErrors: Record<string, boolean> = {};
    if (
      !name ||
      !surname ||
      !dni ||
      !telefono ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      newErrors.push("Completa los campos requeridos");
      if (!name) newFieldErrors.name = true;
      if (!surname) newFieldErrors.surname = true;
      if (!dni) newFieldErrors.dni = true;
      if (!telefono) newFieldErrors.telefono = true;
      if (!email) newFieldErrors.email = true;
      if (!password) newFieldErrors.password = true;
      if (!confirmPassword) newFieldErrors.confirmPassword = true;
    }
    if (dni && !/^\d+$/.test(dni)) newErrors.push("DNI: solo números");
    if (dni && !/^\d+$/.test(dni)) newFieldErrors.dni = true;
    if (telefono && !/^\d+$/.test(telefono))
      newErrors.push("Teléfono: solo números");
    if (telefono && !/^\d+$/.test(telefono)) newFieldErrors.telefono = true;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.push("Ingresa un email válido");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newFieldErrors.email = true;
    if (password && confirmPassword && password !== confirmPassword)
      newErrors.push("Las contraseñas no coinciden");
    if (password && confirmPassword && password !== confirmPassword) {
      newFieldErrors.password = true;
      newFieldErrors.confirmPassword = true;
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setFieldErrors(newFieldErrors);
      return;
    }
    setErrors([]);
    setFieldErrors({});
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
          password
        })
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

        <div className={styleRegister["group1"]}>

          <BasicInput
            placeholder="Nombre*"
            value={name}
            onChange={handleNameChange}
            type="text"
            name="name"
            className={styleRegister["input-width"]}
            error={!!fieldErrors.name}
            />

          <BasicInput
            placeholder="Apellido*"
            value={surname}
            onChange={handleSurnameChange}
            type="text"
            name="surname"
            className={styleRegister["input-width"]}
            error={!!fieldErrors.surname}
          />
        </div>

        <div className={styleRegister["group2"]}>
          <BasicInput
            placeholder="DNI*"
            value={dni}
            onChange={handleDniChange}
            type="text"
            name="dni"
            error={!!fieldErrors.dni}
          />

          <BasicInput
            placeholder="Correo electrónico*"
            value={email}
            onChange={handleEmailChange}
            type="email"
            name="email"
            error={!!fieldErrors.email}
          />
        </div>

        <p className="text-white text-[11.2px] text-justify">
          Usa entre 6 y 20 caracteres (debe contener al menos 1 carácter
          especial, una mayúscula y un número)
        </p>

        <div className={styleRegister["group3"]}>

          <BasicInput
            placeholder="Contraseña*"
            value={password}
            onChange={handlePasswordChange}
            type="password"
            name="password"
            error={!!fieldErrors.password}
          />

          <BasicInput
            placeholder="Confirmar contraseña*"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            type="password"
            name="confirm-password"
            error={!!fieldErrors.confirmPassword}
          />
        </div>


        <div className={styleRegister["group4"]}>
          <BasicInput
            placeholder="Teléfono*"
            value={telefono}
            onChange={handleTelefonoChange}
            type="tel"
            name="telefono"
            error={!!fieldErrors.telefono}
          />

          <Button
            label="Crear cuenta"
            backgroundColor="var(--lima)"
            height="50px"
            className="rounded-[8px] font-bold"
            onClick={handleSubmit}
          />
        </div>
        {errors.length > 0 &&
          <div className="w-full text-left mt-2">
            {errors.map((err, idx) =>
              <p
                key={idx}
                className="text-center text-red-400 text-[15px] italic"
              >
                {err}
              </p>
            )}
          </div>}
      </div>
    </section >
  );
}
