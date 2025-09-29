# ---------------------------------------------------------
# Etapa de build
# Se usa node:20-alpine porque algunas dependencias (p. ej. selenium-webdriver)
# requieren Node >= 20. Esto evita errores de "engine" durante la instalación.
FROM node:20-alpine AS builder
WORKDIR /app

# Copiamos los manifiestos de dependencias primero para aprovechar el cache
# de Docker cuando cambian sólo los archivos de código.
COPY package.json package-lock.json* ./

# Mostrar salida detallada de npm durante la build para facilitar depuración
ENV NPM_CONFIG_LOGLEVEL=info

# Instalamos todas las dependencias (incluyendo devDependencies necesarias
# para el build como typescript o herramientas de testing). Usamos
# --legacy-peer-deps para evitar errores por peerDependencies en entornos CI.
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Copiamos el resto del código fuente dentro del contenedor y ejecutamos
# el build de Next.js. El comando `npm run build` genera la carpeta `.next`.
COPY . .

RUN npm run build

# ---------------------------------------------------------
# Etapa de ejecución (runner)
# En esta etapa sólo copiamos lo necesario desde la etapa de build para
# ejecutar la aplicación en producción.
FROM node:20-alpine AS runner
WORKDIR /app

# Copiamos los artefactos resultantes del build y las dependencias.
# Observación: copiamos `node_modules` con devDependencies ya instaladas
# en el builder para evitar que Next intente instalar TypeScript en
# tiempo de ejecución (esto puede bloquear el inicio si hay un mismatch
# de versiones de Node o problemas de red).
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

# Variables de entorno y puerto
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
# EXPOSE es meramente documental; el mapeo real lo hace docker run / compose
EXPOSE 3000

# Comando de arranque: forzamos que Next se enlace a 0.0.0.0 para que Docker
# pueda mapear el puerto correctamente. `npx next start` ejecuta la binaria local
# instalada en node_modules.
CMD [ "npx", "next", "start", "-p", "3000", "-H", "0.0.0.0" ]
