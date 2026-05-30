# Imagem do node
FROM node:22

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do código
COPY . .

# Expõe a porta que o servidor vai rodar
EXPOSE 3000

# Comando para iniciar o app e atualizar as rotas (dev)
CMD ["npm", "run", "dev"]
