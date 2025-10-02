# Etapa 1: build
FROM node:18-alpine AS build

WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala TODAS as dependências (incluindo dev, pra compilar TS)
RUN npm ci

# Copia o código fonte
COPY . .

# Compila o TypeScript → gera /dist
RUN npm run build

# Etapa 2: runtime
FROM node:18-alpine

WORKDIR /app

# Copia apenas os artefatos necessários do build
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Define variáveis de ambiente default (pode sobrescrever com -e ou .env)
ENV NODE_ENV=production

# Exponha a porta que sua API usa
EXPOSE 3000

# Sobe a API
CMD ["node", "dist/server.js"]
