# Multi-stage Dockerfile for Next.js 15 application
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies (including dev deps needed for build like typescript)
COPY package.json package-lock.json* ./
# show npm output during build to help debugging
ENV NPM_CONFIG_LOGLEVEL=info
# Install all deps, accept legacy peer deps to avoid resolution failures in CI
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Copy source
COPY . .

# Build the Next.js app
RUN npm run build

# Remove devDependencies to keep only production deps for the final image
# On some npm versions `npm prune --production` can fail due to peer dependency
# resolution during prune. Reinstalling only production deps is more robust:
RUN rm -rf node_modules
RUN npm ci --omit=dev

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app

# Only copy necessary files from build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

ENV NODE_ENV=production
EXPOSE 3000

# Use the start script from package.json
CMD [ "npm", "start" ]
