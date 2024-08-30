# Build
FROM node:20.13.1 AS builder

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copiar apenas os arquivos de configuração do npm e do Prisma
COPY package*.json ./
COPY prisma ./prisma

# Instalar as dependências e fazer o build
RUN npm install --production=false
COPY . .
RUN npx prisma generate
RUN npm run build

# Runtime
FROM node:20.13.1 AS runtime

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copiar apenas os arquivos necessários para a execução da aplicação
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/build ./build

# Expor a porta em que a aplicação estará rodando
EXPOSE 3000

# Executar npx prisma db push antes de iniciar a aplicação
CMD ["sh", "-c", "npx prisma db push && npm start"]
