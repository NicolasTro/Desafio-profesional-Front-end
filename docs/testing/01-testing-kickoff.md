# Plan de Pruebas – Testing Kickoff

## 1. Objetivo

Definir el marco inicial para la ejecución de pruebas del Sprint 1, asegurando criterios claros sobre cómo crear casos de prueba, reportar defectos y clasificar las pruebas en suites de humo y regresión.

---

## 2. Lineamientos para escribir un caso de prueba

Cada caso de prueba debe incluir:

- **ID del caso**: Ejemplo `TC-LOGIN-001`.
- **Título**: Qué se prueba (ej. “Login exitoso con credenciales válidas”).
- **Precondiciones**: Estado previo necesario (ej. usuario registrado).
- **Datos de entrada**: email, contraseña.
- **Pasos a seguir**: Numerados y claros.
- **Resultado esperado**: Sistema redirige a `/home`.
- **Resultado obtenido**: (Se completa al ejecutar).
- **Estado**: `Passed` / `Failed` / `Blocked`.

---

## 3. Cómo reportar un defecto

Cada defecto debe documentarse con:

- **ID del defecto**: Ejemplo `BUG-REG-002`.
- **Título**: Breve y descriptivo (ej. “Registro falla al ingresar contraseña con caracteres especiales”).
- **Descripción**: Qué sucede vs. qué se esperaba.
- **Severidad**: Crítico, Alto, Medio, Bajo.
- **Prioridad**: Alta, Media, Baja.
- **Pasos para reproducir**: Detallados.
- **Evidencia**: Captura de pantalla, logs, etc.
- **Estado**: `Nuevo`, `En revisión`, `Resuelto`, `Cerrado`.

---

## 4. Criterios para incluir un caso en Smoke Test Suite

- Valida funcionalidades críticas y mínimas para el uso básico.
- Debe poder ejecutarse rápido (máx. 1–2 minutos por caso).

### Ejemplos:

- Acceso al sitio desde desktop/mobile.
- Registro exitoso de un usuario.
- Login y redirección a `/home`.
- Cierre de sesión correcto.

---

## 5. Criterios para incluir un caso en Regression Test Suite

- Casos que aseguran que funcionalidades existentes no se rompan tras cambios.
- Incluyen tanto casos críticos como secundarios.
- Se ejecutan antes de releases o al final de cada Sprint.

### Ejemplos:

- Registro con validaciones (correo inválido, contraseña corta).
- Mensajes de error en login.
- Redirección correcta de links (“Registrarse” → pantalla de registro).
- Persistencia de sesión al recargar el navegador.

---

## 6. Herramientas y repositorio

- **Ejecución de pruebas**: Manual, registrando resultados en la planilla.
