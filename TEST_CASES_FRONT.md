# TEST CASES - Frontend 


## Índice rápido
 - `FRONT-UI-01` a `FRONT-UI-07` — Tests de componentes (UI)
 - `FRONT-UI-08` a `FRONT-UI-12` — Variantes / cobertura (UI)
 - `FRONT-HOOK-01` — Tests de hooks
 - `FRONT-LIB-01` a `FRONT-LIB-05` — Tests de librerías (no-UI)
 - `FRONT-API-01` a `FRONT-API-13` — Tests de rutas API (server)

---

## Sección: Componentes (UI)

- ID: FRONT-UI-01
  - Título: Footer - render básico
  - Descripción: Verificar que el `Footer` renderiza elementos estáticos y muestra el texto de copyright
  - Precondición: Ninguna
  - #Paso: 1
  - Pasos: Renderizar `Footer` en Jest + @testing-library/react y buscar texto esperado
  - Resultado esperado: Elementos visibles, texto presente
  - Tipo: Funcional
  - Nivel: unit (componente)
  - Estado de diseño: Automatizado (`src/Components/__tests__/Footer.test.tsx`)
  - Entorno: test
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO

- ID: FRONT-UI-02
  - Título: PageHeader - titulos y botones
  - Descripción: Validar que `PageHeader` muestra título y botones de acción según props
  - Precondición: Ninguna
  - Pasos: Renderizar `PageHeader` con props y comprobar presencia de nodos
  - Resultado esperado: Título y botones presentes
  - Tipo: Funcional
  - Nivel: unit (componente)
  - Estado de diseño: Automatizado (`src/Components/__tests__/PageHeader.test.tsx`)
  - Entorno: test
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO

- ID: FRONT-UI-03
  - Título: SearchBar - input y eventos
  - Descripción: Comprobar que el input captura texto y dispara el evento de búsqueda
  - Precondición: Ninguna
  - Pasos: Renderizar `SearchBar`, simular tipeo y submit
  - Resultado esperado: Handlers llamados; valor del input actualizado
  - Tipo: Funcional
  - Nivel: unit (componente)
  - Estado de diseño: Automatizado (`src/Components/__tests__/SearchBar.test.tsx`)
  - Entorno: test
  - Observaciones: Advertencia de React sobre `startDecorator` (módulo `@mui/joy/Input`) visible en la salida pero no rompe el test.
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO

- ID: FRONT-UI-04
  - Título: SlideMenu - abrir / cerrar y items
  - Descripción: Verificar que `SlideMenu` abre/cierra y muestra opciones
  - Precondición: Ninguna
  - Pasos: Renderizar `SlideMenu`, simular click para abrir y cerrar, comprobar items
  - Resultado esperado: Drawer visible cuando se abre y oculto cuando se cierra; items renderizados
  - Tipo: Funcional
  - Nivel: unit (componente)
  - Estado de diseño: Automatizado (`src/Components/__tests__/SlideMenu.test.tsx`)
  - Entorno: test
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO

- ID: FRONT-UI-05
  - Título: Button - clicks y props
  - Descripción: Asegurar que el `Button` responde a clicks y respeta props (disabled)
  - Precondición: Ninguna
  - Pasos: Renderizar `Button`, simular click y comprobar llamadas
  - Resultado esperado: Handler llamado cuando no está disabled; no llamado cuando disabled
  - Tipo: Funcional
  - Nivel: unit (componente)
  - Estado de diseño: Automatizado (`src/Components/__tests__/Button.test.tsx`)
  - Entorno: test
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO

- ID: FRONT-UI-06
  - Título: Input - value y onChange
  - Descripción: Verificar que el `Input` controla el valor y llama `onChange`
  - Precondición: Ninguna
  - Pasos: Renderizar `Input`, simular cambio de valor
  - Resultado esperado: Valor actualizado; `onChange` llamado
  - Tipo: Funcional
  - Nivel: unit (componente)
  - Estado de diseño: Automatizado (`src/Components/__tests__/Input.test.tsx`)
  - Entorno: test
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO

- ID: FRONT-UI-07
  - Título: Header - navegación básica
  - Descripción: Comprobar elementos de navegación en `Header`
  - Precondición: Ninguna
  - Pasos: Renderizar `Header` y buscar elementos nav
  - Resultado esperado: Links y botones presentes
  - Tipo: Funcional
  - Nivel: unit (componente)
  - Estado de diseño: Automatizado (`src/Components/__tests__/Header.test.tsx`)
  - Entorno: test
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO

---

## Sección: Librerías / Utilidades (no-UI)

- ID: FRONT-LIB-01
  - Título: fetchers.fetchMe() - llamada y manejo de error
  - Descripción: `fetchers.fetchMe()` debe pedir al endpoint /me y procesar OK/errores correctamente
  - Precondición: Mock de `fetch` aplicado por el test
  - Pasos: Ejecutar `fetchMe()` con `global.fetch` mockeado para responder 200 y 500
  - Resultado esperado: Devuelve usuario en 200; lanza error o devuelve forma esperada en fallo
  - Tipo: Funcional
  - Nivel: unit (lib)
  - Estado de diseño: Automatizado (`src/lib/__tests__/fetchers.fetchMe.test.ts`)
  - Entorno: test
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO

- ID: FRONT-LIB-02
  - Título: user.fetchUserFromToken() - decode + fetch upstream
  - Descripción: Verificar que `fetchUserFromToken` decodifica token y consulta el upstream obteniendo perfil
  - Precondición: `jwt.decode` y `fetch` mockeados según el test
  - Pasos: Llamar `fetchUserFromToken(token)` con mocks
  - Resultado esperado: Devuelve perfil cuando upstream responde OK; maneja error cuando upstream falla
  - Tipo: Funcional
  - Nivel: unit (lib)
  - Estado de diseño: Automatizado (`src/lib/__tests__/user.fetchUserFromToken.test.ts`)
  - Entorno: test
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO

- ID: FRONT-LIB-03
  - Título: authClient - cache set/get/clear/has
  - Descripción: Comprobar comportamiento de `authClient` para almacenar y recuperar perfil en cache local
  - Precondición: Ninguna
  - Pasos: Llamar `setCachedProfile`, `getCachedProfile`, `hasAuthCookie`, `clearCachedProfile`
  - Resultado esperado: Valores coherentes según llamadas
  - Tipo: Funcional
  - Nivel: unit (lib)
  - Estado de diseño: Automatizado (`src/lib/__tests__/authClient.test.ts`)
  - Entorno: test
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO


---

## Sección: API routes (server)

- ID: FRONT-API-01
  - Título: users/[id] - GET handler
  - Descripción: Validar respuesta GET de `src/app/api/users/[id]/route.ts` ante id válido e inválido
  - Precondición: Polyfills de Request/Response/Headers y mock de `fetch` en el test
  - Pasos: Invocar handler GET con Request mockeada para id válido; simular upstream
  - Resultado esperado: Devuelve 200 con perfil para id válido; 404 o error para id inexistente
  - Tipo: Funcional
  - Nivel: unit (route handler)
  - Estado de diseño: Automatizado (`src/app/api/users/__tests__/route.test.ts`)
  - Entorno: test
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO

- ID: FRONT-API-02
  - Título: accounts/[account_id] - PATCH handler
  - Descripción: Validar PATCH en `src/app/api/accounts/[account_id]/route.ts` que actualiza datos de cuenta
  - Precondición: Polyfills y mock de fetch/cookies en el test
  - Pasos: Invocar handler PATCH con payload de actualización y comprobar llamada upstream y respuesta final
  - Resultado esperado: 200 cuando la actualización es correcta; error manejado en fallos
  - Tipo: Funcional
  - Nivel: unit (route handler)
  - Estado de diseño: Automatizado (`src/app/api/accounts/__tests__/route.test.ts`)
  - Entorno: test
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO

-- ID: FRONT-HOOK-01
  - Título: useUser (hook) - carga y estado
  - Descripción: Verifica que el hook `useUser` devuelve el estado esperado según mocks de contexto y fetch
  - Precondición: Polyfills y mock de fetch/context aplicados por el test
  - #Paso: 1
  - Pasos: Ejecutar `renderHook` con provider y mocks; comprobar valor inicial y después de resolución
  - Resultado esperado: Estado de usuario cargado; errores manejados según mocks
  - Tipo: Funcional
  - Nivel: unit (hook)
  - Estado de diseño: Automatizado (`src/hooks/__tests__/useUser.test.tsx`)
  - Entorno: test
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO

-- ID: FRONT-UI-08
  - Título: SlideMenu - ramas / condiciones (branches)
  - Descripción: Pruebas extra de `SlideMenu` que ejercitan ramas alternativas (items condicionales y estados límite)
  - Precondición: Ninguna
  - #Paso: 1
  - Pasos: Renderizar `SlideMenu` con props que disparan ramas alternativas; validar renderizado y callbacks
  - Resultado esperado: Comportamiento correcto en ramas; items condicionales visibles/ocultos según props
  - Tipo: Funcional
  - Nivel: unit (componente)
  - Estado de diseño: Automatizado (`src/Components/__tests__/SlideMenu.branches.test.tsx`)
  - Entorno: test
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO

-- ID: FRONT-UI-09
  - Título: SlideMenu - pruebas extra (edge / extra)
  - Descripción: Casos adicionales para `SlideMenu` (flujos alternativos y inputs inválidos)
  - Precondición: Ninguna
  - #Paso: 1
  - Pasos: Ejecutar tests que simulan inputs/estados no estándar y comprobar resiliencia
  - Resultado esperado: No hay crashes; manejo de estados no estándar verificado
  - Tipo: Funcional
  - Nivel: unit (componente)
  - Estado de diseño: Automatizado (`src/Components/__tests__/SlideMenu.branches.extra.test.tsx`)
  - Entorno: test
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO

-- ID: FRONT-UI-10
  - Título: Header - pruebas extra
  - Descripción: Tests adicionales de `Header` que cubren variantes y states auxiliares
  - Precondición: Ninguna
  - #Paso: 1
  - Pasos: Renderizar `Header` en diferentes condiciones (usuario logueado/no) y revisar nodos
  - Resultado esperado: Links y controles correctos según estado
  - Tipo: Funcional
  - Nivel: unit (componente)
  - Estado de diseño: Automatizado (`src/Components/__tests__/Header.extra.test.tsx`)
  - Entorno: test
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO

-- ID: FRONT-UI-11
  - Título: Header - coverage helpers
  - Descripción: Pruebas auxiliares para aumentar cobertura en `Header` (scaffold de casos raros)
  - Precondición: Ninguna
  - #Paso: 1
  - Pasos: Ejecutar casos adicionales que no forman parte de la funcionalidad principal
  - Resultado esperado: Sin errores; cobertura incrementada
  - Tipo: No-funcional (cobertura)
  - Nivel: unit (componente)
  - Estado de diseño: Automatizado (`src/Components/__tests__/Header.coverage.test.tsx`)
  - Entorno: test
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO

-- ID: FRONT-UI-12
  - Título: Header - ramas (branches)
  - Descripción: Tests que ejercitan ramas y condicionales en `Header`
  - Precondición: Ninguna
  - #Paso: 1
  - Pasos: Renderizar con múltiples combinaciones de props/estado y verificar salida
  - Resultado esperado: Comportamiento consistente por rama
  - Tipo: Funcional
  - Nivel: unit (componente)
  - Estado de diseño: Automatizado (`src/Components/__tests__/Header.branches.test.tsx`)
  - Entorno: test
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO

-- ID: FRONT-API-03
  - Título: session - GET/POST handlers
  - Descripción: Validar handlers en `src/app/api/session/route.ts` (login/session management) sobre OK y fallos
  - Precondición: Polyfills y mocks de fetch/cookies aplicados por los tests
  - #Paso: 1
  - Pasos: Invocar handlers con Requests mockeadas para distintos verbos y payloads; simular upstream
  - Resultado esperado: Devuelve 200/201 en OK; maneja errores y estados inválidos
  - Tipo: Funcional
  - Nivel: unit (route handler)
  - Estado de diseño: Automatizado (`src/app/api/session/__tests__/route.test.ts`)
  - Entorno: test
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO

-- ID: FRONT-API-04
  - Título: logout - POST handler
  - Descripción: Validar `src/app/api/logout/route.ts` que cierra sesión y limpia cookies
  - Precondición: Polyfills y mocks de cookies
  - #Paso: 1
  - Pasos: Invocar handler con request simulada y comprobar headers/cookies devueltos
  - Resultado esperado: Cookies borradas; status 200 o redirect según implementación
  - Tipo: Funcional
  - Nivel: unit (route handler)
  - Estado de diseño: Automatizado (`src/app/api/logout/__tests__/route.test.ts`)
  - Entorno: test
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO

-- ID: FRONT-API-05
  - Título: session - tests extra / coverage
  - Descripción: Tests auxiliares para `session` (casos límite / coverage)
  - Precondición: Polyfills y mocks
  - #Paso: 1
  - Pasos: Ejecutar casos adicionales (inputs inválidos, timeouts mockeados)
  - Resultado esperado: Manejo de errores y cobertura aumentada
  - Tipo: No-funcional (cobertura)
  - Nivel: unit (route handler)
  - Estado de diseño: Automatizado (`src/app/api/session/__tests__/route.extra.test.ts`)
  - Entorno: test
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO

-- ID: FRONT-API-06
  - Título: session - coverage helpers
  - Descripción: Pruebas para aumentar cobertura en `session`
  - Precondición: Polyfills y mocks
  - #Paso: 1
  - Pasos: Ejecutar helpers y ramas poco frecuentes
  - Resultado esperado: Sin errores; cobertura incrementada
  - Tipo: No-funcional (cobertura)
  - Nivel: unit (route handler)
  - Estado de diseño: Automatizado (`src/app/api/session/__tests__/route.coverage.test.ts`)
  - Entorno: test
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO

-- ID: FRONT-API-07
  - Título: ping - GET handler
  - Descripción: Validar `src/app/api/ping/route.ts` responde OK (sanity)
  - Precondición: Polyfills de Request/Response
  - #Paso: 1
  - Pasos: Invocar GET y comprobar status/texto de respuesta
  - Resultado esperado: 200 con payload de health
  - Tipo: Funcional
  - Nivel: unit (route handler)
  - Estado de diseño: Automatizado (`src/app/api/ping/__tests__/route.test.ts`)
  - Entorno: test
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO

-- ID: FRONT-API-08
  - Título: login - handlers y variantes
  - Descripción: Validar `src/app/api/login/route.ts` para login correcto, credenciales inválidas y errores upstream
  - Precondición: Polyfills y mocks
  - #Paso: 1
  - Pasos: Invocar POST con payload válido/inválido; mockear upstream y cookies
  - Resultado esperado: 200 con token en OK; errores manejados y status apropiados en fallo
  - Tipo: Funcional
  - Nivel: unit (route handler)
  - Estado de diseño: Automatizado (`src/app/api/login/__tests__/route.test.ts`)
  - Entorno: test
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO

-- ID: FRONT-API-09
  - Título: login - pruebas extra / branches
  - Descripción: Variantes y ramas de `login` para cubrir condiciones límite
  - Precondición: Polyfills y mocks
  - #Paso: 1
  - Pasos: Ejecutar tests extra para ramas alternativas y errores raros
  - Resultado esperado: Manejo de errores verificado; cobertura mejorada
  - Tipo: Funcional / cobertura
  - Nivel: unit (route handler)
  - Estado de diseño: Automatizado (`src/app/api/login/__tests__/route.extra.test.ts`, `src/app/api/login/__tests__/route.branches.test.ts`)
  - Entorno: test
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO

-- ID: FRONT-API-10
  - Título: account - GET/PUT handlers
  - Descripción: Validar `src/app/api/account/route.ts` (detalle de account) ante id válido y errores upstream
  - Precondición: Polyfills y mocks
  - #Paso: 1
  - Pasos: Invocar handlers con Requests mockeadas y comprobar respuestas
  - Resultado esperado: 200 con perfil/200 al actualizar; errores manejados
  - Tipo: Funcional
  - Nivel: unit (route handler)
  - Estado de diseño: Automatizado (`src/app/api/account/__tests__/route.test.ts`)
  - Entorno: test
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO

-- ID: FRONT-API-11
  - Título: account - tests extra
  - Descripción: Tests auxiliares para `account` que ejercitan paths alternativos
  - Precondición: Polyfills y mocks
  - #Paso: 1
  - Pasos: Ejecutar casos extra y verificar manejo de errores
  - Resultado esperado: Sin crashes; manejo adecuado de estados
  - Tipo: No-funcional (cobertura)
  - Nivel: unit (route handler)
  - Estado de diseño: Automatizado (`src/app/api/account/__tests__/route.extra.test.ts`)
  - Entorno: test
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO

-- ID: FRONT-API-12
  - Título: register - POST handler
  - Descripción: Validar `src/app/api/register/route.ts` que crea usuarios; manejar validaciones y errores upstream
  - Precondición: Polyfills y mocks
  - #Paso: 1
  - Pasos: Invocar POST con payload válido/inválido; comprobar respuesta y side-effects
  - Resultado esperado: 201 en creación; errores con status apropiado
  - Tipo: Funcional
  - Nivel: unit (route handler)
  - Estado de diseño: Automatizado (`src/app/api/register/__tests__/route.test.ts`)
  - Entorno: test
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO

-- ID: FRONT-API-13
  - Título: accounts/[account_id]/cards - list / card handlers
  - Descripción: Validar endpoints de tarjetas (`cards`) y ruta singular de tarjeta bajo `accounts/[account_id]`
  - Precondición: Polyfills y mocks de fetch/cookies
  - #Paso: 1
  - Pasos: Invocar GET/POST para listado y GET/DELETE/PUT para tarjeta singular; mockear upstream
  - Resultado esperado: 200/201 en OK; manejo de errores en fallo
  - Tipo: Funcional
  - Nivel: unit (route handlers)
  - Estado de diseño: Automatizado (`src/app/api/accounts/[account_id]/cards/__tests__/route.test.ts`, `src/app/api/accounts/[account_id]/cards/__tests__/route.extra.test.ts`, `src/app/api/accounts/[account_id]/cards/[card_id]/__tests__/route.test.ts`)
  - Entorno: test
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO

---

## Resultados y notas generales
- Suite completa (última ejecución): 2025-09-23 — Test Suites: 26 passed, 26 total; Tests: 58 passed, 58 total.
- El entorno de pruebas contiene polyfills y un stub de `fetch` por defecto; cada test mockea `fetch` cuando es necesario para escenarios específicos.
- Algunos tests intentionally mockean `jwt.decode` para simular errores; esto provoca `console.error` en la salida pero las aserciones verifican el comportamiento esperado.
- Recomendaciones siguientes:
  - Añadir caso unit para `generateAlias` que force `words.txt` vacío (equivalente a `USER-06` en el backend). Válido para tests unitarios de utilidades de usuarios.
  - Ejecutar `tsc --noEmit` y ESLint para detectar problemas restantes de tipos/estilo.

---


## Ejecución detallada por caso de prueba

A continuación se registra, por cada caso FRONT-*, los campos: Fecha de ejecución, Estado de ejecución, Resultado obtenido, Suite, Entorno, Ejecutor y Observaciones.

- ID: FRONT-UI-01
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO
  - Resultado obtenido: `Footer` renderizado correctamente y texto esperado presente.
  - Suite: `src/Components/__tests__/Footer.test.tsx`
  - Entorno: test (Jest + jsdom)
  - Ejecutor: Nicolas Troupkos
  - Observaciones: Ninguna

- ID: FRONT-UI-02
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO
  - Resultado obtenido: `PageHeader` muestra título y botones según props.
  - Suite: `src/Components/__tests__/PageHeader.test.tsx`
  - Entorno: test
  - Ejecutor: Nicolas Troupkos
  - Observaciones: Ninguna

- ID: FRONT-UI-03
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO
  - Resultado obtenido: `SearchBar` captura texto y dispara el handler esperado.
  - Suite: `src/Components/__tests__/SearchBar.test.tsx`
  - Entorno: test
  - Ejecutor: Nicolas Troupkos
  - Observaciones: Se observó una advertencia de React sobre la prop `startDecorator` de `@mui/joy/Input` en la salida de test; no afecta las aserciones.

- ID: FRONT-UI-04
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO
  - Resultado obtenido: `SlideMenu` abre/cierra correctamente y muestra items.
  - Suite: `src/Components/__tests__/SlideMenu.test.tsx`
  - Entorno: test
  - Ejecutor: Nicolas Troupkos
  - Observaciones: Ninguna

- ID: FRONT-UI-05
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO
  - Resultado obtenido: `Button` responde a clicks y respeta `disabled`.
  - Suite: `src/Components/__tests__/Button.test.tsx`
  - Entorno: test
  - Ejecutor: Nicolas Troupkos
  - Observaciones: Ninguna

- ID: FRONT-UI-06
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO
  - Resultado obtenido: `Input` actualiza su valor y llama `onChange`.
  - Suite: `src/Components/__tests__/Input.test.tsx`
  - Entorno: test
  - Ejecutor: Nicolas Troupkos
  - Observaciones: Ninguna

- ID: FRONT-UI-07
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO
  - Resultado obtenido: `Header` muestra links y botones de navegación.
  - Suite: `src/Components/__tests__/Header.test.tsx`
  - Entorno: test
  - Ejecutor: Nicolas Troupkos
  - Observaciones: Ninguna

- ID: FRONT-HOOK-01
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO
  - Resultado obtenido: `useUser` devuelve estado inicial y luego estado con usuario cargado según mocks; errores manejados en escenarios de fallback.
  - Suite: `src/hooks/__tests__/useUser.test.tsx`
  - Entorno: test (Jest + react-hooks testing library)
  - Ejecutor: Nicolas Troupkos
  - Observaciones: Mocks de fetch y providers aplicados por el test; salida contiene logs controlados.

- ID: FRONT-UI-08
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO
  - Resultado obtenido: `SlideMenu` ejecutó correctamente las ramas condicionales y mostró/ocultó items según props.
  - Suite: `src/Components/__tests__/SlideMenu.branches.test.tsx`
  - Entorno: test
  - Ejecutor: Nicolas Troupkos
  - Observaciones: Ninguna

- ID: FRONT-UI-09
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO
  - Resultado obtenido: `SlideMenu` manejó inputs no estándar sin fallos; comportamientos esperados verificados.
  - Suite: `src/Components/__tests__/SlideMenu.branches.extra.test.tsx`
  - Entorno: test
  - Ejecutor: Nicolas Troupkos
  - Observaciones: Ninguna

- ID: FRONT-UI-10
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO
  - Resultado obtenido: `Header` en variantes (usuario logueado/no) muestra controles adecuados.
  - Suite: `src/Components/__tests__/Header.extra.test.tsx`
  - Entorno: test
  - Ejecutor: Nicolas Troupkos
  - Observaciones: Ninguna

- ID: FRONT-UI-11
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO
  - Resultado obtenido: Tests auxiliares completados; cobertura incrementada en componentes seleccionados.
  - Suite: `src/Components/__tests__/Header.coverage.test.tsx`
  - Entorno: test
  - Ejecutor: Nicolas Troupkos
  - Observaciones: Diseñado para aumentar cobertura, genera logs controlados.

- ID: FRONT-UI-12
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO
  - Resultado obtenido: Ramas del `Header` ejercitadas; salida conforme a aserciones.
  - Suite: `src/Components/__tests__/Header.branches.test.tsx`
  - Entorno: test
  - Ejecutor: Nicolas Troupkos
  - Observaciones: Ninguna

- ID: FRONT-API-03
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO
  - Resultado obtenido: Handlers de `session` responden OK en escenarios felices y manejan fallos según aserciones.
  - Suite: `src/app/api/session/__tests__/route.test.ts`
  - Entorno: test
  - Ejecutor: Nicolas Troupkos
  - Observaciones: Polyfills y mocks aplicados.

- ID: FRONT-API-04
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO
  - Resultado obtenido: `logout` limpia cookies y devuelve respuesta conforme a la implementación esperada.
  - Suite: `src/app/api/logout/__tests__/route.test.ts`
  - Entorno: test
  - Ejecutor: Nicolas Troupkos
  - Observaciones: Ninguna

- ID: FRONT-API-05
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO
  - Resultado obtenido: Tests extra de `session` completados; manejo de inputs inválidos verificado.
  - Suite: `src/app/api/session/__tests__/route.extra.test.ts`
  - Entorno: test
  - Ejecutor: Nicolas Troupkos
  - Observaciones: Ninguna

- ID: FRONT-API-06
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO
  - Resultado obtenido: Coverage helpers ejecutados; sin errores.
  - Suite: `src/app/api/session/__tests__/route.coverage.test.ts`
  - Entorno: test
  - Ejecutor: Nicolas Troupkos
  - Observaciones: Ninguna

- ID: FRONT-API-07
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO
  - Resultado obtenido: `ping` devolvió status 200 y payload esperado.
  - Suite: `src/app/api/ping/__tests__/route.test.ts`
  - Entorno: test
  - Ejecutor: Nicolas Troupkos
  - Observaciones: Ninguna

- ID: FRONT-API-08
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO
  - Resultado obtenido: `login` handler responde 200 con token en escenario OK; credenciales inválidas y errores upstream manejados.
  - Suite: `src/app/api/login/__tests__/route.test.ts`
  - Entorno: test
  - Ejecutor: Nicolas Troupkos
  - Observaciones: Ninguna

- ID: FRONT-API-09
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO
  - Resultado obtenido: Tests extra de `login` (branches) completados; errores raros simulados y validados.
  - Suite: `src/app/api/login/__tests__/route.extra.test.ts`, `src/app/api/login/__tests__/route.branches.test.ts`
  - Entorno: test
  - Ejecutor: Nicolas Troupkos
  - Observaciones: Ninguna

- ID: FRONT-API-10
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO
  - Resultado obtenido: `account` handlers pasaron las aserciones para GET/PUT; errores upstream manejados.
  - Suite: `src/app/api/account/__tests__/route.test.ts`
  - Entorno: test
  - Ejecutor: Nicolas Troupkos
  - Observaciones: Ninguna

- ID: FRONT-API-11
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO
  - Resultado obtenido: Tests extra de `account` completados; manejo de paths alternativos verificado.
  - Suite: `src/app/api/account/__tests__/route.extra.test.ts`
  - Entorno: test
  - Ejecutor: Nicolas Troupkos
  - Observaciones: Ninguna

- ID: FRONT-API-12
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO
  - Resultado obtenido: `register` crea usuario en escenario OK (201) y gestiona validaciones/errores en fallos.
  - Suite: `src/app/api/register/__tests__/route.test.ts`
  - Entorno: test
  - Ejecutor: Nicolas Troupkos
  - Observaciones: Ninguna

- ID: FRONT-API-13
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO
  - Resultado obtenido: Endpoints de `accounts/[account_id]/cards` (listado y card singular) pasaron las aserciones; manejo de errores verificado.
  - Suite: `src/app/api/accounts/[account_id]/cards/__tests__/route.test.ts`, `src/app/api/accounts/[account_id]/cards/__tests__/route.extra.test.ts`, `src/app/api/accounts/[account_id]/cards/[card_id]/__tests__/route.test.ts`
  - Entorno: test
  - Ejecutor: Nicolas Troupkos
  - Observaciones: Ninguna

- ID: FRONT-LIB-01
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO
  - Resultado obtenido: `fetchers.fetchMe()` devuelve usuario en caso 200; maneja errores cuando fetch responde != 200.
  - Suite: `src/lib/__tests__/fetchers.fetchMe.test.ts`
  - Entorno: test
  - Ejecutor: Nicolas Troupkos
  - Observaciones: `fetch` fue mockeado por el test; no hubo llamadas reales a la red.

- ID: FRONT-LIB-02
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO
  - Resultado obtenido: `fetchUserFromToken()` decodifica token y retorna perfil consultando upstream; maneja error en upstream.
  - Suite: `src/lib/__tests__/user.fetchUserFromToken.test.ts`
  - Entorno: test
  - Ejecutor: Nicolas Troupkos
  - Observaciones: `jwt.decode` fue mockeado en algunos escenarios para forzar errores (esto produce `console.error` en la salida en pruebas específicas).

- ID: FRONT-LIB-03
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO
  - Resultado obtenido: `authClient` cachea y recupera perfil correctamente; `hasAuthCookie` detecta presencia según mocks.
  - Suite: `src/lib/__tests__/authClient.test.ts`
  - Entorno: test
  - Ejecutor: Nicolas Troupkos
  - Observaciones: Ninguna

- ID: FRONT-API-01
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO
  - Resultado obtenido: GET handler de `users/[id]` devolvió perfil para id válido; maneja id inexistente con 404/error según aserciones.
  - Suite: `src/app/api/users/__tests__/route.test.ts`
  - Entorno: test
  - Ejecutor: Nicolas Troupkos
  - Observaciones: Polyfills de Request/Response/Headers y NextResponse mock se usaron para ejecutar handlers en Jest.

- ID: FRONT-API-02
  - Fecha de ejecución: 2025-09-23
  - Estado de ejecución: PASADO
  - Resultado obtenido: PATCH handler de `accounts/[account_id]` realiza llamada upstream mockeada y retorna 200 en caso exitoso.
  - Suite: `src/app/api/accounts/__tests__/route.test.ts`
  - Entorno: test
  - Ejecutor: Nicolas Troupkos
  - Observaciones: Cookies y `fetch` fueron mockeados; validaciones del handler cubiertas.

---


