# Usar uma imagem base do Node.js
FROM node:latest

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copiar apenas os arquivos de configuração do npm
COPY package*.json ./

# Instalar as dependências
RUN npm install --production

# Copiar o restante do código da aplicação
COPY . .

# Buildar a aplicação (se necessário, ex: com TypeScript ou Webpack)
RUN npm run build

# Definir a variável de ambiente NODE_ENV como production
ENV NODE_ENV=production

# Expor a porta em que a aplicação estará rodando
EXPOSE 3000

# Executar npx prisma db push antes de iniciar a aplicação
CMD ["sh", "-c", "npx prisma db push && npm start"]
