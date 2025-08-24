# Plan de Pruebas – Testing Kickoff

## 1. Objetivo

Definir el marco inicial para la ejecución de pruebas del Sprint 1, asegurando criterios claros sobre cómo crear casos de prueba, reportar defectos y clasificar las pruebas en suites de humo y regresión.

---

## 2. Lineamientos para escribir un caso de prueba

Cada caso de prueba debe incluir:

- **ID**: Identificador único del caso (Ejemplo: `TC-LOGIN-001`).
- **Título**: Qué se prueba (Ejemplo: “Login exitoso con credenciales válidas”).
- **Descripción**: Detalle del objetivo del caso de prueba.
- **Precondición**: Estado previo necesario (Ejemplo: Usuario registrado).
- **Paso #**: Número del paso.
- **Paso**: Acción específica a realizar.
- **Resultado Esperado**: Resultado que debería ocurrir (Ejemplo: Redirección a `/home`).
- **Tipo**: Clasificación del caso (Ejemplo: Funcional, No funcional).
- **Nivel**: Nivel de prueba (Ejemplo: Componentes, Integración).
- **Estado**: Estado del caso: `Passed`, `Failed`, `Blocked`.
- **Front-End**: Indica si corresponde a Front-End (`Sí` o `No`).

---

## 3. Documentación de la Ejecución de Pruebas

Cada ejecución de prueba debe incluir:

- **ID**: Identificador único del caso de prueba ejecutado.
- **Fecha de Ejecución**: Día en que se realizó la prueba.
- **Estado de Ejecución**: Estado actual de la ejecución (`Completado`, `En curso`, etc.).
- **Resultado Obtenido**: Resultado real observado durante la ejecución.
- **Suite**: Suite a la que pertenece el caso (`Smoke Test`, `Regression Test`, etc.).
- **Entorno**: Entorno donde se ejecutó la prueba (`Desarrollo`, `Producción`, etc.).
- **Ejecutor**: Persona que realizó la prueba.
- **Observaciones**: Notas adicionales relevantes para la ejecución.

---

## 4. Cómo reportar un defecto

Cada defecto debe documentarse con:

- **ID**: Identificador único del defecto (Ejemplo: `BUG-REG-002`).
- **Título**: Breve y descriptivo (Ejemplo: “Registro falla al ingresar contraseña con caracteres especiales”).
- **Descripción**: Qué sucede vs. qué se esperaba.
- **Severidad**: Nivel de impacto: Crítico, Alto, Medio, Bajo.
- **Prioridad**: Nivel de urgencia: Alta, Media, Baja.
- **Pasos para Reproducir**: Detallados y claros.
- **Evidencia**: Captura de pantalla, logs, etc.
- **Estado**: Estado del defecto: `Nuevo`, `En revisión`, `Resuelto`, `Cerrado`.

---

## 5. Criterios para incluir un caso en Smoke Test Suite

- Valida funcionalidades críticas y mínimas para el uso básico.
- Debe poder ejecutarse rápido (máx. 1–2 minutos por caso).

### Ejemplos:

- Acceso al sitio desde desktop/mobile.
- Registro exitoso de un usuario.
- Login y redirección a `/home`.
- Cierre de sesión correcto.

---

## 6. Criterios para incluir un caso en Regression Test Suite

- Casos que aseguran que funcionalidades existentes no se rompan tras cambios.
- Incluyen tanto casos críticos como secundarios.
- Se ejecutan antes de releases o al final de cada Sprint.

### Ejemplos:

- Registro con validaciones (correo inválido, contraseña corta).
- Mensajes de error en login.
- Redirección correcta de links (“Registrarse” → pantalla de registro).
- Persistencia de sesión al recargar el navegador.

---

## 7. Herramientas y repositorio

- **Ejecución de pruebas**: Manual, registrando resultados en la planilla.

---





