# Сборка фронтенда
FROM node:18 AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build  # vite build

# Сборка сервера
FROM node:18 AS backend
WORKDIR /server
COPY server/package*.json ./
RUN npm install
COPY server/ .
RUN npm run build  # tsc --project tsconfig.node.json

# Финальный образ
FROM node:18
WORKDIR /app
COPY --from=frontend /app/dist ./dist
COPY --from=backend /server/build ./server
CMD ["node", "server/index.js"]